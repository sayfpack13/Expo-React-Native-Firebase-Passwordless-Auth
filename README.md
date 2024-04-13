# Passwordless Auth using Expo/React-Native + Firebase Web App + Realtime Database

This guide will walk you through setting up passwordless signin functionality in your Expo/React-Native app using Firebase Web App and Realtime Database for data exchange and listening.

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

### Explanation

- `"Method 1"`: Using the unique ID of an anonymous authenticated user (secured with Firebase Auth rules). The user can write to a document if the document already exists and the value of the "code" field in the existing data matches the value of the "code" field in the new data, or if the user is the owner of the document (identified by their user ID).
- `"Method 2"`: Using a simple unique ID (not recommended for security reasons). The user can write to a document if it already exists and the value of the "code" field in the existing data matches the value of the "code" field in the new data. However, note that this method also requires the user to guess the document UID, which adds a layer of security.
