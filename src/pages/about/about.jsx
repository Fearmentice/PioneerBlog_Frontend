import React, {useEffect, useState} from "react"
import "./about.css"
import { db } from "../../firebase-config";
import defaultUserImage from "../../assets/images/defaultUser.jpg"
import {collection, query, getDocs} from "firebase/firestore";
import { Link } from "react-router-dom";
import { MetaTags } from "react-meta-tags";
import { TagPage } from "../tag/TagPage";

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
              <p >We are the ones who write dependently on good and independently on evil. We aim to
convey our peaceful messages to the whole world in a respectful perspective.</p>
          </div>
          <h1>What's on here ?</h1>
          <div style={{display: "flex", flexDirection:"row", }}>
              <p >News, which are from all over the World, articles which are wanted to be read, interviews
which are made with real people and lots of them are included in our website for you dear
readers.</p>
          </div>
          
          <h1>Why we write ?</h1>
          <div style={{display: "flex", flexDirection:"row", }}>
              <p >For us, the favored destination is being the common voice of all forgotten, fallen, lost, and
the ones who aim to help the fight against evil as we do. Only talking wouldn't be enough for
conveying so we would prefer to write than just talk and pray.</p>
          </div>

          <h1>How we can achieve our goal ?</h1>
              <p >The more you read our website, the closer we get to our goal. So don't stay with just reading
by yourselves, share them as well; because the more we share the more it increases.
Also, you can support us with your comments to encourage us to do our best.</p>

            <h1>Where you can reach us ?</h1>
            <p >Laptop, mobile phone, tablet, briefly everywhere you have access to the internet, is also
access to our website. You can get adequate information about us and you can also find our
social media accounts</p>
          <TagPage/>
        </div>
        <div style={{display: "flex", justifyContent: "center"}}>
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
