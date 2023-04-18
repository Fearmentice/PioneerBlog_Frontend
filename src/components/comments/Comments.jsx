import React from "react";
import defaultUserImage from '../../assets/images/defaultUser.jpg'

//--DATABASE--
import { db } from "../../firebase-config";
import {collection, getDoc, doc, addDoc, Timestamp, updateDoc} from "firebase/firestore";

export const Comments = (props) => {
    const {comments, user, handleChange, 
            id, newCommentBody, setComments} = props;

    //Creates comment in the name of logged in user.
    const createComment = async() => {
        // Add a new document in collection "comments"
        const newCommentsRef = collection(db, "comments");
        const newCommentData = {
            blogpostId: id,
            body: newCommentBody,
            created_At: Timestamp.now(),
            userId: {
            userId: user.id,
            name:  user.username,
            }
        }
        const _id = await (await addDoc(newCommentsRef, newCommentData)).id;

        let _comments = comments;
        _comments.push({...newCommentData, user: user});
        setComments(_comments);

        console.log(id)
        const docRef = doc(db, "blogposts", id);
        const docSnap = await getDoc(docRef);

        console.log(_id)
        const data = {
            commentsId: [...docSnap.data().commentsId, _id]
        }

        await updateDoc(docRef, data);
        const userRef = doc(db, "users", user.id);
        const userSnap = await getDoc(userRef);

        console.log(user.id)

        const userData = {
            commentsId: [...userSnap.data().commentsId, _id]
        }

        await updateDoc(userRef, userData);
    }

    return(
        <>
            {/* --COMMENTS-- */}
            <div className="commentsBox">
            <div className="commentTitleBox">
                <h3 >Comments</h3>
            </div>
            <div className="commentCardBox">
                {comments.map((comment) => (
                <div className="commentCard">
                    <div className="commentCardHeader">
                    <img src={comment.user.profilePhoto ? `${comment.user.profilePhoto}`: defaultUserImage} alt='Profile of the writer of the comment.'/>
                    <div className="commentContent">
                        <b>{comment.userId.name}</b>
                        <p >{comment.body}</p>
                    </div>
                    </div>
                </div>
                ))}
                <div className="commentCard">
                    <div className="commentCardHeader">
                    <img src={user != null ? user.profilePhoto : defaultUserImage} alt='Comment profile.'/>
                    <div className="commentContent">
                        <b>Make a Comment</b>
                        <input placeholder="Share us what you think" type='text' onChange={(e) => handleChange(e)} name={"newCommentBody"} required />
                        {user != null ?
                        <button onClick={() => createComment()} className='button' >Share</button>
                        :
                        <button onClick={() => window.location.replace('/login')} className='button' >Login</button>
                        }
                    </div>
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}