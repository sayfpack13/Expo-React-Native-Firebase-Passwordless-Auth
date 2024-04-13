import { sendSignInLinkToEmail, signInAnonymously, signInWithEmailLink } from "firebase/auth";
import { onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { firebaseAuth, firebaseConfig, firebaseRDB } from "../Firebase";

export default function OTPComponent({ route }) {
    /*
    Method 1: using anonymous authenticated user unique Id (secured with firebase auth rules)
    Method 2: using simple unique Id (not recommended for security reasons)
    */
    const RequestSaveMethod = "uuId"

    const email = route.params.email || ""
    const [code, setcode] = useState(0)
    const [status, setstatus] = useState("Waiting")
    const [unsubListener, setunsubListener] = useState()
    const [errorMsg, seterrorMsg] = useState("")
    const [canSend, setcanSend] = useState(true)
    const [isSent, setisSent] = useState(false)
    const db_path = "/requests/"
    // make state to generate unique Id once
    const [requestKey] = useState(push(ref(firebaseRDB, "requests")).key)

    const getRequestRef = async () => {
        if (RequestSaveMethod == "uId") {
            return ref(firebaseRDB, db_path + requestKey)
        }


        else if (RequestSaveMethod == "uuId") {
            const cred = await signInAnonymously(firebaseAuth)
            return ref(firebaseRDB, db_path + cred.user.uid)
        }
    }

    useEffect(() => {
        (async () => {
            // init uId
            await getRequestRef()

            // send init request
            setRequest()

            const listener = onValue(await getRequestRef(), async (snapshot) => {
                const data = snapshot.val()
                if (!data || data.status != "Approved") {
                    return
                }
                setstatus(data.status)


                // delete request secret data for security reasons
                await set(await getRequestRef(), {
                    status: "Done"
                })



                await signInWithEmailLink(firebaseAuth, email, decodeURIComponent(data.emailLink)).catch((error) => {
                    if (error.code == "auth/invalid-action-code") {
                        setstatus("Link Expired/Invalid")
                    }
                })
            })
            setunsubListener(() => listener)
        })()

        return () => {
            if (unsubListener) {
                unsubListener();
            }
        }
    }, [])



    function generateRandomNumber() {
        return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    }

    const setRequest = async () => {
        setisSent(false)
        seterrorMsg("")
        setstatus("Waiting")
        const newCode = generateRandomNumber()
        setcode(newCode)





        await sendSignInLinkToEmail(firebaseAuth, email, {
            handleCodeInApp: true,
            url: "http://" + firebaseConfig.authDomain + "/?uid=" + firebaseAuth.currentUser.uid,
        }).then(async () => {
            // if updating existing request then send required previous code : {"prevCode"}
            set(await getRequestRef(), {
                prevCode: code,
                code: newCode,
                status: "Waiting"
            })

            setisSent(true)
        })
            .catch((error) => {
                if (error.code == "auth/invalid-email" || error.code == "auth/missing-email") {
                    seterrorMsg("Invalid Email")
                }
                else if (error.code == "auth/quota-exceeded") {
                    seterrorMsg("Max Attempts reached !! Try again later.")
                }
                setcanSend(false)
                setisSent(true)
            })


    }


    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {isSent ?
                <View>
                    {errorMsg ? <Text>{errorMsg}</Text>
                        :
                        <View>
                            <Text>Your Code is: {code}</Text>
                            <Text>Status: {status}</Text>
                        </View>}
                    {canSend && <Button title='Resend' onPress={setRequest}></Button>}
                </View>
                :
                <Text>Sending ...</Text>
            }
        </View>
    )

}