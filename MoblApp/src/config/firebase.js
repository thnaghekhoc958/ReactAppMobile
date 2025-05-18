import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDP70qYN5RCJBAiBGklbJMpcqJ9br0MKG8",
  authDomain: "projectauthenticationaaa.firebaseapp.com",
  projectId: "projectauthenticationaaa",
  storageBucket: "projectauthenticationaaa.appspot.com", 
  messagingSenderId: "628916149208",
  appId: "1:628916149208:web:c781e6ac11cb881a6a70ad",
  measurementId: "G-LPF2M7YM3T"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, firestore, analytics }; 