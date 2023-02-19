//--DATABASE--
import { db } from "../firebase-config";
import {
    collection, query,
    startAfter, where, documentId, orderBy, getDocs, limit
} from "firebase/firestore";

export const getDocsByArrayofIds = async (_ids, pageSize) => {
    //Blogpost ref.
    const blogpostsRef = collection(db, 'blogposts');

    //Query.
    let _posts = [];
    const queryRef = query(blogpostsRef,
        where("active", "==", true),
        where(documentId(), "in", _ids),
        limit(pageSize ? pageSize : 10));
    const userPostSnap = await getDocs(queryRef);
    await userPostSnap.forEach((doc) => {
        _posts.push({ ...doc.data(), id: doc.id });
    })
    return { posts: _posts, lastPost: userPostSnap.docs[userPostSnap.docs.length - 1] };
}

export const loadMoreBlogposts = async (loadedPosts, lastPost, idArray, pageSize, category) => {
    //Blogpost ref.
    const blogpostsRef = collection(db, 'blogposts');

    //Gets by publish order.
    let queryRef = query(blogpostsRef,
        where("active", "==", true),
        orderBy("publishDate", "desc"),
        startAfter(lastPost ? lastPost : 0),
        limit(pageSize));

    //Gets by passing id Array.
    if (idArray != null) {
        queryRef = query(blogpostsRef,
            where("active", "==", true),
            where(documentId(), "in", idArray),
            startAfter(lastPost ? lastPost : 0),
            limit(pageSize));
    }
    if (category != null) {
        queryRef = query(blogpostsRef,
            where("active", "==", true),
            orderBy("publishDate", "desc"),
            where("category", "==", `${category}`),
            startAfter(lastPost ? lastPost : 0),
            limit(pageSize));
    }

    const docSnap = await getDocs(queryRef);

    //Check if there is next page.
    if (docSnap == null) return;

    let _posts = [...loadedPosts];
    docSnap.forEach((doc) => {
        _posts.push({ ...doc.data(), id: doc.id });
    })

    return {
        posts: _posts, lastPost: docSnap.docs[docSnap.docs.length - 1],
        firstPost: docSnap.docs[0]
    }
}