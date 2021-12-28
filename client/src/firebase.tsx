import "firebase/compat/auth"
import firebase from "firebase/compat/app"

/*
Used demo-accounts to demonstrate
data retrieval based on a specific sensor owner.

Two demo-accounts used. Authentification via mail & pw:
mail account 1: dqr356@development.com
pw account 1: dqradar468

mail account 2: dqr357@development.com
pw account 2: dqradar468
*/

const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
});

export const auth = app.auth()
export default app