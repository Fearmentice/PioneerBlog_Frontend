import React, {useState, useEffect, useCallback} from "react"
import { useHistory } from "react-router-dom";
import "./login.css"
import back from "../../assets/images/my-account.jpg"
import axios from "axios"
import { Alert } from "@mui/material";
import AlertTitle from '@mui/material/AlertTitle';

export const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [success, setSuccess] = useState(Boolean);

 const loginRequest = async() => {
  let _Response;
  const self = this;
  await axios.post('https://pioneerblog-api.onrender.com/users/login', {email: email, password: password}).then(_response =>{
    console.log(_response)
    _Response = _response.data; 
  })
   .catch(error => {
     console.log(error);
     _Response = "error";
   });
   if(_Response != "error" && _Response.status == "success"){
    props.setIsLoggedIn(true);
    alert("Success");
   }else{
    alert("Email or Password is not correct!");
   }
 }

 const createSuccessAlert = () => {
  if(success){
    return (
      <Alert style={{marginBottom: 25}} severity="success">
        <AlertTitle>Success</AlertTitle>
        This is a success alert — <strong>check it out!</strong>
      </Alert>
    )
  }
 }

 const handleSubmit = event => {
  // 👇️ prevent page refresh
  event.preventDefault();

  console.log('form submitted ✅');
};

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

          <form onSubmit={handleSubmit}>
            <span>Username or email address *</span>
            <input type='text' onChange={(event) => setEmail(event.target.value)} value={email} required />
            <span>Password *</span>
            <input type='password' onChange={(event) => setPassword(event.target.value)} value={password} required />
            <button className='button' onClick={() => {loginRequest()}}>Log in</button>
          </form>

        </div>
      </section>
    </>
  )
}
