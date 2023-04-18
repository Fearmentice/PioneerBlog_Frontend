import { db } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";

//Gets the logged in user data if there is.
export const getAuth = async () => {
    if (!localStorage.getItem("jwtToken")) return null;
    const docRef = doc(db, "users", localStorage.getItem("jwtToken"));
    const docSnap = await getDoc(docRef);
    const _user = { ...docSnap.data(), id: docSnap.id };
    return _user;
}