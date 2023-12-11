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

  const user = ref(auth.currentUser?.toJSON());
  onAuthStateChanged(auth, (_user) => {
    user.value = _user ? _user.toJSON() : undefined;
  });

  const isLoggedIn = () => {
    return !!user.value;
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
      if ( auth.currentUser ) {
        await signOut(auth);
      }
      return {};
    }
    catch (error) {
      return { error: error.message };
    }
  }

  return {
    user, isLoggedIn, register, login, logout
  }
}