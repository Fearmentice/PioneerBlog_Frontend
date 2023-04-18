import React, {Component} from "react"
//--DATABASE--
import { db } from "../../../firebase-config";
import {collection, addDoc} from "firebase/firestore";
import {ref, uploadBytes, getStorage, getDownloadURL} from "firebase/storage"
import { v4 } from "uuid";

import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";

import image from "../../../assets/images/defaultUser.jpg"

export class createAuthor extends Component {
  constructor(props){
    super(props)

    this.state = {
      name: '',
      description: '',
      editorState: EditorState.createEmpty(),
      image: '',
      posts: [],
      preview: image,
      selectedUser: {}
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

  const { name, editorState } = this.state;


  let imageUrl;
  if(this.state.image === '') {
    imageUrl = 'https://firebasestorage.googleapis.com/v0/b/vocham-api.appspot.com/o/users%2FdefaultUser.jpg?alt=media&token=8ffd11af-591d-418b-85dc-d87d723ba386';
  }else{
    const imageRef = ref(storage,`authors/${this.state.image.name + v4()}`)
    await uploadBytes(imageRef, this.state.image).then(() => {
    })
    imageUrl = await getDownloadURL(imageRef).then(url => {
      return url;
    })
  }
  

    // Add a new document in collection "authors"
    const newUserRef = collection(db, "authors");

    await addDoc(newUserRef, {
        name: name,
        description: stateToHTML(editorState.getCurrentContent()),
        posts:[],
        profilePhoto: imageUrl,
    });
    setTimeout(() => {
        window.location.replace('/login');
    }, 1000);


}
onEditorStatChange = (editorState) => {
    this.setState({editorState: editorState});
  }
render(){
  const { isAuthenticated } = this.props;
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
                <input type='file' onChange={(event) => this.setImage(event.target.files[0])} accept='image/*' src={image} />
                <img style={{objectFit:"cover"}} src={this.state.preview} alt='Previews the author profile.' class='image-preview' />
              </div>
            </div>
            <div className='right'>
              <label htmlFor=''>Author Name</label>
              <input type='text' onChange={this.handleChange} name="name"/>
              <label htmlFor=''>Description</label>
              <Editor editorState={this.state.editorState} onEditorStateChange={this.onEditorStatChange}/>
              <button onClick={() => this.handleSubmit()} className='button'>Create Author</button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
}
