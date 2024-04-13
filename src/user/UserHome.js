import { Text, View } from "react-native";
import { firebaseAuth } from "../../Firebase";

export default function UserHome() {
    return (
        <View>
            <Text>Welcome {firebaseAuth.currentUser.email}</Text>
        </View>
    )
}