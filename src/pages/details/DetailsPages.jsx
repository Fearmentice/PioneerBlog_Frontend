import React, { Component, useState } from "react"
import "./details.css"
import "../../components/header/header.css"
import img from "../../assets/images/b5.jpg"
import { BsPencilSquare } from "react-icons/bs"
import { AiOutlineDelete } from "react-icons/ai"
import {MdEmail} from "react-icons/md"
import { blogs } from "../../assets/data/data"
import { Header } from "../../components/header/Header"
import { AiOutlineTags, AiFillEdit, AiOutlineClockCircle, AiOutlineComment, AiOutlineShareAlt } from "react-icons/ai"
import { AiFillTwitterCircle, AiFillLinkedin, AiFillYoutube } from "react-icons/ai"
import { BsFacebook } from "react-icons/bs"
import axios from "axios"
import { BiWindowOpen } from "react-icons/bi"
import { Link, useHistory, useParams } from "react-router-dom"
import { RiDeleteBin6Line } from 'react-icons/ri';
import { height } from "@mui/system"

export class DetailsPages extends Component {
  constructor(props) {
    super(props)

    this.state = {
      id:"",
      blog: [],
      popularPosts:[]
    }
    this.setBlog = this.setBlog.bind(this);
    this.setPopularPosts = this.setPopularPosts.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  setId = async(_id) => {
    await this.setState({ id: _id });
    console.log(this.state.id);
    if(this.state.id){
      this.setBlog();
    }
  }

  setBlog = async() => {
    const url = window.location.href;
    await axios.get(`https://pioneerblog-api.onrender.com/blogposts/${this.state.id}`).then(response => {
      console.log(response)
      this.setState({ blog: response.data })
    }).catch(error => {
      console.log(error)
    })
  }

  setPopularPosts = async() => {
    const sort = "sort=-publishDate";
    const limit = "limit=5";
    await axios.get(`https://pioneerblog-api.onrender.com/blogposts?${limit}&${sort}`).then(response => {
      console.log(response)
      this.setState({ popularPosts: response.data.doc })
    }).catch(error => {
      console.log(error)
    })
  }

  deletePost = async() => {
    await axios.delete(`https://pioneerblog-api.onrender.com/blogposts/${this.state.id}`).then(response => {
      console.log(response)
    }).catch(error => {
      console.log(error)
    })
  }

  update = async() => {

  }

  componentDidMount(){
    const id = this.props.match.params.id;
    this.setId(id);
    this.setPopularPosts();
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
              <img src={`https://pioneerblog-api.onrender.com/blogposts/image/` + this.state.blog.imageCover} alt='' />
            </div>
            <div className='desc'>
              <Link to={"/Home"}>
                <button onClick={() => this.deletePost()} className="adminDeleteButton">
                  <RiDeleteBin6Line style={{color:"white", width:20, height:20}}/>
                </button>
              </Link>
              <button className="adminEditButton">
                <AiFillEdit style={{color:"white", width:20, height:20}}/>
              </button>
              <p>{this.state.blog.desc}</p>
              {/* <p>"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?" Section 1.10.33 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."</p> */}
              <p>Author: {this.state.blog.author}</p>
            </div>
          </div>
          <div className="rightContainer">
            <div className="cardItems">
              <div className="card">
                <h2 style={{width: 210}}>Share This Post</h2>
                <hr style={{marginTop:15,marginLeft:5 ,width: 300,}} />
              </div>
              <div className="card">
                <button className="shareButtons" >
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location}`} target="_blank" rel="noopener noreferrer">
                    <BsFacebook className='icon' style={{margin:10, width: 42, height: 42}} color="#000000" />
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
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location}`} target="_blank" rel="noopener noreferrer">
                    <AiFillLinkedin className='icon' style={{ borderRadius:100,margin:10, width: 50, height: 50}} color="#000000"/>
                  </a>
                </button>
              </div>
            </div>
            <div className="cardItems">
              <div className="card">
                <h2 style={{width:210}}>Latest Releases</h2>
                <hr style={{marginTop:15,marginLeft:5 ,width: 300,}}/>
              </div>
              {this.state.popularPosts.map((item) => (
                <Link to={`/details/${item._id}`} className="link">
                  <div className="box boxItems" onClick={() => this.setId(item._id)} >
                    <img className="boxImage" src={`https://pioneerblog-api.onrender.com/blogposts/image/` + item.imageCover}/>
                    <div className="postInfo">
                      <div style={{width: 275}}>
                        <b>{item.title}</b>
                      </div>
                      <div style={{width: 275}}>
                        <p style={{fontSize:15}}>{item.desc.slice(0, 70)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="cardItems">
              <div className="card">
                <h2 style={{width:210}}>Categories</h2>
                <hr style={{marginTop:15,marginLeft:5 ,width: 300}} />
              </div>
              <div >
                <a href={`${url.split('details/')[0]}Technology`}>
                  <button style={{marginLeft: 20, }} className="categoriesButtons">Technology</button>
                </a>
                <a href={`${url.split('details/')[0]}History`}>
                  <button className="categoriesButtons">History</button>
                </a>
                <a href={`${url.split('details/')[0]}Culture`}>
                  <button className="categoriesButtons">Culture</button>
                </a>
                <a href={`${url.split('details/')[0]}World`}>
                  <button className="categoriesButtons">World</button>
                </a>
                <a href={`${url.split('details/')[0]}Sport`}>
                  <button style={{marginLeft: 20, }} className="categoriesButtons">Sport</button>
                </a>
                <a href={`${url.split('details/')[0]}News`}>
                  <button className="categoriesButtons">News</button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
      }
}
