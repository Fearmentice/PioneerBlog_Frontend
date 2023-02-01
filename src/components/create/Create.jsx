import React, { useState, useEffect } from "react"
import "./create.css"
import { db } from "../../firebase-config";
import {collection, addDoc, Timestamp} from "firebase/firestore";
import {ref, uploadBytes, getStorage, getDownloadURL} from "firebase/storage"
import { v4 } from "uuid";
import { Link } from "react-router-dom";

import {Editor as ClassicEditor} from 'ckeditor5-custom-build/build/ckeditor';
import {CKEditor} from '@ckeditor/ckeditor5-react'

export const Create = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

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
      console.log("Image uploaded.");
    })

    const imageUrl = await getDownloadURL(imageRef).then(url => {
      return url;
    })
    // Add a new document in collection "blogposts"
    const newBlogpostRef = collection(db, "blogposts");
    const today = new Date();
    
    const newDocument = await addDoc(newBlogpostRef, {
      title: title,
      author: author,
      category: category,
      imageCover: imageUrl,
      body: content,
      view: 0,
      publishDate: Timestamp.now(),
      date: `${('0' + today.getDate()).slice(-2)}/${('0' + today.getMonth() + 1).slice(-2)}/${today.getFullYear()}`,
      active: true
    });
    console.log("Document created: " + newDocument);

  }

  return (
    <>
      <section className='newPost'>
        <div className='container boxItems'>
          <div className='img '>
            <img src={preview} alt='preview' className='image-preview' />
          </div>
          <form>
            <div className='inputfile flexCenter'>
              <input type='file' onChange={(event) => setImage(event.target.files[0])} accept='image/*' alt='img' />
            </div>
            <input type='text' onChange={(event) => setTitle(event.target.value)} value={title} placeholder='Title' />

            <input type='text' onChange={(event) => setCategory(event.target.value)} value={category} placeholder='Category' />
            
            <textarea name='' id='' cols='30' rows='10' onChange={(event) => setContent(event.target.value)} value={content}  placeholder='Content'></textarea>

            <input type='text' onChange={(event) => setAuthor(event.target.value)} value={author} placeholder='Author' />

          </form>
            <Link to={'/'}>
              <button className='button' onClick={() => {createPost()}}>Create Post</button>
            </Link>
        </div>
      </section>
    </>
  )
}
