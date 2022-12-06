import React, { Component, useState } from "react"
import "./details.css"
import "../../components/header/header.css"
import img from "../../assets/images/b5.jpg"
import { BsPencilSquare } from "react-icons/bs"
import { AiOutlineDelete } from "react-icons/ai"
import { blogs } from "../../assets/data/data"
import { Header } from "../../components/header/Header"
import { AiOutlineTags, AiOutlineClockCircle, AiOutlineComment, AiOutlineShareAlt } from "react-icons/ai"
import { AiFillTwitterCircle, AiFillLinkedin, AiFillYoutube } from "react-icons/ai"
import { BsFacebook } from "react-icons/bs"
import { RiInstagramFill } from "react-icons/ri"
import axios from "axios"

export class DetailsPages extends Component {
  constructor(props) {
    super(props)

    this.state = {
      blog: [],
      popularPosts:[]
    }
    this.setBlog = this.setBlog.bind(this);
    this.setPopularPosts = this.setPopularPosts.bind(this);
  }

  setBlog = async() => {
    const url = window.location.href;
    const id = url.replace("http://localhost:3006/details/", "");
    console.log(id);
    await axios.get(`https://pioneerblog-api.onrender.com/blogposts/${id}`).then(response => {
      console.log(response)
      this.setState({ blog: response.data })
    }).catch(error => {
      console.log(error)
    })
  }

  setPopularPosts = async() => {
    await axios.get(`https://pioneerblog-api.onrender.com/blogposts?limit=5`).then(response => {
      console.log(response)
      this.setState({ popularPosts: response.data.doc })
    }).catch(error => {
      console.log(error)
    })
  }

  componentDidMount(){
    this.setBlog();
    this.setPopularPosts();
  }

  render(){
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
              <p>{this.state.blog.desc}</p>
              {/* <p>"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?" Section 1.10.33 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."</p> */}
              <p>Author: {this.state.blog.author}</p>
            </div>
          </div>
          <div className="rightContainer">
            <div className="cardItems">
              <div className="card">
                <h2 style={{width: 200}}>Share This Post</h2>
                <hr style={{marginTop:15,marginLeft:5 ,width: 300, marginLeft:10}} />
              </div>
              <div className="card">
                <button className="shareButtons">
                  <RiInstagramFill className='icon' style={{margin:10, width: 50, height: 50}} color="#000000" />
                </button>
                <button className="shareButtons">
                  <AiFillTwitterCircle className='icon' style={{margin:10, width: 50, height: 50}} color="#000000" />
                </button>
                <button className="shareButtons">
                  <AiFillYoutube className='icon' style={{margin:10, width: 50, height: 50}} color="#000000" />
                </button>
                <button className="shareButtons">
                  <AiFillLinkedin className='icon' style={{ borderRadius:100,margin:10, width: 50, height: 50}} color="#000000"/>
                </button>
              </div>
            </div>
            <div className="cardItems">
              <div className="card">
                <h2 style={{width:200}}>Latest Releases</h2>
                <hr style={{width: 300}}/>
              </div>
              {this.state.popularPosts.map((item) => (
                <div className="box boxItems">
                  <img className="boxImage" src={`https://pioneerblog-api.onrender.com/blogposts/image/` + item.imageCover}/>
                  <div className="postInfo">
                    <b>{item.title}</b>
                    <div>
                      <p style={{fontSize:15}}>{item.desc.slice(0, 40)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cardItems">
              <div className="card">
                <h2 style={{width:200}}>Categories</h2>
                <hr style={{marginTop:15,marginLeft:5 ,width: 300}} />
              </div>
              <div >
                <button style={{marginLeft: 20, }} className="categoriesButtons">Technology</button>
                <button className="categoriesButtons">History</button>
                <button className="categoriesButtons">Culture</button>
                <button className="categoriesButtons">World</button>
                <button style={{marginLeft: 20, }} className="categoriesButtons">Sport</button>
                <button className="categoriesButtons">News</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
      }
}
