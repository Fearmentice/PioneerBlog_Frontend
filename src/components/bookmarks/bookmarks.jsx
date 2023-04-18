import  React, { Component } from "react";
import './bookmarks.css'
import { Card } from "../blog/Card";

import { BsBookmark } from "react-icons/bs"

//--API--
import { getDocsByArrayofIds } from "../../Api/blogpostController";

//--HELPERS--
import { getAuth } from '../../helpers/getAuthorizationToken'

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
        const _user = await getAuth();
        this.setState({user: _user, isDataGet: true});
        return _user;
    }

    //Gets all the data about user and bookmarked posts.
    getMyBookmarks = async() => {
        //Gets user.
        const user = await this.userInfo();
        //Gets bookmarked posts by user.
        const { posts } = await getDocsByArrayofIds(user.bookmarkedPosts);
        this.setState({posts: posts})
    }

    componentDidMount() {
        this.getMyBookmarks();
    }

    render(){
        return(
            <div className="page">
                <div className="title">
                    <BsBookmark className="icon"/>
                    <h1 >My Bookmarks</h1>
                </div>
                {this.state.isDataGet && this.state.user.bookmarkedPosts.length === 0 ?
                    <div className="notFound">
                        <h4>Oops...</h4>
                        <img src={notFound} alt='Not found gif.'/>
                        <h5>It seems you don't have any bookmarked post.</h5>
                        <h6>Have look at posts and bookmark the ones you liked</h6>
                    </div>
                :
                <Card posts={this.state.posts}/>}
            </div> 
        )
    }
}