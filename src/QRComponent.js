import { sendSignInLinkToEmail, signInAnonymously, signInWithEmailLink } from "firebase/auth";
import { onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { firebaseAuth, firebaseConfig, firebaseRDB } from "../Firebase";

export default function QRComponent({ route }) {
    const email = route.params.email || ""
    const [errorMsg, seterrorMsg] = useState("")
    const [canSend, setcanSend] = useState(true)
    const [isSent, setisSent] = useState(false)


    useEffect(() => {
        setRequest()
    }, [])


    const scanQR = () => {

    }

    const setRequest = async () => {
        seterrorMsg("")
        setisSent(false)


        await sendSignInLinkToEmail(firebaseAuth, email, {
            handleCodeInApp: true,
            url: "http://" + firebaseConfig.authDomain + "/?qr=true",
        }).then(async () => {
            setisSent(true)
        }).catch((error) => {
            console.log(error);
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
                    {errorMsg ? <Text>{errorMsg}</Text> : <Button title='Scan QR' onPress={scanQR}></Button>}
                    {canSend && <Button title='Resend' onPress={setRequest}></Button>}
                </View>
                :
                <Text>Sending ...</Text>
            }
        </View>
    )

}