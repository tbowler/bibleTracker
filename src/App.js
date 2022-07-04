import React from "react";
import './App.css';
import { initializeApp } from 'firebase/app';
import { getDatabase} from "firebase/database";
// FOR AUTHENTICATION
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Box } from '@mui/material';
import AppBar from './components/AppBar';
import BibleBooks from './components/BibleBooks';

console.log(process.env);
const app = initializeApp({
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
});
// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);
const auth = getAuth();
const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential.accessToken;
    // The signed-in user info.
    // const user = result.user;
    // ...
  }).catch((error) => {
    // Handle Errors here.
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // The email of the user's account used.
    // const email = error.customData.email;
    // The AuthCredential type that was used.
    // const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
};

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <AppBar signInWithGoogle={signInWithGoogle} auth={auth} user={user} name='Bible Tracker' />
      <Box component="main" sx={{ p: 3 }}>
      {user && <BibleBooks db={db} user={user}/>}
      </Box>
    </div>
  ); 
}

export default App;
