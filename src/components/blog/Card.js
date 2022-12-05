import React, { Component, useCallback } from "react"
import "./blog.css"
import { AiOutlineTags, AiOutlineClockCircle, AiOutlineComment, AiOutlineShareAlt } from "react-icons/ai"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { Category } from "../category/Category"
import { category, currentCategory } from "../../assets/data/data"

export class Card extends Component {

  constructor(props) {
    super(props)
  }


  render() {

    return (
      <section className='blog' >
        <div className='container grid3'>
          {this.props.posts.map((item) => (
            <div className='box boxItems' key={item._id}>
              <div className='img'>
                <img src={`https://pioneerblog-api.onrender.com/blogposts/image/` + item.imageCover} alt='' />
              </div>
              <div className='details'>
                <div className='tag'>
                  <AiOutlineTags className='icon' />
                  <a href='/'>#{item.category}</a>
                </div>
                <Link to={`/details/${item._id}`} className='link'>
                  <h3>{item.title}</h3>
                </Link>
                <p>{item.desc.slice(0, 180)}...</p>
                <div className='date'>
                  <AiOutlineClockCircle className='icon' /> <label htmlFor=''>{item.publishDate}</label>
                  <AiOutlineShareAlt className='icon' /> <label htmlFor=''>{item.author}</label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }
}
