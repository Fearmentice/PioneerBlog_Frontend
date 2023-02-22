import React, { useState, useEffect } from "react"
import "./blog.css"
import { AiOutlineTags, AiOutlineClockCircle } from "react-icons/ai"
import { FaRegUser } from "react-icons/fa"
import { GrView } from "react-icons/gr"
import { Link } from "react-router-dom"
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs"

//--DATABASE--
import { db } from "../../firebase-config";
import { getDoc, doc, updateDoc, arrayRemove } from "firebase/firestore";

//--API--
import { bookmarkPost, removeBookmarkPost } from "../../Api/bookmarkController"

//--HELPERS--
import { getAuth } from '../../helpers/getAuthorizationToken'


export const Card = (props) => {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState(props.posts);

  useEffect(() => {
    //Gets the logged in user data if there is.
    const userInfo = async () => {
      const _user = await getAuth();
      setUser(_user);
    }
    userInfo();
  }, [])

  useEffect(() => {
    setPosts(props.posts)
  }, [props.posts])


  const callBookmarkPost = async (_id) => {
    await bookmarkPost(_id, user);
    const _posts = [...posts];
    _posts.find(x => x.id === _id).favCount++;
    setPosts(_posts)
  }

  const callRemoveBookmarkPost = async (_id) => {
    await removeBookmarkPost(_id, user);
    const _posts = [...posts];
    _posts.find(x => x.id === _id).favCount--;
    setPosts(_posts)
  }

  return (
    <section className='blog' >
      <div className='container grid3'>
        {posts.map((item) => (
          <div className='box boxItems' key={item.id}>
            <div className="bookmark">
              <div className="bookmarkContent">
                {user !== null && user.bookmarkedPosts !== undefined && user.bookmarkedPosts.includes(item.id) ?
                  <BsFillBookmarkFill onClick={() => callRemoveBookmarkPost(item.id)} className="icon" />
                  :
                  <BsBookmark onClick={() => callBookmarkPost(item.id)} className="icon" />
                }
              </div>
            </div>
            <Link to={`/details/${item.id}`} className='link'>
              <div className='img'>
                <img src={item.imageCover} alt={`${item.title}.`} />
              </div>
              <div className='details'>
                <div className='tag'>
                  <AiOutlineTags className='icon' />
                  <a href='/'>#{item.category}</a>
                </div>
                <h3>{item.title.length >= 37 ? `${item.title.slice(0, 35)}...` : item.title}</h3>
                <div style={{ margin: 0 }}>
                  <p style={{ marginBottom: 0 }}>{item.desc.slice(0, 130)}...</p>
                  <p style={{ margin: 0, marginTop: 5, color: 'grey', fontSize: "smaller" }}> Continue Reading</p>
                </div>
              </div>
              <div className="postInfo">
                <div className='date'>
                  <Link to={`/authors/${item.authorId}`} className="postInfoBoxes">
                    <FaRegUser className='icon' /> <label htmlFor=''>{item.author}</label>
                  </Link>
                  <AiOutlineClockCircle className='icon' /> <label htmlFor=''>{item.date}</label>
                  {/* <GrView style={{ color: "white" }} className='icon' /> <label htmlFor=''>{item.view}</label> */}

                </div>
              </div>
            </Link>
          </div>
        ))
        }
      </div >
    </section >
  )
}

