# Passwordless Signin using Expo/React-Native + Firebase Web App + Realtime Database

This guide will walk you through setting up passwordless signin functionality in your Expo/React-Native app using Firebase Web App and Realtime Database for data exchange and listening.

## Security Rules

```json
{
  "rules": {
    "requests": {
      "$documentId": {
        ".write": "(data.exists() && (data.child('code').val() == newData.child('prevCode').val() || data.child('code').val() == newData.child('code').val())) || $documentId == auth.uid",
        ".read": "$documentId == auth.uid"
      }
    }
  }
}
