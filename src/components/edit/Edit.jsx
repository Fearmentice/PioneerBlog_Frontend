import React, { useState, useEffect } from "react"
import "./edit.css"
import { Link, useParams, useHistory } from "react-router-dom";
//--DATABASE--
import { db } from "../../firebase-config";
import {collection, doc, getDoc, updateDoc, Timestamp} from "firebase/firestore";
import {ref, uploadBytes, getStorage, getDownloadURL} from "firebase/storage"
import { v4 } from "uuid";
//--TEXT-Editor--
import {Editor as ClassicEditor} from 'ckeditor5-custom-build/build/ckeditor';
import {CKEditor} from '@ckeditor/ckeditor5-react'

export const Edit = () => {
  const History = useHistory();
  const [id, setId] = useState(useParams());
  const [blogpost, setBlogpost] = useState({});

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


    useEffect(() => {
      getBlogpost();
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
      setContent(`${blogpost.body}`);
      setAuthor(`${blogpost.author}`);

      setPreview(`${blogpost.imageCover}`);
    }

  const updateBlogpost = async() => {

    const imageUrl = await uploadImage();

    // Update a document that already exist in database.
    const docRef = doc(db, "blogposts", `${id.id}`);

    //Update data.
    const data = {
      title: title,
      category: category,
      body: content,
      author: author,
      imageCover: imageUrl
    }

    //Update query.
    await updateDoc(docRef, data)
    .then(docRef => {
        console.log("A New Document Field has been added to an existing document");
    })

    const updatedDoc = await getDoc(docRef);

    setTimeout(() => {
      History.push('/');
    }, 2000)
  }
  const uploadImage = async() => {
    //Check if image is uploaded.
    if(image == null) return;

    //Check if new image has uploaded. if not upload return url of old one.
    if(blogpost.imageCover == preview) return preview;

    const imageRef = ref(storage,`images/${image.name + v4()}`)
    await uploadBytes(imageRef, image).then(() => {
      console.log("Image uploaded.");
    })

    const imageUrl = await getDownloadURL(imageRef).then(url => {
      return url;
    })

    return imageUrl;
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
              <button className='button' onClick={() => {updateBlogpost()}}>Update Post</button>
        </div>
      </section>
    </>
  )
}
