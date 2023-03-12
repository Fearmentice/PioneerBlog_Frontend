import React, { Component } from "react"
import "./userPage.css"
import "../../components/header/header.css"
import {Card} from '../../components/blog/Card'

import { Helmet } from "react-helmet"
import { DownOutlined } from '@ant-design/icons';

//--API--
import { getDocsByArrayofIds, loadMoreBlogposts } from "../../Api/blogpostController"

//--DATABASE--
import { db } from "../../firebase-config";
import {getDoc,  doc} from "firebase/firestore";
import { getAuth } from "../../helpers/getAuthorizationToken"

export class userPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      id:"",
      currnetUser: {},
      userPosts:[],
      lastPost:{},
      pageSize: 3
    }
    this.setBlog = this.setBlog.bind(this);
  }

  setBlog = async(_id) => {
        //Gets the author blogpsot.
        const docRef = doc(db, "authors", _id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.setState({currnetUser: docSnap.data()});

          //Gets All the posts.
          const {posts, lastPost} = await getDocsByArrayofIds(docSnap.data().posts,
                   this.state.pageSize);

          //Pass the data to states.
          this.setState({
            userPosts: posts.reverse(), 
            lastPost: lastPost,
            currnetUser:docSnap.data()})
        } 
  }

  loadMore = async() => {
    //Starts after last loaded post and loads more posts as many as page size.
    const {posts, lastPost} = await loadMoreBlogposts( 
      [...this.state.userPosts], 
      this.state.lastPost, 
      this.state.currnetUser.posts,
      this.state.pageSize,
      null)



    this.setState({userPosts: posts, lastPost: lastPost})
}

  componentDidMount = async() => {
    const id = this.props.match.params.id;
    this.setBlog(id);

    this.setState({user: await getAuth(), id: id})
  }
  
  handleChange = e => {
    this.setState({
        [e.target.name]: e.target.value
    });
  }

  render(){
  return (
    <>
    <Helmet>
      <meta name="description" content="Who we are ? We are a group of students who try to write about right and useful informations to our dear readers. Also we are just students who want to improve himself and try to be good at writing with a excellent English language."/>
      
      <meta property="og:title" content={`${this.state.currnetUser.name}`} />
      <meta property="og:url" content={`https://www.vocham.com/author/${this.state.currnetUser.id}`} />
      <meta property="og:image" content={`${this.state.currnetUser.profilePhoto}`} />

      <meta name="twitter:card" content="summary"/>
      <meta name="twitter:title" content={`${this.state.currnetUser.description}`} />
      <meta name="twitter:description" content={`Learn about ${this.state.currnetUser.name}`} />
      <meta name="twitter:image" content={`${this.state.currnetUser.profilePhoto}`} />
    </Helmet>
    <div className="page">
        <div className="desc">
            <img className="profilePhoto" src={`${this.state.currnetUser.profilePhoto}`} alt='Profile' />    
          <div className="profile">
            <h1 style={{marginLeft:20}}>{this.state.currnetUser.name}</h1>
            <div style={{marginLeft: 20}} dangerouslySetInnerHTML={{__html: this.state.currnetUser.description}}></div>
          </div>
        </div>
    </div>
      <h1 >Author's Blogposts</h1>
      <Card category={''} posts={this.state.userPosts}/>
      <div className="Pagination">
              {/* <a onClick={() => this.onPrevious()} class="previous round paginate">{'<'}</a>
              <a onClick={() => this.loadMore()} class="nextButton round paginate">{'>'}</a> */}
               <button onClick={() => this.loadMore()}>Load More</button>
              <DownOutlined/>
      </div>
    </>
  )}
}
