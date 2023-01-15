import React, { Component, useCallback } from "react"
import "./blog.css"
import { AiOutlineTags, AiOutlineClockCircle, AiOutlineComment, AiOutlineShareAlt } from "react-icons/ai"
import { FaRegUser } from "react-icons/fa"
import { GrView } from "react-icons/gr"
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
            <Link to={`/details/${item._id}`} className='link'>
              <div className='box boxItems' key={item._id}>
                <div className='img'>
                  <img src={`https://pioneerblog-api.onrender.com/blogposts/image/` + item.imageCover} alt='' />
                </div>
                <div className='details'>
                  <div className='tag'>
                    <AiOutlineTags className='icon' />
                    <a href='/'>#{item.category}</a>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc.slice(0, 120)}...</p>
                  <div className='date'>
                    <FaRegUser style={{ marginBottom: 5 }} className='icon' /> <label htmlFor=''>{item.author}</label>
                    <AiOutlineClockCircle className='icon' /> <label htmlFor=''>{item.dateString}</label>
                    <GrView className='icon' /> <label htmlFor=''>{item.views}</label>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section >
    )
  }
}
