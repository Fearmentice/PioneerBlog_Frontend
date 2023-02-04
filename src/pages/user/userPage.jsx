import React, { Component } from "react"
import "./userPage.css"
import "../../components/header/header.css"
import defaultUserImage from "../../assets/images/defaultUser.jpg"
import {Card} from '../../components/blog/Card'
//--DATABASE--
import { db } from "../../firebase-config";
import {collection, getDoc, getDocs, doc, query,
   orderBy, limit, where} from "firebase/firestore";

export class userPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      id:"",
      currnetUser: {},
      userPosts:[],
      user: {},
      comments: [],
      newCommentBody: ''
    }
    this.setBlog = this.setBlog.bind(this);
    this.setComments = this.setComments.bind(this);
    this.userInfo = this.userInfo.bind(this);
    this.setUserPosts =this.setUserPosts.bind(this);
  }

  setUserId = async(_id) => {
    await this.setState({ id: _id });
    if(this.state.id){
      this.setBlog();
    }
  }

  setBlog = async() => {
        //Get blogpsot.
        const docRef = doc(db, "authors", this.state.id);
        const docSnap = await getDoc(docRef);
        console.log(docSnap);

        if (docSnap.exists()) {
          this.setState({currnetUser: docSnap.data()});


          //Blogpost ref.
          const blogpostsRef = collection(db, 'blogposts');

          //Query.
          const queryRef = query(blogpostsRef,  
            where("active", "==", true), 
            where("author", "==", `${docSnap.data().name}`),
            orderBy("publishDate", "desc"));
          const userPostSnap = await getDocs(queryRef);
          let _posts = [];
          userPostSnap.forEach((doc) => {
            _posts.push({...doc.data(), id:doc.id });
          })
          console.log(_posts);
          this.setUserPosts(_posts);
        } 

        
  }

  setComments = async(commentsArr) => {
    this.setState({comments: commentsArr});
  }

  setUserPosts = async(posts) => {
    this.setState({userPosts: posts})
  }

  handleChange = e => {
    this.setState({
        [e.target.name]: e.target.value
    });
  }

//AT LAST CHECK IF NECESSERY.
  userInfo = async() => {
    if(!localStorage.getItem("jwtToken")) return this.setState({user: null});
    const docRef = doc(db, "users", localStorage.getItem("jwtToken"));
    const docSnap = await getDoc(docRef);
    const _user = {...docSnap.data(),id: docSnap.id};
    this.setState({user: _user}) ;
  }

  loginPage = async() => {
    window.location.replace('/login');
  }



  componentDidMount(){
    const id = this.props.match.params.id;
    this.setUserId(id);
    this.userInfo();
  }

  render(){
  return (
    <>
    <div className="page">
        <div className="desc">
            <img className="profilePhoto" src={`${this.state.currnetUser.profilePhoto}`} alt='UserProfilePhoto' />    
          <div className="profile">
            <h1 style={{marginLeft:20}}>{this.state.currnetUser.name}</h1>
            <p style={{marginLeft:20}}>{this.state.currnetUser.description}</p>
          </div>
        </div>
    </div>
      <h1 style={{marginLeft:50}}>Author's Blogposts</h1>
      <Card style={{}} category={''} posts={this.state.userPosts}/>
    </>
  )
      }
}
