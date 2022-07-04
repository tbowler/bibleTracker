import React from "react";
import './App.css';
import _ from 'lodash';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, update, onValue} from "firebase/database";
// import { getFirestore, collection, getDocs, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
// FOR AUTHENTICATION
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Button, Grid, Box, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import AppBar from './components/AppBar';
import BibleBooks from './components/BibleBooks';

const app = initializeApp({
  apiKey: "AIzaSyBCHfjf5pQREWoryWBntw-8hgRT6YX28wk",
  authDomain: "bibletracker-2c072.firebaseapp.com",
  projectId: "bibletracker-2c072",
  storageBucket: "bibletracker-2c072.appspot.com",
  messagingSenderId: "3376467569",
  appId: "1:3376467569:web:7c0829404984f309c0d5d0"
});
// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);
const auth = getAuth();
const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log(user);
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
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
