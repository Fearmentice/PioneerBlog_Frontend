import React, {Component} from "react"

import './editAuthor.css'

//--DATABASE--
import { db } from "../../../firebase-config";
import {collection, query, getDocs, where, doc, updateDoc} from "firebase/firestore";
import {ref, uploadBytes, getStorage, getDownloadURL} from "firebase/storage"
import { v4 } from "uuid";

import { ContentState, convertFromHTML, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";

import image from "../../../assets/images/defaultUser.jpg"

import {DropDownListComponent} from '@syncfusion/ej2-react-dropdowns';
import { registerLicense } from '@syncfusion/ej2-base';

export class editAuthor extends Component {
  constructor(props){
    super(props)

    registerLicense('ORg4AjUWIQA/Gnt2VVhkQlFadVdJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkdjUX9XdHdWRWdaU0Q=');

    this.state = {
      name: '',
      description: '',
      author: '',
      editorState: EditorState.createEmpty(),
      image: '',
      posts: [],
      preview: image,
      allAuthors: [],
      selectedUser: ''
    }

    this.setSelectedAuthor = this.setSelectedAuthor.bind(this);
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

  uploadImage = async() => {
    const storage = getStorage();

    //Check if image is uploaded.
    if(this.state.image == null) return;

    //Check if new image has uploaded. if not upload return url of old one.
    if(this.state.selectedUser.profilePhoto === this.state.preview) return this.state.preview;

    const imageRef = ref(storage,`authors/${this.state.image.name + v4()}`)
    await uploadBytes(imageRef, this.state.image);

    const imageUrl = await getDownloadURL(imageRef).then(url => {
      return url;
    })

    return imageUrl;
  }

  handleSubmit = async() => {
    const imageUrl = await this.uploadImage();

    // Add a new document in collection "authors"
    const updateUserRef = doc(db, "authors", this.state.selectedUser.id);

    const data = {
      name: this.state.name,
      description: stateToHTML(this.state.editorState.getCurrentContent()),
      profilePhoto: imageUrl
    }

    await updateDoc(updateUserRef, data)

    this.state.selectedUser.posts.forEach(async(id) => {
      const updateUserRef = doc(db, "blogposts", id);
      const updateData = {
        author: this.state.name
      }

      await updateDoc(updateUserRef, updateData);
    })
    
     setTimeout(() => {
         window.location.replace('/login');
     }, 1000);


  }

  onEditorStatChange = (editorState) => {
    this.setState({editorState: editorState});
  }

  getAllAuthors = async() => {
  //Authors ref.
  const authorsRef = collection(db, 'authors');

  //Query.
  const queryRef = query(authorsRef);
  const docSnap = await getDocs(queryRef);
  let _authors = [];
  docSnap.forEach((doc) => {
    _authors.push(doc.data().name);
  })
  this.setState({allAuthors: _authors});
  }

  getAuthorInfo = async(_authorName) => { 
  const authorRef = collection(db, 'authors');
  const queryRef = query(authorRef, where('name', '==', _authorName))
  const authorSnap = await getDocs(queryRef);
  const authorData = {...authorSnap.docs[0].data(), id: authorSnap.docs[0].id}
  this.setState({selectedUser: authorData})
  this.setState({name: authorData.name})
  this.setState({preview: authorData.profilePhoto})

  const blocksFromHtml = convertFromHTML(authorData.description);
  const state = ContentState.createFromBlockArray(
    blocksFromHtml.contentBlocks,
    blocksFromHtml.entityMap,
  );
  const _editorState = EditorState.createWithContent(state);
  this.setState({editorState: _editorState});
  }

  componentDidMount = () => {
  this.getAllAuthors();
  }

  setSelectedAuthor = (_author) => {
    this.setState({selectedUser: _author})
    this.getAuthorInfo(_author);
  }

render(){
  const { isAuthenticated } = this.props;
  if (isAuthenticated) 
      this.props.history.push('/');
  return (
    <>
      <section className='accountInfo'>
        <div className='container boxItems'>
          <h1>Edit Author</h1>
          <DropDownListComponent
          className="dropdownSelect"
          onChange={(event) => this.setSelectedAuthor(event.target.value)} 
          placeholder="Categories"
          dataSource={this.state.allAuthors} ></DropDownListComponent>
          {this.state.selectedUser ? 
          <div className='content'>
            <div className='left'>
              <div className='img flexCenter'>
                <input type='file' onChange={(event) => this.setImage(event.target.files[0])} accept='image/*' src={image} />
                <img style={{objectFit:"cover"}} src={this.state.preview} alt='Previews uploaded author profile.' class='image-preview' />
              </div>
            </div>
            <div className='right'>
              <label htmlFor=''>Author Name</label>
              <input type='text' value={this.state.name} onChange={this.handleChange} name="name"/>
              <label htmlFor=''>Description</label>
              <Editor editorState={this.state.editorState} onEditorStateChange={this.onEditorStatChange}/>
              <button onClick={() => this.handleSubmit()} className='button'>Create Author</button>
            </div>
          </div>
          :
          null
          }
        </div>
      </section>
    </>
  )
}
}
