import React, { useState, useEffect } from "react"
import "./create.css"
import axios from "axios"

export const Create = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  const [image, setImage] = useState('');
  const [preview, setPreview] = useState();

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
    let _Response;
     await axios.post('https://pioneerblog-api.onrender.com/blogposts', {title: title, category:category, author:author, desc:content}).then(_response =>{
     console.log(_response)
     _Response = _response.data.doc; })
    .catch(error => {
      console.log(error)
    });

    const formData = new FormData();
    
    formData.append("coverPhoto", image);


  await axios.patch(`https://pioneerblog-api.onrender.com/blogposts/${_Response._id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }}).then(response =>{
      console.log(response)
      })
     .catch(error => {
       console.log(error)
     });
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
            <button className='button' onClick={() => {createPost()}}>Create Post</button>
        </div>
      </section>
    </>
  )
}
