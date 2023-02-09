import React, { Component } from "react"
import { Link } from "react-router-dom"

//--ASSESTS--
import "./details.css"
import {categories} from '../../assets/data/data'
import "../../components/header/header.css"
import defaultUserImage from "../../assets/images/defaultUser.jpg"

//--ICONS--
import {MdEmail} from "react-icons/md"
import {  AiFillEdit } from "react-icons/ai"
import { AiFillTwitterCircle, AiFillLinkedin, } from "react-icons/ai"
import { BsFacebook } from "react-icons/bs"
import { RiDeleteBin6Line } from 'react-icons/ri';

//--DATABASE--
import { db } from "../../firebase-config";
import {collection, getDoc, getDocs, doc, query,
   orderBy, limit, addDoc, Timestamp, updateDoc, where} from "firebase/firestore";

export class DetailsPages extends Component {
  //Defines all states and callback functions.
  constructor(props) {
    super(props)

    this.state = {
      id:"",
      blog: {},
      popularPosts:[],
      user: {},
      comments: [],
      newCommentBody: '',
      author:{}
    }
    this.setBlog = this.setBlog.bind(this);
    this.setComments = this.setComments.bind(this);
    this.setPopularPosts = this.setPopularPosts.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.userInfo = this.userInfo.bind(this);
  }

  //Runs one time in render ands triggers setId, setPopularPosts and userInfo.
  componentDidMount(){
      const id = this.props.match.params.id;
      this.setId(id);
      this.setPopularPosts();
      this.userInfo();
  }

  //Sets the id state and runs setBlog function.
  setId = async(_id) => {
    await this.setState({ id: _id });
    if(this.state.id){
      this.setBlog();
    }
  }

  //Gets the blog from database by id state.
  setBlog = async() => {
    //Get blogpsot.
    const docRef = doc(db, "blogposts", this.state.id);
    const docSnap = await getDoc(docRef);
    //Get comments of blogpost
    const commenstIds = docSnap.data().commentsId;
    let commentsArr = [];
    if(commenstIds != null) {
      await commenstIds.forEach(async(commentId) => {
        const commentRef = doc(db, "comments", `${commentId}`);
        const comment = await getDoc(commentRef);
        const docRef = doc(db, "users", comment.data().userId.userId);
        const docSnap = await getDoc(docRef);
        const _user = {...docSnap.data(),id: docSnap.id};
        commentsArr.push({...comment.data(), id: comment.id, user: _user });
      });
      console.log(commentsArr)
      this.setState({comments: commentsArr})
    }

    const data = {
      view: docSnap.data().view + 1
    }
    await updateDoc(docRef, data)
    .then(docRef => {
    })

    const updatedDoc = await getDoc(docRef);
    if (docSnap.exists()) {
      this.setState({blog: updatedDoc.data()});
    }

    const authorRef = doc(db, "authors", updatedDoc.data().authorId);
    const authorSnap = await getDoc(authorRef);

    this.setState({author: authorSnap.data()});
  }

  //Gets 5 the most viewed posts.
  setPopularPosts = async() => {
    const blogpostsRef = collection(db, 'blogposts');
    const queryRef = query(blogpostsRef,where("active", "==", true), orderBy('view', 'asc') , limit(5));
    const docSnap = await getDocs(queryRef);
    let postArray = [];
    docSnap.forEach((doc) => {
      postArray.push({...doc.data(), id:doc.id });
    })
    console.log("Populer posts fetched: " + postArray);
    this.setState({popularPosts: postArray});
  }

  //Sets the blogs active to false.
  deletePost = async() => {
    const docRef = doc(db, "blogposts", this.state.id);
    const data = {
      active: false
    }
    await updateDoc(docRef, data)
    .then(docRef => {
        window.location.replace('/')
    })
  }

  //Sets comments state with given variable.
  setComments = async(commentsArr) => {
    this.setState({comments: commentsArr});
  }

  //Creates comment in the name of logged in user.
  createComment = async() => {
        // Add a new document in collection "comments"
        console.log(this.state.user);
        const newCommentsRef = collection(db, "comments");
        const newCommentData = {
            blogpostId: this.state.id,
            body: this.state.newCommentBody,
            created_At: Timestamp.now(),
            userId: {
              userId: this.state.user.id,
              name:  this.state.user.username,
            }
        }
        const {id} = await addDoc(newCommentsRef, newCommentData);

        let comments = this.state.comments;
        comments.push({...newCommentData,user: this.state.user});
        this.setComments(comments);

        const docRef = doc(db, "blogposts", this.state.id);
        const docSnap = await getDoc(docRef);


         const data = {
          commentsId: [...docSnap.data().commentsId, id]
         }
         await updateDoc(docRef, data)
         .then(docRef => {
             console.log("A New Document Field has been added to an existing document");
         })
         const userRef = doc(db, "users", this.state.user.id);
         const userSnap = await getDoc(userRef);
 
 
          const userData = {
           commentsId: [...userSnap.data().commentsId, id]
          }
          await updateDoc(userRef, userData)
          .then(docRef => {
              console.log("A New Document Field has been added to an existing document");
          })

  }

  //Handles the state changes by input fields.
  handleChange = e => {
    this.setState({
        [e.target.name]: e.target.value
    });
  }

  //Gets the logged in user data if there is.
  userInfo = async() => {
    if(!localStorage.getItem("jwtToken")) return this.setState({user: null});
    const docRef = doc(db, "users", localStorage.getItem("jwtToken"));
    const docSnap = await getDoc(docRef);
    const _user = {...docSnap.data(),id: docSnap.id};
    this.setState({user: _user}) ; 
  }

  //Redirects to login page.
  loginPage = async() => {
    window.location.replace('/login');
  }

  //Gets the description of the post and returns slices description.
  getSummaryDesc () {
    const desc = `${this.state.author.description}`;
    return desc.slice(3,30);
  }

  render(){
    const url = window.location.toString();
  return (
    <>
      <section className='singlePage'>
        <div className="container">
          <div className='left'>
            <div >
              <h1>{this.state.blog.title}</h1>
              <img src={this.state.blog.imageCover} alt='' />
            </div>
            <div className='desc'>
              {this.state.user !== null && this.state.user.role ===  "admin" ?
                <button onClick={() => this.deletePost()} className="adminDeleteButton">
                  <RiDeleteBin6Line style={{color:"white", width:20, height:20}}/>
                </button>
              :null}
               {this.state.user !== null && this.state.user.role ===  "admin" ?
                <Link to={`/admin/blogpost/edit/${this.state.id}`}>
                  <button className="adminEditButton">
                    <AiFillEdit style={{color:"white", width:20, height:20}}/>
                  </button>
                </Link>
              :null}
              <div dangerouslySetInnerHTML={{__html: this.state.blog.body}}></div>
              <Link to={`/authors/${this.state.blog.authorId}`}>
                <div className="card">
                    <div className="authorCard">
                      <img src={this.state.author.profilePhoto ? this.state.author.profilePhoto : defaultUserImage} alt='User Profile'/>
                      <div className="commentContent">
                        <b style={{color:"black"}}>{this.state.author.name}</b>
                         <p style={{fontSize:12}}>{this.getSummaryDesc()}</p>
                      </div>
                    </div>
                  </div>
              </Link>
              {/* --COMMENTS-- */}
              <div className="commentsBox">
              <div className="commentTitleBox">
                <h1 >Comments</h1>
              </div>
              <div className="commentCardBox">
                {this.state.comments.map((comment) => (
                  <div className="commentCard">
                    <div className="commentCardHeader">
                      <img src={comment.user.profilePhoto ? `${comment.user.profilePhoto}`: defaultUserImage} alt='User Profile'/>
                      <div className="commentContent">
                        <b>{comment.userId.name}</b>
                        <p >{comment.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
                  <div className="commentCard">
                    <div className="commentCardHeader">
                      <img src={defaultUserImage} alt='User Profile'/>
                      <div className="commentContent">
                        <b>Make a Comment</b>
                        <input placeholder="Share us what you think" type='text' onChange={this.handleChange} name={"newCommentBody"} required />
                        {this.state.user != null ?
                          <button onClick={() => this.createComment()} className='button' >Share</button>
                          :
                          <button onClick={() => this.loginPage()} className='button' >Login</button>
                          }
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
            </div>

          <div className="rightContainer">
            <div className="cardItems">
              <div className="card">
                <h2 >Share This Post</h2>
              </div>
              <div className="card">
                <button className="shareButtons" >
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location}`} target="_blank" rel="noopener noreferrer">
                    <BsFacebook className='icon' style={{margin:10, marginBottom:15, width: 45, height: 45}} color="#000000" />
                  </a>
                </button>
                <button className="shareButtons">
                  <a href={`https://twitter.com/intent/tweet?url=${window.location}`} target="_blank" rel="noopener noreferrer">
                    <AiFillTwitterCircle className='icon' style={{margin:10, width: 50, height: 50}} color="#000000" />
                  </a>
                </button>
                <button className="shareButtons">
                  <a href={`mailto:pioneersgenerations@gmail.com?&subject=You have to See this!&cc=&bcc=&body=Check out this site:${window.location}`} target="_blank" rel="noopener noreferrer">
                    <MdEmail className='icon' style={{margin:10, width: 50, height: 50}} color="#000000" />
                  </a>
                </button>
                <button className="shareButtons">
                  <a href={`http://www.linkedin.com/shareArticle?url=${window.location}`} target="_blank" rel="noopener noreferrer">
                    <AiFillLinkedin className='icon' style={{ borderRadius:100,margin:10, width: 50, height: 50}} color="#000000"/>
                  </a>
                </button>
              </div>
            </div>
            {/* --POPULAR-POSTS-- */}
            <div className="cardItems">
              <div className="card">
                <h2 >Latest Releases</h2>
              </div>
              {this.state.popularPosts.map((item) => (
                <Link to={`/details/${item.id}`} className="link">
                  <div className="box boxItems" onClick={() => this.setId(item.id)} >
                    <img style={{objectFit:"cover"}} alt="" className="boxImage" src={item.imageCover}/>
                    <div className="postInfo">
                      <div >
                        <b>{item.title}</b>
                      </div>
                      <div >
                        <p style={{fontSize:13}}>{item.desc.slice(0, 70).replace('&nbsp;', " ")}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {/* --Categories-- */}
            <div className="cardItems">
              <div className="card">
                <h2>Categories</h2>
              </div>
              <div >
                  {categories.map((category) =>( 
                    <a href={`${url.split('details/')[0]}${category}`}>
                      <button className="categoriesButtons">{category}</button>
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
      }
}
