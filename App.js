import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { sendPasswordResetEmail, signInAnonymously } from 'firebase/auth';
import { firebaseAuth, firebaseConfig, firebaseGetDB } from './Firebase';
import { get, onValue, push, ref, set } from 'firebase/database';

export default function App() {
  const [email, setemail] = useState("")
  const [isSent, setisSent] = useState(false)
  const [code, setcode] = useState(0)
  const [status, setstatus] = useState("Waiting")
  const [unsubListener, setunsubListener] = useState()

  const db_path = "/requests/"
  // make state to unique document ID once
  const [requestKey] = useState(push(ref(firebaseGetDB, "requests")).key)

  const getRequestRef = async (method = 2) => {
    if (method == 1) {
      return ref(firebaseGetDB, db_path + requestKey)
    }


    else if (method == 2) {
      const cred = await signInAnonymously(firebaseAuth)
      return ref(firebaseGetDB, db_path + cred.user.uid)
    }
  }

  useEffect(() => {
    (async () => {
      const listener = onValue(await getRequestRef(), (snapshot) => {
        const data=snapshot.val()
        if(!data){
          return
        }

        console.log(data);
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

  const resetPass = async () => {
    const newCode = generateRandomNumber()
    setcode(newCode)


    // updating existing request require previous code : {"prevCode"}
    await set(await getRequestRef(), {
      prevCode: code,
      code: newCode,
      status: "Waiting"
    })


    await sendPasswordResetEmail(firebaseAuth, email, {
      handleCodeInApp: false,
      url: "http://" + firebaseConfig.authDomain + "/?uid=" + firebaseAuth.currentUser.uid,
    })


    setisSent(true)
  }



  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40 }}>Reset Password</Text>
      {isSent ? (
        <View style={{ width: "50%", flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text>Your Code is: {code}</Text>
          <Text>Status: {status}</Text>
        </View>
      ) : (
        <View style={{ width: "50%" }}>
          <TextInput value={email} onChangeText={setemail} style={{ borderColor: "red", borderWidth: 2 }}></TextInput>
          <Button title='Reset Pass' onPress={resetPass}></Button>
        </View>
      )}


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
