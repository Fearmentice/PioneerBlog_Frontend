import React from "react"
import { Component } from "react"
import { Card } from "../../components/blog/Card"
import axios from "axios"
import { Category } from "../../components/category/Category"
import { connect } from "react-redux";
import jwtDecode from 'jwt-decode';



const userInfo = state => {
  const token = localStorage.getItem("jwtToken");
  if(token) {
      return jwtDecode(token);
  }
  else 
      return state.auth.user;
}

class Home extends Component{
  constructor(props) {
    super(props)

    this.state = {
      category: "",
      posts: [],
      user: {}
    }
    this.setCategory = this.setCategory.bind(this);
    this.fetchposts = this.fetchposts.bind(this);
    this.fetchPostsByCategory = this.fetchPostsByCategory.bind(this);
    this.fetchUser = this.fetchUser.bind(this);
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

  fetchUser = async() => {
    await axios.get(`http://localhost:8000/users/me`).then(response => {
      console.log(response)
      this.setState({ user: response.data })
    }).catch(error => {
      console.log(error)
    })
  }

  componentDidMount(){
    this.fetchUser();
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
      case "Home":
          this.setCategory("");
          break;
      default:
        this.setCategory("");
        this.props.history.push('/')
    }

  }

  render(){
    return(
      <>
        <Category setChanged={this.setCategory}/>
        <h1 style={{position:"inherit", marginLeft:50}}>
          {this.state.category === "" ? "Home": this.state.category}
        </h1>
        <Card category={this.state.category} posts={this.state.posts} />
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
      user: userInfo(state)
  };
};

export default connect(mapStateToProps)(Home);
