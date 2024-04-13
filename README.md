# Passwordless Auth using Expo/React-Native + Firebase Web App + Realtime Database

This guide will walk you through setting up passwordless signin functionality in your Expo/React-Native app using Firebase Web App and Realtime Database for data exchange and listening.


## How it Works ? (2 Methods)
- OTP (One-Time Password) Authentication: The process begins with the mobile app writing the user's unique ID (UID) to the email link sent to the user. When the user clicks the link, they are directed to the web app where they input the OTP code displayed in the mobile app. Subsequently, the web app writes to the Realtime Database on the request document with the provided 'UID'. If the provided 'code' matches the security rules for write access, the emailLink will be written. Finally, the mobile app listens for changes in the same document 'UID' and retrieves the emailLink to authenticate.

- QR Code Authentication: The QR code is generated within the web application, based on the authentication email link parameters. The user then scan this QR code using the mobile application to authenticate themselves seamlessly. This method provides an intuitive and secure means of authentication, enhancing the user experience while maintaining robust security measures.

## Security Rules

```json
{
  "rules": {
    "requests": {
      "$documentId": {
        // Method 1: using anonymous authenticated user unique Id (secured with firebase auth rules)
        ".write": "(data.exists() && data.child('code').val() == newData.child('code').val()) || $documentId == auth.uid",
        ".read": "$documentId == auth.uid"
        
        // Method 2: using simple unique Id (not recommended for security reasons)
        //".write": "data.exists() && data.child('code').val() == newData.child('code').val()",
        //".read": "true"
      }
    }
  }
}

```

### Rules Explanation

- `"Method 1"`: Using the unique ID of an anonymous authenticated user (secured with Firebase Auth rules). The user can write to a document if the document already exists and the value of the "code" field in the existing data matches the value of the "code" field in the new data (used in web app to confirm/complete passwordless process), or if the user is the owner of the document (identified by their user ID).
- `"Method 2"`: Using a simple unique ID (not recommended for security reasons). The user can write to a document if it already exists and the value of the "code" field in the existing data matches the value of the "code" field in the new data. However, note that this method also requires the user to guess the document UID, which adds a layer of security.


