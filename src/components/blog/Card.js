import React, { Component } from "react"
import "./blog.css"
import { AiOutlineTags, AiOutlineClockCircle } from "react-icons/ai"
import { FaRegUser } from "react-icons/fa"
import { GrView } from "react-icons/gr"
import { Link } from "react-router-dom"


export class Card extends Component {

  render() {
    return (
      <section className='blog' >
        <div className='container grid3'>
          {this.props.posts.map((item) => (
            <Link to={`/details/${item.id}`} className='link'>
              <div className='box boxItems' key={item.id}>
                <div className='img'>
                  <img src={item.imageCover} alt='' />
                </div>
                <div className='details'>
                  <div className='tag'>
                    <AiOutlineTags className='icon' />
                    <a href='/'>#{item.category}</a>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.body.slice(0, 120)}...</p>
                  <div className='date'>
                    <FaRegUser style={{ marginBottom: 5 }} className='icon' /> <label htmlFor=''>{item.author}</label>
                    <AiOutlineClockCircle className='icon' /> <label htmlFor=''>{item.title}</label>
                    <GrView className='icon' /> <label htmlFor=''>{item.view}</label>
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
