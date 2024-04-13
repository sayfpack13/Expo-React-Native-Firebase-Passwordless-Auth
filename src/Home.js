import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function Home() {
    const navigation = useNavigation()
    const [email, setemail] = useState("")

    
    return (
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text style={{ fontSize: 40 }}>Passwordless Signin</Text>

            <View style={{ width: "60%" }}>
                <TextInput value={email} onChangeText={setemail} style={{ borderColor: "red", borderWidth: 2 }}></TextInput>
                <Button title='Signin using OTP' onPress={() => { navigation.navigate("otp",{email}) }}></Button>
                <Button title='Signin using QR' onPress={() => { navigation.navigate("qr",{email}) }}></Button>
            </View>
        </View>
    )
}
