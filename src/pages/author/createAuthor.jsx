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
import {ref, uploadBytes, getStorage, getDownloadURL} from "firebase/storage"
import { v4 } from "uuid";

import image from "../../assets/images/defaultUser.jpg"

export class createAuthor extends Component {
  constructor(props){
    super(props)

    this.state = {
      name: '',
      description: '',
      image: '',
      preview: image,
    }

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
  const { name, description } = this.state;


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
  

    // Add a new document in collection "authors"
    const newUserRef = collection(db, "authors");

    const newDocument = await addDoc(newUserRef, {
        name: name,
        description: description,
        profilePhoto: imageUrl,
    });
    setTimeout(() => {
        window.location.replace('/login');
    }, 1000);


}
render(){
  const { isAuthenticated, error, errorMessage } = this.props;
  if (isAuthenticated) 
      this.props.history.push('/');
  return (
    <>
      <section className='accountInfo'>
        <div className='container boxItems'>
          <h1>Create Author</h1>
          <div className='content'>
            <div className='left'>
              <div className='img flexCenter'>
                <input type='file' onChange={(event) => this.setImage(event.target.files[0])} accept='image/*' src={image} alt='img' />
                <img style={{objectFit:"cover"}} src={this.state.preview} alt='image' class='image-preview' />
              </div>
            </div>
            <div className='right'>
              <label htmlFor=''>Author Name</label>
              <input type='text' onChange={this.handleChange} name="name"/>
              <label htmlFor=''>Description</label>
              <input type='email' onChange={this.handleChange} name="description"/>
              <button onClick={() => this.handleSubmit()} className='button'>Create Author</button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
}
