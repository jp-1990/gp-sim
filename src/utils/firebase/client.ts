import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCCyu02VGMlSsfjdkjghNXTBj4EEsm5lbE',
  authDomain: 'project-gp-sim.firebaseapp.com',
  projectId: 'project-gp-sim',
  storageBucket: 'project-gp-sim.appspot.com',
  messagingSenderId: '372668343645',
  appId: '1:372668343645:web:e5776754c369c2ef1174b4'
};
initializeApp(firebaseConfig);

const auth = getAuth();

export { signInWithEmailAndPassword } from 'firebase/auth';
export { auth };
