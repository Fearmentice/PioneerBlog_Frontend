import React from "react"
import { Component } from "react"
import { Card } from "../../components/blog/Card"
import { Category } from "../../components/category/Category"
import { db } from "../../firebase-config";
import {collection, getDocs, query, where, orderBy, limit} from "firebase/firestore";




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

    const blogpostsRef = collection(db, 'blogposts');
    const queryRef = query(blogpostsRef,  where("active", "==", true) , orderBy("publishDate", "desc"), limit(12));
    const docSnap = await getDocs(queryRef);
    let _posts = [];
    docSnap.forEach((doc) => {
      _posts.push({...doc.data(), id:doc.id });
    })
    this.setState({posts: _posts});
    console.log(_posts);
  }

  fetchPostsByCategory = async() => {
    const blogpostsRef = collection(db, "blogposts");
    try {
      const q = query(blogpostsRef,where("active", '==', true), where("category", "==", `${this.state.category}`, limit(12)));
      const docSnap = await getDocs(q);
      let postArray = [];
      docSnap.forEach((doc) => {
        postArray.push({...doc.data(), id:doc.id });
      })
      this.setState({posts: postArray});
    } catch(error) {
        console.log(error)
    };
  }


  componentDidMount(){
    //this.fetchposts();
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
      console.log(localStorage.getItem("jwtToken"))
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


export default Home;
