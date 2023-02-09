import React, {useEffect, useState} from "react"
import "./about.css"
import { db } from "../../firebase-config";
import defaultUserImage from "../../assets/images/defaultUser.jpg"
import {collection, query, getDocs} from "firebase/firestore";
import { Link } from "react-router-dom";

export const About = () => {
  const [allAuthors, setAllAuthors] = useState([]);

  useEffect(() => {
    getAllAuthors();
  }, [])

  const getAllAuthors = async() => {
    //Authors ref.
    const authorsRef = collection(db, 'authors');
  
    //Query.
    const queryRef = query(authorsRef);
    const docSnap = await getDocs(queryRef);
    let _authors = [];
    docSnap.forEach((doc) => {
      _authors.push({...doc.data(), id: doc.id});
    })
    setAllAuthors(_authors);
    console.log(_authors);
  }  

  return (
    <>
      <section className='about'>
        <h1>Who we are ?</h1>
        <div style={{display: "flex", flexDirection:"row", width:1250}}>
            <p style={{marginLeft:40 ,textTransform:"unset"}} >We are a group of students who try to write about right and useful informations to our dear readers. Also we are just students who want to improve himself and try to be good at writing with a excellent English language.</p>
        </div>
        <h1 style={{marginTop:25}}>What are our goals ?</h1>
        <div style={{display: "flex", flexDirection:"row", width:1250}}>
            <p style={{marginLeft:40 ,textTransform:"unset"}} >Actually we have some different goals but the most important goal is to write the rights. Also we have chosen English for being global and be able to take comments from every nations. Another thing is give useful informations to dear readers in our personnel exposition.</p>
        </div>
        <h1 style={{marginTop:25}}>How can you help us ?</h1>
        <div style={{display: "flex", flexDirection:"row", width:1250}}>
            <p style={{marginLeft:40 ,textTransform:"unset"}} >We want to achieve our goal like every group but we want a help in a different way. You can share our writes so we can become popular in groups. Also you can make comments so we can improve us.</p>
        </div>
        <h1 style={{marginTop: 30}}>Our Author Team</h1>
        
        <div className="authorCardBox">
          <div className='container grid3'>
            {allAuthors.map((item) => (
              <div className="authorCard">
                  <Link to={`authors/${item.id}`}>
                    <img src={item.profilePhoto ? item.profilePhoto : defaultUserImage} alt='profilePhoto' class='image-preview' />
                    <a href={`authors/${item.id}`} style={{color: "black"}}>{item.name}</a>
                  </Link>
                </div>
                ))}
          </div>
        </div>
      </section>
    </>
  )
}
