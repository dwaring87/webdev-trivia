import { initializeApp } from "firebase/app";
import {
  getAuth, onAuthStateChanged, updateProfile, signOut,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail,
  GoogleAuthProvider, signInWithRedirect, getRedirectResult, signInAnonymously
} from "firebase/auth";

const initializing = ref(true);
const { public:config } = useRuntimeConfig();
if ( config.firebase?.apiKey === 'NOT_SET' ) throw new Error('Firebase API Key not set!');
const app = initializeApp(config.firebase);
const auth = getAuth(app);

export default () => {

  // Catch login redirect results and errors
  getRedirectResult(auth).then(() => {}).catch((error) => {
    alert("Error: Could not login with the requested provider [" + error.message + "]");
  });

  // User properties to make available to the app
  // Update the properties when the auth state has changed
  const email = ref(auth.currentUser?.email);
  const displayName = ref(auth.currentUser?.displayName);
  const id = ref(auth.currentUser?.uid)
  onAuthStateChanged(auth, (_user) => {
    id.value = _user?.uid;
    email.value = _user?.email || (id.value ? `anonymous <${id.value.substring(0,4)}...${id.value.substring(id.value.length-4)}>` : undefined);
    displayName.value = _user?.displayName;
    initializing.value = false;
  });

  // Check if there is a logged in user
  // loggedIn = when the current user id is set
  const isLoggedIn = () => {
    return !!id.value;
  }

  // Register a new user using an email and password
  const register = async (name, email, password) => {
    try {
      initializing.value = true;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
    }
    catch (error) {
      initializing.value = false;
      return error.message.replace("Firebase: ", "");
    };
  }

  // Login an existing user with an email and password
  const login = async (email, password) => {
    try {
      initializing.value = true;
      await signInWithEmailAndPassword(auth, email, password);
    }
    catch (error) {
      initializing.value = false;
      return error.message.replace("Firebase: ", "");;
    }
  }

  // Login using the Google provider
  const loginWithGoogle = async () => {
    try {
      initializing.value = true;
      const provider = new GoogleAuthProvider();
      signInWithRedirect(auth, provider);
    }
    catch (error) {
      initializing.value = false;
      return error.message.replace("Firebase: ", "");;
    }
  }

  // Login Anonymously
  const loginAnonymously = async () => {
    try {
      initializing.value = true;
      await signInAnonymously(auth);
    }
    catch (error) {
      initializing.value = false;
      return error.message.replace("Firebase: ", "");;
    }
  }

  // Logout the currently logged in user
  const logout = async () => {
    try {
      initializing.value = true;
      await signOut(auth);
    }
    catch (error) {
      initializing.value = false;
      return error.message.replace("Firebase: ", "");;
    }
  }

  // Request password reset email
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    }
    catch (error) {
      return error.message.replace("Firebase: ", "");;
    }
  }

  return {
    initializing, id, email, displayName, 
    isLoggedIn, register, logout, resetPassword, 
    login, loginWithGoogle, loginAnonymously
  }
}