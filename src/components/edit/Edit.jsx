import React, { useState, useEffect } from "react"
import "./edit.css"
import {categories} from '../../assets/data/data';
import { useParams, useHistory } from "react-router-dom";
//--DATABASE--
import { db } from "../../firebase-config";
import { doc, where, getDoc, collection, query, getDocs, updateDoc } from "firebase/firestore";
import {ref, uploadBytes, getStorage, getDownloadURL} from "firebase/storage"
import { v4 } from "uuid";

import { ContentState, convertFromHTML, convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";

import {DropDownListComponent} from '@syncfusion/ej2-react-dropdowns';
// Registering Syncfusion license key
import { registerLicense } from '@syncfusion/ej2-base';

export const Edit = () => {
  registerLicense('ORg4AjUWIQA/Gnt2VVhkQlFadVdJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkdjUX9XdHdWRWdaU0Q=');
  const History = useHistory();
  const [id] = useState(useParams());
  const [blogpost, setBlogpost] = useState({});

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');

  const [allAuthors, setAllAuthors] = useState([]);

  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const [image, setImage] = useState('');
  const [preview, setPreview] = useState();
  const storage = getStorage();

      // create a preview as a side effect, whenever selected file is changed
      useEffect(() => {
        if (!image) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(image)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [image])


    useEffect(() => {
      getBlogpost();
      getAllAuthors();
    }, []);

    const getBlogpost = async() => {
      //Get data by its reference.
      const docRef = doc(db, "blogposts", `${id.id}`);
      const docSnap = await getDoc(docRef);
      const blogpost = docSnap.data();

      //Save user to state.
      setBlogpost(blogpost);

      //Set init datas.
      setTitle(`${blogpost.title}`);
      setCategory(`${blogpost.category}`);
      
      const blocksFromHtml = convertFromHTML(blogpost.body);
      const state = ContentState.createFromBlockArray(
        blocksFromHtml.contentBlocks,
        blocksFromHtml.entityMap,
      );
      const _editorState = EditorState.createWithContent(state);
      setEditorState(_editorState);

      setAuthor(`${blogpost.author}`);

      setPreview(`${blogpost.imageCover}`);
    }

  const updateBlogpost = async(event) => {
    event.preventDefault();
    const imageUrl = await uploadImage();

    const authorRef = collection(db, "authors")
    const queryRef = query(authorRef, where("name", "==", author));
    const authorId = await getDocs(queryRef);
    // Update a document that already exist in database.
    const docRef = doc(db, "blogposts", `${id.id}`);

    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);

    //Update data.
    const data = {
      title: title,
      category: category,
      desc: rawContentState.blocks[0].text,
      body: stateToHTML(editorState.getCurrentContent()),
      author: author,
      authorId: authorId.docs[0].id,
      imageCover: imageUrl
    }

    //Update query.
    await updateDoc(docRef, data);

    await getDoc(docRef).then(() => {
      window.location.reload();
    });
  }
  const uploadImage = async() => {
    //Check if image is uploaded.
    if(preview == null) return;

    //Check if new image has uploaded. if not upload return url of old one.
    if(blogpost.imageCover === preview) return preview;

    const imageRef = ref(storage,`images/${image.name + v4()}`)
    await uploadBytes(imageRef, image);

    const imageUrl = await getDownloadURL(imageRef).then(url => {
      return url;
    })

    return imageUrl;
}

const onEditorStatChange = (editorState) => {
  setEditorState(editorState);
}

const getAllAuthors = async() => {
  //Authors ref.
  const authorsRef = collection(db, 'authors');

  //Query.
  const queryRef = query(authorsRef);
  const docSnap = await getDocs(queryRef);
  let _authors = [];
  docSnap.forEach((doc) => {
    _authors.push(doc.data().name);
  })
  setAllAuthors(_authors);
}

  return (
    <>
        <div className='container boxItems'>
          <form onSubmit={updateBlogpost}>
          <div className='img '>
          </div>
            <div style={{flexDirection:"column"}} className='inputfile flexCenter'>
              <img style={{width:400, height:250, objectFit: "cover", marginBottom:10}} src={preview} alt='Previews the article.' className='image-preview' />
              <input type='file' onChange={(event) => setImage(event.target.files[0])} accept='image/*' alt='img' />
            </div>
            <input type='text' onChange={(event) => setTitle(event.target.value)} value={title} placeholder='Title' />

            <div >
              <DropDownListComponent 
              value={category}
              onChange={(event) => setCategory(event.target.value)} 
              placeholder="Categories"
              dataSource={[...categories, "News From School"]} 
              fields={{value:"EmployeeID", text:"FirstName"}}></DropDownListComponent>
            </div>
            <Editor placeholder="Content" editorState={editorState} onEditorStateChange={onEditorStatChange}/>
            <div >
              <DropDownListComponent 
              value={author}
              onChange={(event) => setAuthor(event.target.value)} 
              placeholder="Author"
              dataSource={allAuthors} 
              fields={{value:"EmployeeID", text:"FirstName"}}></DropDownListComponent>
            </div>
              <button type="submit" className='button'>Update Post</button>
          </form>
        </div>
            
    </>
  )
}
