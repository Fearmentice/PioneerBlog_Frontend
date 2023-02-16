import React, {useEffect, useState} from "react"
import "./about.css"
import { db } from "../../firebase-config";
import defaultUserImage from "../../assets/images/defaultUser.jpg"
import {collection, query, getDocs} from "firebase/firestore";
import { Link } from "react-router-dom";
import { MetaTags } from "react-meta-tags";

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
  }  

  return (
    <>
      <section className='about'>
      <MetaTags>
        <meta name="description" content="Who we are ? We are a group of students who try to write about right and useful informations to our dear readers. Also we are just students who want to improve himself and try to be good at writing with a excellent English language."/>
      </MetaTags>
        <div className="content">
          <h1>Who we are ?</h1>
          <div style={{display: "flex", flexDirection:"row", }}>
              <p >We are a group of students who try to write about right and useful informations to our dear readers. Also we are just students who want to improve himself and try to be good at writing with a excellent English language.</p>
          </div>
          <h1>What are our goals ?</h1>
          <div style={{display: "flex", flexDirection:"row", }}>
              <p >Actually we have some different goals but the most important goal is to write the rights. Also we have chosen English for being global and be able to take comments from every nations. Another thing is give useful informations to dear readers in our personnel exposition.</p>
          </div>
          <h1>How can you help us ?</h1>
          <div style={{display: "flex", flexDirection:"row", }}>
              <p >We want to achieve our goal like every group but we want a help in a different way. You can share our writes so we can become popular in groups. Also you can make comments so we can improve us.</p>
          </div>
          <h1>Our Author Team</h1>
        </div>
        <div className="authorCardBox">
          <div className='container grid3'>
            {allAuthors.map((item) => (
              <div className="authorCard">
                  <Link className="linkCard" to={`authors/${item.id}`}>
                    <img src={item.profilePhoto ? item.profilePhoto : defaultUserImage} alt='Author profile.' class='image-preview' />
                    <a href={`authors/${item.id}`} style={{alignSelf:"center"}}>{item.name}</a>
                  </Link>
                </div>
                ))}
          </div>
        </div>
      </section>
    </>
  )
}
