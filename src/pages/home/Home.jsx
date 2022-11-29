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
    this.setChanged = this.setChanged.bind(this);
    this.fetchposts = this.fetchposts.bind(this);
    this.fetchPostsByCategory = this.fetchPostsByCategory.bind(this);
  }

  setChanged(_category) {
    this.setState({ category: _category });
    console.log(this.state.category);
    if(this.state.category){
      this.fetchPostsByCategory();
    }else{
      this.fetchposts();
    }
  }

  fetchposts() {
    axios.get(`https://pioneerblog-api.onrender.com/blogposts`).then(response => {
      console.log(response)
      this.setState({ posts: response.data.doc })
    }).catch(error => {
      console.log(error)
    })
  }

  fetchPostsByCategory() {
    console.log(this.state.category);
    axios.get(`https://pioneerblog-api.onrender.com/blogposts/category/${this.state.category}`).then(response => {
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
      <Category setChanged={this.setChanged}/>
      <Card category={this.state.category} posts={this.state.posts} />
      </>
    )
  }
}
