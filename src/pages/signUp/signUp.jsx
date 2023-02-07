import React, {Component} from "react"
import { connect } from "react-redux";
import { login, logout } from "../../actions/authAction";
import { Link } from "react-router-dom";
//Background-Image
import back from "../../assets/images/my-account.jpg"
//--DATABASE--
import { db } from "../../firebase-config";
import {collection, query, getDocs, addDoc, doc, Timestamp, where, updateDoc} from "firebase/firestore";
import bcrypt from 'bcryptjs'
import {ref, uploadBytes, getStorage, getDownloadURL} from "firebase/storage"
import { v4 } from "uuid";
//--Email--
import emailjs from '@emailjs/browser';

import image from "../../assets/images/defaultUser.jpg"

export class SignUp extends Component {
  constructor(props){
    super(props)

    this.state = {
      email: '',
      username: '',
      password: '',
      image: '',
      preview:image,
      verify:false,
      verifyCode: '',
      verifyInput: '',
      accountId: '',
      givenSet: 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789',
    }
    this.setVerifyPage = this.setVerifyPage.bind(this);
    this.createVerifyCode = this.createVerifyCode.bind(this);
  }

  setImage = (_image) => {
    this.setState({image: _image});
    if (!_image) {
      this.setState({preview: undefined});
      return
    }
    const objectUrl = URL.createObjectURL(_image)
    this.setState({preview: objectUrl});

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }

handleChange = e => {
  this.setState({
      [e.target.name]: e.target.value
  });
}

 handleSubmit = async() => {

  const storage = getStorage();

  const { dispatch } = this.props;
  const { username, email, password } = this.state;

  //Blogpost ref.
  const usersRef = collection(db, 'users');
  
  //Chek if username unique.
  const queryRef = query(usersRef,  
    where("username", "==", username));
  const docSnap = await getDocs(queryRef);
  if(docSnap.docs[0] && docSnap.docs[0].exists()) {
    console.log("user already been created with that username.")
    return;
  }
  //Chek if email unique.
  const emailRef = query(usersRef,  
    where("email", "==", email));
  const emailDocSnap = await getDocs(emailRef);
  if(emailDocSnap.docs[0] && emailDocSnap.docs[0].exists()) {
    console.log("user already been created with that email.")
    return;
  }

  let imageUrl;
  if(this.state.image == '') {
    console.log("nullasdasdasd")
    imageUrl = 'https://firebasestorage.googleapis.com/v0/b/vocham-api.appspot.com/o/users%2FdefaultUser.jpg?alt=media&token=8ffd11af-591d-418b-85dc-d87d723ba386';
  }else{
    const imageRef = ref(storage,`users/${this.state.image.name + v4()}`)
    await uploadBytes(imageRef, this.state.image).then(() => {
    })
    imageUrl = await getDownloadURL(imageRef).then(url => {
      return url;
    })

  }

  const verifyCode = await this.createVerifyCode();

  const setAccountId = this.setAccountId;

  //Hash password.
  await bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
        // Add a new document in collection "users"
        const newUserRef = collection(db, "users");

        const newDocument = await addDoc(newUserRef, {
            email: email,
            username: username,
            commentsId: [],
            role: 'user',
            isVerified: false,
            verifyInfo: {
              code: verifyCode,
              expiresAt: Timestamp.now(),
            },
            profilePhoto: imageUrl,
            password: hash
        });
        return newDocument.id;
    });

    const templateParams = {
      verify_code: verifyCode,
      to_email: email
    }
    emailjs.send('service_4yjjimo', 'template_qdi58fo', templateParams, 'Omls_WJx1Lqdajbcu')
    });
    this.setVerifyPage();

}

setVerifyPage = () => {
  this.setState({verify: true});
}


verifyAccount = async() => {
  if(this.state.verifyCode === this.state.verifyInput){
    //Blogpost ref.
    const usersRef = collection(db, 'users');
    const docRef = query(usersRef, where("email", "==", this.state.email));
    const userDocSnap = await getDocs(docRef);


    const updateRef = doc(db, "users", `${userDocSnap.docs[0].id}`);
    const data = {
      isVerified: true,
      verifyInfo: null,
    }
    await updateDoc(updateRef, data);

    setTimeout(() => {
      window.location.replace('/login');
    }, 1000);
  }
}



createVerifyCode = async() => {
  let code = "";
  for(let i=0; i<5; i++) {
    let pos = Math.floor(Math.random()*this.state.givenSet.length);
    code += this.state.givenSet[pos];
  }
  this.setState({verifyCode: code});
  return code;
}

render(){
  const { isAuthenticated, error, errorMessage } = this.props;
  if (isAuthenticated) 
      this.props.history.push('/');
  return (  
   <>
      <section className='accountInfo'>
        <div className='container boxItems'>
          <h1>Account Information</h1>
          <div className='content'>
            <div className='left'>
              <div className='img flexCenter'>
                <input type='file' onChange={(event) => this.setImage(event.target.files[0])} accept='image/*' src={image} alt='img' />
                <img style={{objectFit:"cover"}} src={this.state.preview} alt='image' class='image-preview' />
              </div>
              <a style={{marginLeft: 15, marginTop:10}}>Upload Image</a>
            </div>
            {this.state.verify == true ?
            <div className='right'>
              <label htmlFor=''>Verify Account</label>
              <input value={this.state.verifyInput} type='text' onChange={this.handleChange} name="verifyInput"/>
              <button onClick={() => this.verifyAccount()} className='button'>Verify</button>
            </div>
            :
            <div className='right'>
              <label htmlFor=''>Username</label>
              <input type='text' onChange={this.handleChange} name="username"/>
              <label htmlFor=''>Email</label>
              <input type='email' onChange={this.handleChange} name="email"/>
              <label htmlFor=''>Password</label>
              <input type='password' onChange={this.handleChange} name="password" />
              <button onClick={() => this.handleSubmit()} className='button'>Sign Up</button>
            </div>
            }
          </div>
        </div>
      </section>
    </>
  )
}
}
