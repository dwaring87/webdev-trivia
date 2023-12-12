import { initializeApp } from "firebase/app";
import {
  getAuth, onAuthStateChanged, updateProfile, signOut,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  GoogleAuthProvider, signInWithRedirect, getRedirectResult
} from "firebase/auth";

const { public:config } = useRuntimeConfig();
const app = initializeApp(config.firebase);
const auth = getAuth(app);
const currentGameKey = useLocalStorage('current-game');

export default () => {

  // Catch login redirect results and errors
  getRedirectResult(auth).then((result) => {
  }).catch((error) => {
    alert("Error: Could not login with the requested provider [" + error.message + "]");
  });

  // User properties to make available to the app
  const email = ref(auth.currentUser?.email);
  const displayName = ref(auth.currentUser?.displayName);
  onAuthStateChanged(auth, (_user) => {
    email.value = _user?.email;
    displayName.value = _user?.displayName;
  });

  // Check if there is a logged in user
  const isLoggedIn = () => {
    return !!email.value;
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
      currentGameKey.value = '';
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
      currentGameKey.value = '';
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

  return {
    email, displayName, isLoggedIn, register, login, logout, loginWithGoogle
  }
}