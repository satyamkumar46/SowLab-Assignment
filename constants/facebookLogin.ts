import { Auth, FacebookAuthProvider, signInWithPopup } from "firebase/auth";

const provider: FacebookAuthProvider = new FacebookAuthProvider();

const signInWithFacebook = async (auth: Auth): Promise<void> => {
  await signInWithPopup(auth, provider);
};

export { signInWithFacebook };
