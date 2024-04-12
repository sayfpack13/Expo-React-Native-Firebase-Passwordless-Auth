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

### Explanation

- `"requests"`: This is the name of the collection in the Realtime Database where these rules apply. In this case, it's assumed that there's a collection named "requests".

- `"$documentId"`: This is a wildcard that represents any document (or node) within the "requests" collection. It allows us to apply these rules to every document within that collection.

- `".write"`: This specifies the write rule, determining who can write (create, update, or delete) data in the database.

  - `(data.exists() && (data.child('code').val() == newData.child('prevCode').val() || data.child('code').val() == newData.child('code').val())) || $documentId == auth.uid`: This is a complex condition that combines several checks:
    - `data.exists()`: This ensures that the data being modified (if it already exists) must meet certain conditions.
    - `data.child('code').val() == newData.child('prevCode').val()`: This checks if the value of the "code" field in the existing data matches the value of the "prevCode" field in the new data. This condition is typically used for update operations.
    - `data.child('code').val() == newData.child('code').val()`: This checks if the value of the "code" field in the existing data matches the value of the "code" field in the new data. This condition is typically used for verification+update operations.
    - `$documentId == auth.uid`: This part allows the user to write to their own document (identified by their user ID) regardless of the other conditions.

- `".read"`: This specifies the read rule, determining who can read (fetch) data from the database.

  - `"$documentId == auth.uid"`: This condition allows a user to read from their own document (identified by their user ID) and denies access to all other documents.
