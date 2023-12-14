import { initializeApp } from "firebase/app";
import {
  getAuth, onAuthStateChanged, updateProfile, signOut,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail,
  GoogleAuthProvider, signInWithRedirect, getRedirectResult, signInAnonymously
} from "firebase/auth";

const { public:config } = useRuntimeConfig();
const app = initializeApp(config.firebase);
const auth = getAuth(app);

export default () => {

  // Catch login redirect results and errors
  getRedirectResult(auth).then((result) => {
  }).catch((error) => {
    alert("Error: Could not login with the requested provider [" + error.message + "]");
  });

  // User properties to make available to the app
  const email = ref(auth.currentUser?.email);
  const displayName = ref(auth.currentUser?.displayName);
  const id = ref(auth.currentUser?.uid)
  onAuthStateChanged(auth, (_user) => {
    id.value = _user?.uid;
    email.value = _user?.email || (id.value ? `anonymous <${id.value.substring(0,4)}...${id.value.substring(id.value.length-4)}>` : undefined);
    displayName.value = _user?.displayName;
  });

  // Check if there is a logged in user
  const isLoggedIn = () => {
    return !!id.value;
  }

  // Register a new user using an email and password
  const register = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      return { user: auth.currentUser }
    }
    catch (error) {
      return { error: error.message };
    };
  }

  // Login an existing user with an email and password
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { user: auth.currentUser };
    }
    catch (error) {
      return { error: error.message };
    }
  }

  // Logout the currently logged in user
  const logout = async () => {
    try {
      await signOut(auth);
      return {};
    }
    catch (error) {
      return { error: error.message };
    }
  }

  // Login using the Google provider
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      signInWithRedirect(auth, provider);
      return { };
    }
    catch (error) {
      return { error: error.message };
    }
  }

  // Login Anonymously
  const loginAnonymously = async () => {
    try {
      await signInAnonymously(auth);
      return { };
    }
    catch (error) {
      return { error: error.message }
    }
  }

  // Request password reset email
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { };
    }
    catch (error) {
      return { error: error.message }
    }
  }

  return {
    id, email, displayName, 
    isLoggedIn, register, logout, resetPassword, 
    login, loginWithGoogle, loginAnonymously
  }
}