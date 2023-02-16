import React, { useState } from "react"
import { IoSettingsOutline } from "react-icons/io5"
// import { AiOutlineHeart } from "react-icons/ai"
import { BiLogOut } from "react-icons/bi"
import { RiImageAddLine } from "react-icons/ri"
import {  AiFillEdit } from "react-icons/ai"
import { Link } from "react-router-dom"
import { useEffect } from "react"
import { db } from "../../firebase-config";
import {getDoc, doc, } from "firebase/firestore";
import {BsPersonPlus, BsBookmark} from "react-icons/bs"

export const User = () => {
  const user = true
  const [profileOpen, setProfileOpen] = useState(false)
  const [loggedinUser, setloggedinUser] = useState({});

  useEffect(() => {
    isAdmin();
  }, [])

  const close = () => {
    setProfileOpen(false)
  }
  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("role");
    window.location.replace('/');
  }
  const isAdmin = async() => {
    if(!localStorage.getItem("jwtToken")) return setloggedinUser(null);
    const docRef = doc(db, "users", localStorage.getItem("jwtToken"));
    const docSnap = await getDoc(docRef);
    const _user = docSnap.data();
    setloggedinUser(_user);
  }

  return (
    <>
      <div className='profile'>
        {user ? (
          <>
            <button className='img' onClick={() => setProfileOpen(!profileOpen)}>
              <img src={`${loggedinUser.profilePhoto}`} alt='Profile of the logged in user.' />
            </button>
            {profileOpen && (
              <div className='openProfile boxItems' onClick={close}>
                  <div className='image'>
                    <div className='img'>
                      <img src={`${loggedinUser.profilePhoto}`} alt='Logged in user profile.' />
                    </div>
                    <div className='text'>
                      <h4>{loggedinUser.username}</h4>
                      <label>{loggedinUser.role === 'admin'?loggedinUser.role:null}</label>
                    </div>
                  </div>
                {loggedinUser.role ==='admin' ? 
                <Link to='/admin/blogpost/create'>
                  <button className='box'>
                    <RiImageAddLine className='icon' />
                    <h4>Create Post</h4>
                  </button>
                </Link>
                :null}
                {loggedinUser.role ==='admin' ? 
                <Link to='/admin/author/create'>
                  <button className='box'>
                    <BsPersonPlus className='icon' />
                    <h4>Create Author</h4>
                  </button>
                </Link>
                :null}
                {loggedinUser.role ==='admin' ? 
                <Link to='/admin/author/edit'>
                  <button className='box'>
                    <AiFillEdit className='icon' />
                    <h4>Edit Author</h4>
                  </button>
                </Link>
                :null}
                <Link to='/MyBookmarks'>
                  <button className='box'>
                    <BsBookmark className='icon' />
                    <h4>My Bookmarks</h4>
                  </button>
                </Link>
                <Link to='/myAccount'>
                  <button className='box'>
                    <IoSettingsOutline className='icon' />
                    <h4>My Account</h4>
                  </button>
                </Link>
                {/* <button className='box'>
                  <AiOutlineHeart className='icon' />
                  <h4>Favs</h4>
                </button> */}
                <button onClick={() => logout()} className='box'>
                  <BiLogOut className='icon' />
                  <h4>Log Out</h4>
                </button>
              </div>
            )}
          </>
        ) : (
          <button>My Account</button>
        )}
      </div>
    </>
  )
}
