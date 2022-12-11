import React, { useState } from "react"
import "./create.css"
import { IoIosAddCircleOutline } from "react-icons/io"
import axios from "axios"

export const Create = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [response, setResponse] = useState('');

  const post = {
    title: title,
    category: category,
    author: author,
    desc: content,
  }

  const createPost = async() => {

    console.log(post);

     await axios.post('https://pioneerblog-api.onrender.com/blogposts', {title: title, category:category, author:author, desc:content}).then(response =>{
     console.log(response)
     setResponse(response.data.doc)})
    .catch(error => {
      console.log(error)
    });

    await axios.patchForm('https://pioneerblog-api.onrender.com/blogposts', {title: title, category:category, author:author, desc:content}).then(response =>{
      console.log(response)
      setResponse(response.data.doc)})
     .catch(error => {
       console.log(error)
     });
  }

  return (
    <>
      <section className='newPost'>
        <div className='container boxItems'>
          <div className='img '>
            <img src='https://images.pexels.com/photos/6424244/pexels-photo-6424244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' alt='image' class='image-preview' />
          </div>
          <form>
            <div className='inputfile flexCenter'>
              <input type='file' accept='image/*' alt='img' />
            </div>
            <input type='text' onChange={(event) => setTitle(event.target.value)} value={title} placeholder='Title' />

            <input type='text' onChange={(event) => setCategory(event.target.value)} value={category} placeholder='Category' />

            <textarea name='' id='' cols='30' rows='10' onChange={(event) => setContent(event.target.value)} value={content}  placeholder='Content'></textarea>

            <input type='text' onChange={(event) => setAuthor(event.target.value)} value={author} placeholder='Author' />

          </form>
            <button className='button' onClick={() => createPost()}>Create Post</button>
        </div>
      </section>
    </>
  )
}
