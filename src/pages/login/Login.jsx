import React, {Component} from "react"
import { connect } from "react-redux";
import { login, logout } from "../../actions/authAction";
import "./login.css"
import back from "../../assets/images/my-account.jpg"

//--DATABASE--
import { db } from "../../firebase-config";
import {collection, query, getDocs, addDoc, getDoc, doc, Timestamp, where, updateDoc} from "firebase/firestore";
//--Email--
import emailjs from '@emailjs/browser';

class Login extends Component {
  constructor(props){
    super(props)

    this.state = {
      email: '',
      password: '',
      verifyPage: false,
      verifyInput: '',
      userID: '',
      verifyCode: '',
      givenSet: 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789',
    }

    this.setVerifyPage = this.setVerifyPage.bind(this);
    this.setVerifyCode = this.setVerifyCode.bind(this);
    this.setUserId = this.setUserId.bind(this);
  }

handleChange = e => {
  this.setState({
      [e.target.name]: e.target.value
  });
}

 handleSubmit = async(e) => {
  e.preventDefault();
  const { dispatch } = this.props;
  const { email, password } = this.state;

  //Blogpost ref.
  const usersRef = collection(db, 'users');
  const docRef = query(usersRef, where("email", "==", this.state.email));
  const userDocSnap = await getDocs(docRef);
  const userData = userDocSnap.docs[0].data();
  const userId = userDocSnap.docs[0].id;

  const authorRef = doc(db, "users", userId);

  const verifyCode = await this.createVerifyCode();
  const verifyData = {
    verifyInfo: {
      code: verifyCode,
      expiresAt: Timestamp.now(),
    },
  }
  await updateDoc(authorRef, verifyData);
  const newVerifyInfo = await getDoc(authorRef);
  
  console.log(userData)
  const templateParams = {
    verify_code: verifyCode,
    to_email: this.state.email
  }
  //emailjs.send('service_4yjjimo', 'template_qdi58fo', templateParams, 'Omls_WJx1Lqdajbcu')
  console.log(this.state.verifyCode)
    this.setVerifyCode(verifyData.verifyInfo.code);
    this.setUserId(userId);
    this.setVerifyPage();
}

createVerifyCode = async() => {
  let code = "";
  for(let i=0; i<5; i++) {
    let pos = Math.floor(Math.random()*this.state.givenSet.length);
    code += this.state.givenSet[pos];
  }
  this.setVerifyCode(code);
  return code;
}

setVerifyPage = () => {
  this.setState({verifyPage: true});
}

setVerifyCode = (_verifyCode) => {
  this.setState({verifyCode: _verifyCode});
}

setUserId = (_id) => {
  this.setState({userID: _id});
}


verifyAccount = async(e) => {
  e.preventDefault();
  const { dispatch } = this.props;

  if(this.state.verifyCode === this.state.verifyInput){

    console.log(this.state.userID)
    const updateRef = doc(db, "users", `${this.state.userID}`);
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

render(){
   const { isAuthenticated, error, errorMessage } = this.props;
   if (isAuthenticated) 
       window.location.replace('/');
  if(localStorage.getItem('jwtToken')) return window.location.replace('/');
  return (
    <>
      <section className='login'>
        <div className='container'>
          <div className='backImg'>
            <img src={back} alt='' />
            <div className='text'>
              <h3>Login</h3>
              <h1>My account</h1>
            </div>
          </div>

          {this.state.verifyPage == false ?
            <form onSubmit={this.handleSubmit}>
            <span>Email address *</span>
            <input type='text'  onChange={this.handleChange} name={"email"} required />
            <span>Password *</span>
            <input type='password' onChange={this.handleChange} name={"password"} required />
            <button className='button' >Log in</button>
          </form>
          :
          <form onSubmit={this.verifyAccount}>
            <span>Verify *</span>
            <input type='text' value={this.state.verifyInput}  onChange={this.handleChange} name={"verifyInput"} required />
            <button className='button' >Verify</button>
          </form>
          }

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
export default connect(mapStateToProps)(Login);
