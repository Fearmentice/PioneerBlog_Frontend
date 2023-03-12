import React, {Component} from "react"
import "./signUp.css"
import { connect } from "react-redux";
import { login } from "../../actions/authAction";

//--Component--
import { Verify } from "../../components/verify/Verify";

//--DATABASE--
import { db } from "../../firebase-config";
import {collection, query, getDocs, addDoc, doc, Timestamp, where, updateDoc} from "firebase/firestore";
import bcrypt from 'bcryptjs'
import {ref, uploadBytes, getStorage, getDownloadURL} from "firebase/storage"
import { v4 } from "uuid";
//--Email--
import emailjs from '@emailjs/browser';

import image from "../../assets/images/defaultUser.jpg"

class SignUp extends Component {
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
      bookmarkedPosts: [],
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
  if(this.state.image === '') {
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

  //Hash password.
  await bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
        // Add a new document in collection "users"
        const newUserRef = collection(db, "users");

        const newDocument = await addDoc(newUserRef, {
            email: email,
            username: username,
            commentsId: [],
            bookmarkedPosts: [],
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
  
  const { dispatch } = this.props;
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
      dispatch(login(this.state.email, this.state.password));
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
  const { isAuthenticated } = this.props;
  if (isAuthenticated) 
      window.location.replace('/');
  if(localStorage.getItem("jwtToken")) return window.location.replace('/');
  return (  
   <>
   <meta name="description" content="You can sign up pur page from here!!! Through sign up you can share us what you think."/>
      <section className='accountInfo'>
        <div className='container boxItems'>
          <h1>Sign Up</h1>
          <div className='content'>
            <div className='left'>
              <div className='img flexCenter'>
                <input type='file' onChange={(event) => this.setImage(event.target.files[0])} accept='image/*' src={image} alt='img' />
                <img style={{objectFit:"cover"}} src={this.state.preview} alt='Previews the sign up porfile.' class='image-preview' />
              </div>
              <b >Upload Image</b>
            </div>
            {this.state.verify === true ?
            <Verify 
            handleChange={this.handleChange} verifyInput={this.state.verifyInput} verifyAccount={this.verifyAccount}/>
            :
            <div className='right'>
              <label htmlFor=''>Username</label>
              <input placeholder="Username" type='text' onChange={this.handleChange} name="username"/>
              <label htmlFor=''>Email</label>
              <input placeholder="Email" type='email' onChange={this.handleChange} name="email"/>
              <label htmlFor=''>Password</label>
              <input placeholder="Password" type='password' onChange={this.handleChange} name="password" />
              <button style={{color:"white"}} onClick={() => this.handleSubmit()} className='button'>Sign Up</button>
            </div>
            }
          </div>
        </div>
      </section>
    </>
  )
}
}
const mapStateToProps = state => {
  const { isAuthenticated, error, errorMessage, user } = state.auth;
  return {
      isAuthenticated,
      error,
      errorMessage,
      user
  }
}
export default connect(mapStateToProps)(SignUp)
