//--DATABASE--
import { db } from "../firebase-config";
import { getDoc, doc, updateDoc, arrayRemove } from "firebase/firestore";

export const bookmarkPost = async (_id, user) => {
    if (user == null) window.location.replace('/login')

    //Get blogpsot.
    const userRef = doc(db, "users", user.id);
    const userSnap = await getDoc(userRef);
    const oldBookmarkedPosts = [...userSnap.data().bookmarkedPosts]
    if (oldBookmarkedPosts.includes(_id)) return;
    const newBookmarkedPosts = [...oldBookmarkedPosts, _id];

    const userUpdateData = {
        bookmarkedPosts: newBookmarkedPosts
    }
    await updateDoc(userRef, userUpdateData).then(() => {
        const _user = { ...user };
        _user.bookmarkedPosts.push(_id);
    });

    //Get blogpsot.
    const docRef = doc(db, "blogposts", _id);
    const docSnap = await getDoc(docRef);

    const data = {
        favCount: docSnap.data().favCount + 1
    }

    await updateDoc(docRef, data);
}

export const removeBookmarkPost = async (_id, user) => {
    if (user == null) window.location.replace('/login')

    //Get blogpsot.
    const userRef = doc(db, "users", user.id);
    const userSnap = await getDoc(userRef);
    const oldBookmarkedPosts = [...userSnap.data().bookmarkedPosts]
    if (!oldBookmarkedPosts.includes(_id)) return;

    const userUpdateData = {
        bookmarkedPosts: arrayRemove(_id)
    }
    await updateDoc(userRef, userUpdateData).then(() => {
        const _user = { ...user };
        const index = _user.bookmarkedPosts.indexOf(_id);
        _user.bookmarkedPosts.splice(index, 1);
    });

    //Get blogpsot.
    const docRef = doc(db, "blogposts", _id);
    const docSnap = await getDoc(docRef);

    const data = {
        favCount: docSnap.data().favCount - 1
    }

    await updateDoc(docRef, data);
}