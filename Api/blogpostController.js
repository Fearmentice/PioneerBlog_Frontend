//--DATABASE--
import { db } from "../../firebase-config";
import { collection, query, where, documentId, getDocs } from "firebase/firestore";

export const getDocsByArrayofIds = async (_ids) => {
    //Blogpost ref.
    const blogpostsRef = collection(db, 'blogposts');

    //Query.
    let _posts = [];
    const queryRef = query(blogpostsRef,
        where("active", "==", true),
        where(documentId(), "in", _ids));
    const userPostSnap = await getDocs(queryRef);
    await userPostSnap.forEach((doc) => {
        _posts.push({ ...doc.data(), id: doc.id });
    })
    return _posts;
}