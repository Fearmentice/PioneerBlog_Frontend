import React, { useState, useEffect } from "react"
import "./create.css"
import {categories} from '../../assets/data/data';
//--DATABASE--
import { db } from "../../firebase-config";
import {collection, doc, query, where, getDocs, addDoc, Timestamp, updateDoc} from "firebase/firestore";

import {ref, uploadBytes, getStorage, getDownloadURL} from "firebase/storage"
import { v4 } from "uuid";

import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";

import {DropDownListComponent} from '@syncfusion/ej2-react-dropdowns';
import { registerLicense } from '@syncfusion/ej2-base';


export const Create = () => {
  registerLicense('ORg4AjUWIQA/Gnt2VVhkQlFadVdJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkdjUX9XdHdWRWdaU0Q=');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');

  const [allAuthors, setAllAuthors] = useState([]);

  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const [image, setImage] = useState('');
  const [preview, setPreview] = useState();
  const storage = getStorage();


  useEffect(() => {
    getAllAuthors();
  }, [])

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

  const createPost = async(e) => {
    
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
    const publishDate = today.toLocaleDateString('tr-TR', {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\./g,'/')

    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);

    const newDoc = await addDoc(newBlogpostRef, {
      title: title,
      author: author,
      authorId: authorSnap.docs[0].id,
      category: category,
      imageCover: imageUrl,
      body: stateToHTML(editorState.getCurrentContent()),
      view: 0,
      favCount: 0,
      newsFromSchool: category=="News From School",
      desc: rawContentState.blocks[0].text,
      commentsId: [],
      publishDate: Timestamp.now(),
      date: `${publishDate}`,
      active: true
    });

    const data = {
      posts: [...authorSnap.docs[0].data().posts, newDoc.id]
    }

    const updateRef = doc(db, "authors", `${authorSnap.docs[0].id}`);
    await updateDoc(updateRef, data);

    setTimeout(() => {
      window.location.replace('/');
    }, 1000)
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
          <form>
          <div className='img '>
          </div>
            <div style={{flexDirection:"column"}} className='inputfile flexCenter'>
              <img style={{width:400, height:250, objectFit: "cover", marginBottom:10}} src={preview} alt='Explains the article.' className='image-preview' />
              <input type='file' onChange={(event) => setImage(event.target.files[0])} accept='image/*' alt='img' />
            </div>
            <input type='text' onChange={(event) => setTitle(event.target.value)} value={title} placeholder='Title' />

            <div >
              <DropDownListComponent 
              onChange={(event) => setCategory(event.target.value)} 
              placeholder="Categories"
              dataSource={[...categories, "News From School"]} 
              fields={{value:"EmployeeID", text:"FirstName"}}></DropDownListComponent>
            </div>
            <Editor placeholder="Content" editorState={editorState} onEditorStateChange={onEditorStatChange}/>
            <div >
              <DropDownListComponent 
              onChange={(event) => setAuthor(event.target.value)} 
              placeholder="Author"
              dataSource={allAuthors} 
              fields={{value:"EmployeeID", text:"FirstName"}}></DropDownListComponent>
            </div>
              <button className='button' onClick={(event) =>{event.preventDefault() 
                createPost()}}>Create Post</button>
          </form>
        </div>
            
    </>
  )
}
