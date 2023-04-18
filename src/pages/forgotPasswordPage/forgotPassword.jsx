import React, { Component } from "react";
import './forgotPassword.css'

import { connect } from "react-redux";
import { login } from "../../actions/authAction";

//--Components--
import { Verify } from "../../components/verify/Verify";

//--DATABASE--
import { db } from "../../firebase-config";
import {collection, query, getDocs, doc, Timestamp, where, updateDoc} from "firebase/firestore";

//--Email--
import emailjs from '@emailjs/browser';

import bcrypt from 'bcryptjs'

class forgotPassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userID: '',
            email: '',
            password: '',
            passwordConfirm: '',
            passwordChange: '',
            providedEmail: false,
            verifyPage: false,
            givenSet: 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789',
        }
    }

    changePassword = async(e) => {
        e.preventDefault();
        const { dispatch } = this.props;
        const {userID, password, email, passwordConfirm} = this.state;

        if(password === passwordConfirm){
            //Hash password.
            await bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, async function (err, hash) {
                    const updateRef = doc(db, "users", userID);
                    const data = {
                      password: hash
                    }
                    await updateDoc(updateRef, data);
        

            })});

            setTimeout(() => {
                dispatch(login(email, password));
              }, 1000);
        }
    }

    getAccountInfo = () => {
        if(this.state.providedEmail && this.state.passwordChange)
        {
            return(
            <form onSubmit={this.changePassword}>
                <span>Password *</span>
                <input placeholder="Password" type='password' value={this.state.password} onChange={this.handleChange} name={"password"} required />
                <span>Confirm Password *</span>
                <input placeholder="Confirm Password" type='password' value={this.state.passwordConfirm} onChange={this.handleChange} name={"passwordConfirm"} required />
                <button style={{color:"white"}} className='button' >Change Password</button>
            </form>
            )
        }
        else if (this.state.providedEmail === false) {
            return(
                <form onSubmit={this.emailProvide} >
                    <span>Email address *</span>
                    <input placeholder="Email" type='text'  onChange={this.handleChange} name={"email"} required />
                    <button style={{color:"white"}} className='button' >Send Mail</button>
                </form>
                )
        }
    }

    emailProvide = async(e) => {
        e.preventDefault();

        const { email } = this.state;

        //Blogpost ref.
        const usersRef = collection(db, 'users');
        const docRef = query(usersRef, where("email", "==", email));
        const userDocSnap = await getDocs(docRef);

        if(!userDocSnap.docs[0]) return window.location.replace('/login');
        
        const userId = userDocSnap.docs[0].id;

        const userRef = doc(db, "users", userId);

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

        if(expiresAt.toMillis() < Timestamp.now().toMillis()) return;

        await updateDoc(userRef, verifyData);

        const templateParams = {
            verify_code: verifyCode,
            to_email: this.state.email
          }
        emailjs.send('service_4yjjimo', 'template_qdi58fo', templateParams, 'Omls_WJx1Lqdajbcu')

        this.setState({
            providedEmail: true, 
            verifyPage: true,
            verifyCode: verifyCode,
            userID: userId
        })
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

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
      }

      verifyAccount = async(e) => {
        e.preventDefault();
      
        if(this.state.verifyCode === this.state.verifyInput){
      
          const updateRef = doc(db, "users", `${this.state.userID}`);
          const data = {
            isVerified: true,
            verifyInfo: null,
          }
          await updateDoc(updateRef, data);
      
          this.setState({passwordChange: true, verifyPage: false})
        }
      }

    render() {
        const { isAuthenticated } = this.props;
        if (isAuthenticated) 
            window.location.replace('/');
        return(
            <>
            <section className='ResetPassword'>
              <div className='container'>
      
                {this.state.verifyPage === false ?
                (this.getAccountInfo())
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

  export default connect(mapStateToProps)(forgotPassword);