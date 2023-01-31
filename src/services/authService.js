import { setAuthorizationToken } from '../helpers/setAuthorizationToken';
import { db } from "../firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import bcrypt from 'bcryptjs'

const login = async (email, password) => {
    const usersRef = collection(db, "users");
    const queryRef = query(usersRef, where("email", "==", `${email}`));
    const docSnap = await getDocs(queryRef);
    const user = { ...docSnap.docs[0].data(), id: docSnap.docs[0].id }
    console.log("Logged in user: " + user);

    await bcrypt.compare(password, user.password, function (err, result) {
        const token = user.id;
        localStorage.setItem("jwtToken", token);
        setAuthorizationToken(token);
    });
    return user;
}

const logout = () => {
    localStorage.removeItem("jwtToken");
    setAuthorizationToken(false);
}

export default { login, logout };