import React, { Component } from "react"
import "./blog.css"
import { blog } from "../../assets/data/data"
import { AiOutlineTags, AiOutlineClockCircle, AiOutlineComment, AiOutlineShareAlt } from "react-icons/ai"
import { Link } from "react-router-dom"
import data from "./Card"
import axios from "axios"

export class Card extends Component {

  constructor(props) {
    super(props)

    this.state = {
      posts: []
    }
  }

  componentDidMount() {
    axios.get(`https://jsonplaceholder.typicode.com/posts`).then(response => {
      console.log(response)
      this.setState({ posts: response.data })
    }).catch(error => {
      console.log(error)
    })
  }

  render() {
    const { posts } = this.state
    return (
      <section className='blog' >
        <data></data>
        <div className='container grid3'>
          {posts.map((item) => (
            <div className='box boxItems' key={item.id}>
              <div className='img'>
                <img src={item.cover} alt='' />
              </div>
              <div className='details'>
                <div className='tag'>
                  <AiOutlineTags className='icon' />
                  <a href='/'>#{"as"}</a>
                </div>
                <Link to={`/details/${item.id}`} className='link'>
                  <h3>{item.title}</h3>
                </Link>
                <p>{item.body.slice(0, 180)}...</p>
                <div className='date'>
                  <AiOutlineClockCircle className='icon' /> <label htmlFor=''>{"123"}</label>
                  <AiOutlineComment className='icon' /> <label htmlFor=''>27</label>
                  <AiOutlineShareAlt className='icon' /> <label htmlFor=''>SHARE</label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }
}
