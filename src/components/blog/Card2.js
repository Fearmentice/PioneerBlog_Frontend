import React, { Component } from "react"
import "./blog.css"
import { blog } from "../../assets/data/data"
import { AiOutlineTags, AiOutlineClockCircle, AiOutlineComment, AiOutlineShareAlt } from "react-icons/ai"
import { Link } from "react-router-dom"
import axios from "axios"
import { Card } from "./Card2.js"

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
  // render() {
  //   const { posts } = this.state
  //   return (
  //     <Card posts={posts} />
  //   )
  // }
}
