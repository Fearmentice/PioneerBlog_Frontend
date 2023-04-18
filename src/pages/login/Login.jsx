import React, {Component} from "react"
import { connect } from "react-redux";
import { login } from "../../actions/authAction";
import "./login.css"
import back from "../../assets/images/my-account.jpg"
import bcrypt from 'bcryptjs'

//--Components--
import { Verify } from "../../components/verify/Verify";

//--DATABASE--
import { db } from "../../firebase-config";
import {collection, query, getDocs, doc, Timestamp, where, updateDoc, getDoc} from "firebase/firestore";
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
      forgotPasswordPage: true,
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
  const { email } = this.state;

  //Blogpost ref.
  const usersRef = collection(db, 'users');
  const docRef = query(usersRef, where("email", "==", email));
  const userDocSnap = await getDocs(docRef);
  
  if(!userDocSnap.docs[0]) return window.location.replace('/login');

  const userId = userDocSnap.docs[0].id;

  const userRef = doc(db, "users", userId);
  const userData = (await getDoc(userRef)).data();


  const verifyCode = await this.createVerifyCode();
  const expiresIn = 172800
  const createdAt = Timestamp.now().toDate()
  createdAt.setSeconds(createdAt.getSeconds() + expiresIn);
  const expiresAt = Timestamp.fromDate(createdAt);
  const verifyData = {
    verifyInfo: {
      code: verifyCode,
      expiresAt: expiresAt,
    },
  }

  await bcrypt.compare(this.state.password, userData.password, function (err, result) {
    if(!result){
      window.location.replace('/login')
    }
});

  if(expiresAt.toMillis() < Timestamp.now().toMillis()) return;

  await updateDoc(userRef, verifyData);

  const templateParams = {
    verify_code: verifyCode,
    to_email: this.state.email
  }
  emailjs.send('service_4yjjimo', 'template_qdi58fo', templateParams, 'Omls_WJx1Lqdajbcu')
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
   const { isAuthenticated } = this.props;
   if (isAuthenticated) 
       window.location.replace('/');
  return (
    <>
      <section className='login'>
        <div className='container'>
          <div className='backImg'>
            <img src={back} alt='Login page background.' />
            <div className='text'>
              <h3>Login</h3>
              <h1 style={{color:'white'}}>My account</h1>
            </div>
          </div>

          {this.state.verifyPage === false ?
            <form onSubmit={this.handleSubmit}>
            <span>Email address *</span>
            <input placeholder="Email" type='text'  onChange={this.handleChange} name={"email"} required />
            <span>Password *</span>
            <input placeholder="Password" type='password' onChange={this.handleChange} name={"password"} required />
            <a style={{color: "#459cf5", alignSelf:"flex-start", marginBottom: 20}} href="/resetpassword" >Forgot password ?</a>
            <button style={{color:"white"}} className='button' >Log in</button>
            <a style={{color: "#459cf5", marginTop: 20}} href="/signup">Dont have an account ?</a>
          </form>
          :
          <Verify handleChange={this.handleChange} verifyInput={this.state.verifyInput} verifyAccount={this.verifyAccount}/>
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
