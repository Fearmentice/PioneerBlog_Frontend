import React, { Component } from "react"
import { Link } from "react-router-dom"

//--ASSESTS--
import "./details.css"
import {categories} from '../../assets/data/data'
import "../../components/header/header.css"

//--ICONS--
import {MdEmail} from "react-icons/md"

//--Icons--
import { AiFillTwitterCircle, AiFillLinkedin, AiFillEdit } from "react-icons/ai"
import { RiDeleteBin6Line } from 'react-icons/ri';
import { BsBookmark, BsFillBookmarkFill, BsFacebook } from "react-icons/bs"

//--DATABASE--
import { db } from "../../firebase-config";
import {getDoc, doc, updateDoc} from "firebase/firestore";

//--Components--
import { PopularPosts } from "../../components/popularPosts/PopularPosts"
import { SeoSocialMedia } from "../../components/SEO_socialMedia/SeoSocialMedia.jsx"
import { AuthorCard } from "../../components/authorCard/AuthorCard"
import { Comments } from "../../components/comments/Comments"

//--HELPERS--
import { getAuth } from '../../helpers/getAuthorizationToken'
import { bookmarkPost, removeBookmarkPost } from "../../Api/bookmarkController"

//--API--
import { fetchPosts } from "../../Api/blogpostController";

export class DetailsPages extends Component {
  //Defines all states and callback functions.
  constructor(props) {
    super(props)

    this.state = {
      id:"",
      blog: {},
      user: {},
      popularPosts: [],
      comments: [],
      newCommentBody: '',
      author:{}
    }
    this.setBlog = this.setBlog.bind(this);
    this.setComments = this.setComments.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  //Runs one time in render ands triggers setId, setPopularPosts and userInfo.
  componentDidMount = async() => {
      const id = this.props.match.params.id;
      this.setId(id);
      this.setState({user: await getAuth()})
      this.getPopularPosts();
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
  getPopularPosts = async() => {
    const { posts } = await fetchPosts('publishDate', 'desc', 5, null);
    this.setState({popularPosts: posts});
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

  callbookmarkPost = async(_id) => {
    await bookmarkPost(_id, this.state.user)
    this.setState({user: await getAuth()})
  }
  callRemoveBookmarkPost = async(_id ) => {
    await removeBookmarkPost(_id, this.state.user)
    this.setState({user: await getAuth()})
  }

  //Handles the state changes by input fields.
  handleChange = e => {
    e.preventDefault();
    this.setState({
        [e.target.name]: e.target.value
    });
  }


  render(){
    const url = window.location.toString();
  return (
    <>
      <SeoSocialMedia 
          description={`Get more information about ${this.state.blog.title}`}
          canonical={window.location.toString()}
          url={`https://vocham.com/details/${this.state.id}`}
          title={this.state.blog.title}
          image={this.state.blog.image}
          />


      <section className='singlePage'>
        <div className="container">
          <div className='left'>
            <div >
              <h1>{this.state.blog.title}</h1>
              <title>{this.state.blog.title}</title>
              <img src={this.state.blog.imageCover} alt={`Explains the article that is about ${this.state.blog.title}`} />
            </div>
            <div className='desc'>
              <AdminButtons user={this.state.user} id={this.state.id}/>
              <div className="body" dangerouslySetInnerHTML={{__html: this.state.blog.body}}></div>
                <div className="descInfo">
                      <AuthorCard 
                        authorId={this.state.blog.authorId}
                        profilePhoto={this.state.author.profilePhoto}
                        name={this.state.author.name}
                        description={this.state.author.description}
                        />
                      <div className="card">
                      <button className="shareButtons">
                          {this.state.user !== null && this.state.user.bookmarkedPosts !== undefined && this.state.user.bookmarkedPosts.includes(this.state.id) ?
                            <BsFillBookmarkFill  className='icon' style={{ margin:10, width: 40, height: 40}} onClick={() => this.callRemoveBookmarkPost(this.state.id) } />
                            :
                            <BsBookmark  className='icon' style={{ margin:10, width: 40, height: 40}} onClick={() => this.callbookmarkPost(this.state.id)} />
                          }
                      </button>
                        <ShareButton 
                          url={`https://www.facebook.com/sharer/sharer.php?u=${window.location}`} 
                          iconComponent={BsFacebook} width={45} height={45}/>
                        <ShareButton 
                          url={`https://twitter.com/intent/tweet?url=${window.location}`} 
                          iconComponent={AiFillTwitterCircle} width={50} height={50}/>
                        <ShareButton 
                          url={`mailto:?&subject=You have to See this!&cc=&bcc=&body=Check out this site: ${window.location}`} 
                          iconComponent={MdEmail} width={50} height={50}/>
                        <ShareButton 
                          url={`http://www.linkedin.com/shareArticle?url=${window.location}`} 
                          iconComponent={AiFillLinkedin} width={50} height={50}/>
                      </div>
                  </div>
                  <Comments 
                    comments={this.state.comments}
                    user={this.state.user}
                    id={this.state.id}
                    setComments={this.setComments}
                    newCommentBody={this.state.newCommentBody}
                    handleChange={this.handleChange}
                  />
          </div>
            </div>

          <div className="rightContainer">
          <div className="cardItems">
            <div className="card">
              <h2 >Latest Releases</h2>
            </div>
            {this.state.popularPosts.map((item) => (
               <Link to={`/details/${item.id}`} className="link">
                 <div className="box boxItems" onClick={() => this.setId(item.id)} >
                   <img style={{objectFit:"cover"}} alt="Thumbnails of the writings." className="boxImage" src={item.imageCover}/>
                   <div className="postInfo">
                     <div >
                       <b>{item.title}</b>
                     </div>
                     <div >
                       <p >{item.desc.slice(0, 70).replace('&nbsp;', " ")}</p>
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
              <div style={{marginBottom: 10}}>
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

export const ShareButton = (props) => {
  return(
    <button className="shareButtons">
      <a href={props.url} target="_blank" rel="noopener noreferrer">
      <props.iconComponent className='icon' style={{ borderRadius:100, margin:10, width: props.width, height: props.height}} color="#000000"/>
      </a>
  </button>
  )
}

export const AdminButtons = (props) => {
  const {user, id} = props;
  if(user !== null && user.role ===  "admin")
  {
    return (
      <>
        <button onClick={() => this.deletePost()} className="adminDeleteButton">
          <RiDeleteBin6Line style={{color:"white", width:20, height:20}}/>
        </button>
        <Link to={`/admin/blogpost/edit/${id}`}>
          <button className="adminEditButton">
            <AiFillEdit style={{color:"white", width:20, height:20}}/>
          </button>
        </Link>
      </>
    )
  }
  return (null)
}