import { initializeApp } from "firebase/app";
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
  updateProfile, signInWithEmailAndPassword, signOut
} from "firebase/auth";

export default () => {
  const { public:config } = useRuntimeConfig();
  const app = initializeApp(config.firebase);
  const auth = getAuth(app);

  // === AUTH / USER FUNCTIONS ==== //

  const email = ref(auth.currentUser?.email);
  const displayName = ref(auth.currentUser?.displayName);
  onAuthStateChanged(auth, (_user) => {
    email.value = _user?.email;
    displayName.value = _user?.displayName;
  });

  const isLoggedIn = () => {
    return !!email.value;
  }

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

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    }
    catch (error) {
      return { error: error.message };
    }
  }

  const logout = async () => {
    try {
      await signOut(auth);
      return {};
    }
    catch (error) {
      return { error: error.message };
    }
  }

  return {
    email, displayName, isLoggedIn, register, login, logout
  }
}