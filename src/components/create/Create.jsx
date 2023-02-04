import React, { useState, useEffect } from "react"
import "./create.css"
//--DATABASE--
import { db } from "../../firebase-config";
import {collection, query, where, orderBy, getDocs, addDoc, Timestamp, updateDoc} from "firebase/firestore";

import {ref, uploadBytes, getStorage, getDownloadURL} from "firebase/storage"
import { v4 } from "uuid";
import { Link } from "react-router-dom";

import textEditor from "../texEditor/textEditor";

import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";


export const Create = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');

  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const [image, setImage] = useState('');
  const [preview, setPreview] = useState();
  const storage = getStorage();

  const [text, setText] = useState('');

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

  const createPost = async() => {
    if(image == null) return;
    const imageRef = ref(storage,`images/${image.name + v4()}`)
    await uploadBytes(imageRef, image).then(() => {
    })

    const imageUrl = await getDownloadURL(imageRef).then(url => {
      return url;
    })

    //Auhtor Ref
    const authorsRef = collection(db, "authors");
    //Get author
    const queryRef = query(authorsRef,
      where("name", "==", `${author}`));
    const authorSnap = await getDocs(queryRef);
    // Add a new document in collection "blogposts"
    const newBlogpostRef = collection(db, "blogposts");
    const today = new Date();

    const newDocument = await addDoc(newBlogpostRef, {
      title: title,
      author: author,
      authorId: authorSnap.docs[0].id,
      category: category,
      imageCover: imageUrl,
      body: stateToHTML(editorState.getCurrentContent()),
      view: 0,
      favCount: 0,
      commentsId: [],
      publishDate: Timestamp.now(),
      date: `${('0' + today.getDate()).slice(-2)}/${('0' + today.getMonth() + 1).slice(-2)}/${today.getFullYear()}`,
      active: true
    });
  }

  const html = stateToHTML(editorState.getCurrentContent(), {
    inlineStyleFn: styles => {
      let key = "color-";
      let color = styles.filter(value => value.startsWith(key)).first();
      let a = "fontfamily-";
      let b = styles.filter(value => value.startsWith(a)).first();
      console.log(b, color);

      if (color) {
        return {
          element: "span",
          style: {
            color: color.replace(key, ""),
            fontFamily: b.replace(a, "")
          }
        };
      }
    }
  });
  const onEditorStatChange = (editorState) => {
    setEditorState(editorState);
    console.log(stateToHTML(editorState.getCurrentContent()))
  }

  return (
    <>
        <div className='container boxItems'>
          <form>
          <div className='img '>
            <img style={{width:400, height:250, objectFit: "cover"}} src={preview} alt='preview' className='image-preview' />
          </div>
            <div className='inputfile flexCenter'>
              <input type='file' onChange={(event) => setImage(event.target.files[0])} accept='image/*' alt='img' />
            </div>
            <input type='text' onChange={(event) => setTitle(event.target.value)} value={title} placeholder='Title' />

            <input type='text' onChange={(event) => setCategory(event.target.value)} value={category} placeholder='Category' />
            
            <Editor editorState={editorState} onEditorStateChange={onEditorStatChange}/>
            
            <input type='text' onChange={(event) => setAuthor(event.target.value)} value={author} placeholder='Author' />
            <Link to={'/'}>
              <button className='button' onClick={() => {createPost()}}>Create Post</button>
            </Link>
          </form>
        </div>
            
    </>
  )
}
