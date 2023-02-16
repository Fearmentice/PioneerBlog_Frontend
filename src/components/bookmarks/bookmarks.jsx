import  React, { Component } from "react";
import './bookmarks.css'
import { Card } from "../blog/Card";

//--DATABASE--
import { db } from "../../firebase-config";
import { getDoc, collection, query, where, documentId, getDocs, doc, updateDoc, arrayRemove } from "firebase/firestore";

import notFound from '../../assets/images/not-Found.gif'

export class bookmarks extends Component {
    constructor(props){
        super(props)

        this.state = {
            posts: [],
            user: {},
            isDataGet: false
        }
    }

    //Gets the logged in user data if there is.
    userInfo = async () => {
        if (!localStorage.getItem("jwtToken")) return window.location.replace('/login');
        const docRef = doc(db, "users", localStorage.getItem("jwtToken"));
        const docSnap = await getDoc(docRef);
        const _user = { ...docSnap.data(), id: docSnap.id };
        this.setState({user: _user});
        this.setState({isDataGet: true})
        return _user;
    }

    getMyBookmarks = async() => {
        const user = await this.userInfo();
        console.log(user)
        //Blogpost ref.
        const blogpostsRef = collection(db, 'blogposts');

        //Query.
        let _posts = [];
        const queryRef = query(blogpostsRef,  
            where("active", "==", true),
            where(documentId() , "in", user.bookmarkedPosts));
        const userPostSnap = await getDocs(queryRef);
        await userPostSnap.forEach((doc) => {
          _posts.push({...doc.data(), id:doc.id });
        })
        this.setState({posts: _posts})
        console.log(_posts)

    }

    componentDidMount() {
        this.getMyBookmarks();
    }

    render(){
        return(
            <div className="page">
                <h1>MyBookmarks</h1>
                {this.state.isDataGet && this.state.user.bookmarkedPosts.length == 0 ?
                    <div className="notFound">
                        <h4>Oops...</h4>
                        <img src={notFound}/>
                        <h5>It seems you don't have any bookmarked post.</h5>
                        <h6>Have look at posts and bookmark the ones you liked</h6>
                    </div>
                :
                <Card posts={this.state.posts}/>}
            </div> 
        )
    }
}