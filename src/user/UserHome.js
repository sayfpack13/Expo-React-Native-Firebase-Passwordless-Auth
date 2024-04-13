import { Button, Text, View } from "react-native";
import { firebaseAuth } from "../../Firebase";
import { signOut } from "firebase/auth";

export default function UserHome() {
    return (
        <View>
            <Text>Welcome {firebaseAuth.currentUser.email}</Text>
            <Button title="Logout" onPress={()=>{signOut(firebaseAuth)}}></Button>
        </View>
    )
}