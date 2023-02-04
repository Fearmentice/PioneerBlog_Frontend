import React, {Component} from "react"
import { connect } from "react-redux";
import { login, logout } from "../../actions/authAction";
import "./login.css"
import back from "../../assets/images/my-account.jpg"

class Login extends Component {
  constructor(props){
    super(props)

    this.state = {
      email: '',
      password: ''
    }
  }

handleChange = e => {
  this.setState({
      [e.target.name]: e.target.value
  });
}

 handleSubmit = e => {
  e.preventDefault();
  const { dispatch } = this.props;
  const { email, password } = this.state;
  dispatch(login(email, password));
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

          <form onSubmit={this.handleSubmit}>
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
