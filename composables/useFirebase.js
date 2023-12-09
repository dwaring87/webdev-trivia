import { initializeApp } from "firebase/app";

export default () => {
  const { public:config } = useRuntimeConfig();

  console.log("====> USE FIREBASE <====");
  console.log(config.firebase);

  // Initialize Firebase
  const app = initializeApp(config.firebase);



  const isLoggedIn = () => {
    return false;
  }

  return { isLoggedIn }
}