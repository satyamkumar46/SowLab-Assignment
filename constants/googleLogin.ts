import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithRedirect,
    User,
} from "firebase/auth";
import { auth } from "./firebase";

const provider: GoogleAuthProvider = new GoogleAuthProvider();

async function loginWithGoogle(): Promise<void> {
  try {
    const result: any = await signInWithRedirect(auth, provider);

    const user: any = result.user;

    console.log("Google user:", user);

    const token: string = await user.getIdToken();

    console.log("Google ID Token:", token);
  } catch (error) {
    console.error("Google login error:", error);
  }
}

onAuthStateChanged(auth, (user: User | null) => {
  if (user) {
    console.log("User is signed in:", user);
  } else {
    console.log("No user is signed in.");
  }
});

async function logout(): Promise<void> {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Logout error:", error);
  }
}
export { loginWithGoogle, logout };
