import React, {Component} from "react"
import { connect } from "react-redux";
import { login, logout } from "../../actions/authAction";
import { Link } from "react-router-dom";
//Background-Image
import back from "../../assets/images/my-account.jpg"
//--DATABASE--
import { db } from "../../firebase-config";
import {collection, addDoc, Timestamp} from "firebase/firestore";
import bcrypt from 'bcryptjs'

export class SignUp extends Component {
  constructor(props){
    super(props)

    this.state = {
      email: '',
      username: '',
      password: ''
    }
  }

handleChange = e => {
  this.setState({
      [e.target.name]: e.target.value
  });
}

 handleSubmit = async(e) => {
  e.preventDefault();
  const { dispatch } = this.props;
  const { username, email, password } = this.state;
  //Hash password.
  await bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
        // Add a new document in collection "users"
        const newUserRef = collection(db, "users");

        const newDocument = await addDoc(newUserRef, {
            email: email,
            username: username,
            role: 'user',
            password: hash
        });
    });
    setTimeout(() => {
        window.location.replace('/login');
    }, 1000);
});


}
render(){
  const { isAuthenticated, error, errorMessage } = this.props;
  if (isAuthenticated) 
      this.props.history.push('/');
  return (
    <>
      <section className='login'>
        <div className='container'>
          <div className='backImg'>
            <img src={back} alt='' />
            <div className='text'>
              <h3>Sign Up</h3>
              <h1>New account</h1>
            </div>
          </div>

          <form onSubmit={this.handleSubmit}>
            <span>Username *</span>
            <input type='text' onChange={this.handleChange} name={"username"} required />
            <span>Email address *</span>
            <input type='text' onChange={this.handleChange} name={"email"} required />
            <span>Password *</span>
            <input type='password' onChange={this.handleChange} name={"password"} required />
            <button className='button' >Log in</button>
          </form>

        </div>
      </section>
    </>
  )
}
}
