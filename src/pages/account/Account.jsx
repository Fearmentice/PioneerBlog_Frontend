import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import "./account.css"

import { db } from "../../firebase-config";
import {getDoc, updateDoc, doc, } from "firebase/firestore";
import {ref, uploadBytes, getStorage, getDownloadURL} from "firebase/storage"
import { v4 } from "uuid";

export const Account = () => {
  const [user, setUser] = useState({});

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState('');

  const history = useHistory();
  const storage = getStorage();


  useEffect(() => {
    getMyAccountInfo();
  }, [])

    // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!image) {
        setPreview(undefined)
        return
    }
  
    const objectUrl = URL.createObjectURL(image)
    setPreview(objectUrl)
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [image])

  const getMyAccountInfo = async() => {
    const accountID = localStorage.getItem("jwtToken");
    if(!accountID) return  history.push('/login')
    const docRef = doc(db, "users", accountID);
    const docSnap = await getDoc(docRef);
    const _user = {...docSnap.data(), id: docSnap.id};
    console.log(_user);
    setUser(_user);
    setPreview(_user.profilePhoto);
    setUsername(_user.username)
    setEmail(_user.email)
  }

  const updateAccount = async() => {
      //Get user.
      const docRef = doc(db, "users", user.id);
      const imageUrl = await uploadImage();

      const data = {
        username: username,
        email: email,
        profilePhoto: imageUrl
      }

      await updateDoc(docRef, data);

      window.location.reload();
  }

  const uploadImage = async() => {
    //Check if image is uploaded.
    if(image == null) return;

    //Check if new image has uploaded. if not upload return url of old one.
    if(user.profilePhoto === preview) return preview;

    const imageRef = ref(storage,`users/${image.name + v4()}`)
    await uploadBytes(imageRef, image).then(() => {
      console.log("Image uploaded.");
    })

    const imageUrl = await getDownloadURL(imageRef).then(url => {
      return url;
    })

    return imageUrl;
}

  return (
    <>
      <section className='accountInfo'>
        <div className='container boxItems'>
          <h1>Account Information</h1>
          <div className='content'>
            <div className='left'>
              <div className='img flexCenter'>
                <input type='file' onChange={(event) => setImage(event.target.files[0])} accept='image/*' src={image} alt='img' />
                <img src={preview} alt='preview' class='image-preview' />
              </div>
              <a href="/" style={{marginLeft: 15, marginTop:10}}>Upload Image</a>
            </div>
            <div className='right'>
              <label htmlFor=''>Username</label>
              <input type='text' value={username} onChange={(event) => setUsername(event.target.value)} name="username"/>
              <label htmlFor=''>Email</label>
              <input type='email' value={email} onChange={(event) => setEmail(event.target.value)} name="email"/>
              <button onClick={() => updateAccount()} className='button'>Update</button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
