import React from "react"
import {useNavigate ,useHistory, useParams} from "react-router-dom"
import { Component } from "react"
import { Card } from "../../components/blog/Card"
import axios from "axios"
import { Category } from "../../components/category/Category"
import { withRouter } from "react-router";
import { category } from "../../assets/data/data"


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
    //console.log(this.state.category);
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
    const sort = "sort=-publishDate";
    await axios.get(`https://pioneerblog-api.onrender.com/blogposts/category/${this.state.category + "?" + sort}`).then(response => {
      console.log(response)
      this.setState({ posts: response.data.doc })
    }).catch(error => {
      console.log(error)
    })
  }

  componentDidMount(){
    const category = this.props.match.params.category;
    switch(category) {
      case "Culture":
        this.setCategory("Culture");
        break;
      case "Technology":
        this.setCategory("Technology");
        break;
      case "World":
        this.setCategory("World");
        break;
      case "Sport":
        this.setCategory("Sport");
        break;
      case "History":
        this.setCategory("History");
        break;
      case "News":
        this.setCategory("News");
        break;
      case "Health":
        this.setCategory("Health");
        break;
      default:
        this.setCategory("");
        this.props.history.push('/Home')
    }
  }

  render(){
    return(
      <>
        <Category setChanged={this.setCategory}/>
        <h1 style={{position:"inherit", marginLeft:50}}>
          {this.state.category == "" ? "Home" : this.state.category}
        </h1>
        <Card category={this.state.category} posts={this.state.posts} />
      </>
    )
  }
}
