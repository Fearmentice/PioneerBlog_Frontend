import React from "react"
import { Component } from "react"
import { Card } from "../../components/blog/Card"
import './Home.css'
import { Category } from "../../components/category/Category"
import { DownOutlined } from '@ant-design/icons';
import { db } from "../../firebase-config";
import {collection, getDocs, query, where, orderBy, limit} from "firebase/firestore";
import { MetaTags } from "react-meta-tags"
import { loadMoreBlogposts, fetchPosts } from "../../Api/blogpostController"
import { categories } from '../../assets/data/data.js'




class Home extends Component{
  constructor(props) {
    super(props)

    this.state = {
      category: "",
      posts: [],
      lastPost: {},
      pageSize: 9,
      popularWritings: []
    }
    this.setCategory = this.setCategory.bind(this);
    this.fetchposts = this.fetchposts.bind(this);
    this.fetchPostsByCategory = this.fetchPostsByCategory.bind(this);
    this.getCategory = this.getCategory.bind(this);
  }

  setCategory = async(_category) => {
    await this.setState({ category: _category });
    if(this.state.category){
      this.fetchPostsByCategory();
    }else{
      this.fetchposts();
    }
  }

  //On render fetches the blogposts.
  fetchposts = async() => {
    const {posts, lastPost} = await fetchPosts('publishDate', 'desc',
     this.state.pageSize, null);
    this.setState({posts: posts, lastPost: lastPost});
    
  }

  //On render fetches the blogposts by category.
  fetchPostsByCategory = async() => {
    const {posts, lastPost} = await fetchPosts(
      'publishDate', 'desc',
      this.state.pageSize, 
      this.state.category);
    this.setState({posts: posts, lastPost: lastPost});
  }

  //Loads more posts by publish order.
  loadMore = async() => {
        //Loads more  blogpsots.
        const {posts, lastPost} = await loadMoreBlogposts(
          [...this.state.posts],
          this.state.lastPost,
          null,
          this.state.pageSize,
          null);

        this.setState({
          posts: posts, 
          lastPost: lastPost});
  }
  //Loads more posts based on category.
  loadMoreCategoryBased = async() => {
    //Loads more  blogpsots.
    const {posts, lastPost} = await loadMoreBlogposts(
      [...this.state.posts],
      this.state.lastPost,
      null,
      this.state.pageSize,
      this.state.category);
      
    this.setState({
      posts: posts, 
      lastPost: lastPost});
}


  getCategory = async() => {
    const blogpostsRef = collection(db, 'blogposts');
    const categories = ['Technology', 'Culture', 'History', 'World', 'Health', 'Sport', 'News'];
    let _popularPosts = [...this.state.popularWritings];

    categories.forEach( async(category) => {
    const queryRef = query(blogpostsRef, where("active", "==", true), where("category", "==", `${category}`) ,orderBy('view', 'asc') , limit(1));
    const docSnap = await getDocs(queryRef);
    docSnap.forEach((doc) => {
      _popularPosts.push({...doc.data(), id:doc.id });
    })
  })

    this.setState({popularWritings: _popularPosts})
}

//Gets category's most popular writings for the slider.
  getCategoryBasedBlogposts = async(_Category) => {
    const {posts} = await fetchPosts('view', 'asc',
    5, _Category);
    this.setState({popularWritings: posts})
}

  updateCategory = async() => {
    const category = this.props.match.params.category;

    let catFound = false;
    //Checks if the category param is in the url.
    categories.forEach(_category => {
      if(category === _category){
        this.setCategory(category);
        this.getCategoryBasedBlogposts(category);
        catFound = true;
      }
    });
    //If category is not match with current categories.
    if(!catFound){
      console.log(category)
      if(category == "Latest"){
        this.setCategory("");
        this.getCategory();
      }else{
        this.setCategory("");
        this.getCategory();
        this.props.history.push('/')
      }
    }
  }

  componentDidMount () {
    this.updateCategory();
  }


  render(){
    return(
      <>
      <MetaTags>
        <meta name="description" content="We are a group of students who try to write about right and useful informations to our dear readers. Also we are just students who want to improve himself and try to be good at writing with a excellent English language." />
      </MetaTags>
        <Category title="Popular Writings" setChanged={this.setCategory} category={this.state.category} popularWritings={this.state.popularWritings}/>
          <h2 className="categoryTitle">
            {this.state.category === "" ? "Latest Posts": this.state.category}
          </h2>
        <Card posts={this.state.posts} />
          <div className="Pagination">
              <button onClick={() => this.state.category ? this.loadMoreCategoryBased() : this.loadMore()}>Load More</button>
              <DownOutlined className="icon"/>
          </div>
      </>
    )
  }
}
export default Home;