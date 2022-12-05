import React from "react"
import {useHistory} from "react-router-dom"
import { Component } from "react"
import { Card } from "../../components/blog/Card"
import axios from "axios"
import { Category } from "../../components/category/Category"

export class Home extends Component{
  constructor(props) {
    super(props)

    this.state = {
      category: "",
      posts: []
    }
    this.setCategory = this.setCategory.bind(this);
    this.fetchposts = this.fetchposts.bind(this);
    this.fetchPostsByCategory = this.fetchPostsByCategory.bind(this);
  }

  setCategory = async(_category) => {
    await this.setState({ category: _category });
    console.log(this.state.category);
    if(this.state.category){
      this.fetchPostsByCategory();
    }else{
      this.fetchposts();
    }
  }

  fetchposts = async() => {
    const sort = "sort=-publishDate";
    await axios.get(`https://pioneerblog-api.onrender.com/blogposts${"?" + sort}`).then(response => {
      console.log(response)
      this.setState({ posts: response.data.doc })
    }).catch(error => {
      console.log(error)
    })
  }

  fetchPostsByCategory = async() => {
    console.log(this.state.category);
    const sort = "sort=-publishDate";
    await axios.get(`https://pioneerblog-api.onrender.com/blogposts/category/${this.state.category}?sort=-publishDate`).then(response => {
      console.log(response)
      this.setState({ posts: response.data.doc })
    }).catch(error => {
      console.log(error)
    })
  }

  componentDidMount(){
    this.fetchposts();
  }

  render(){
    return(
      <>
      <Category setChanged={this.setCategory}/>
      <Card category={this.state.category} posts={this.state.posts} />
      </>
    )
  }
}
