import React from "react"
import { Component } from "react"
import { Card } from "../../components/blog/Card"
import './Home.css'
import { Category } from "../../components/category/Category"
import { DownOutlined } from '@ant-design/icons';
import { db } from "../../firebase-config";
import {collection, getDocs, query, where, orderBy, limit} from "firebase/firestore";
import { MetaTags } from "react-meta-tags"
import { loadMoreBlogposts } from "../../Api/blogpostController"




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

  fetchposts = async() => {
    //Blogpost ref.
    const blogpostsRef = collection(db, 'blogposts');

    let _posts = [];
    //Query.
    const queryRef = query(blogpostsRef,  
      where("active", "==", true) , 
      orderBy("publishDate", "desc"),
      limit(this.state.pageSize));
    const docSnap = await getDocs(queryRef);

    

    docSnap.forEach(async(blogDoc) => {
      _posts.push({...blogDoc.data(), id: blogDoc.id});
    })
    this.setState({posts: _posts});
    this.setState({lastPost: docSnap.docs[docSnap.docs.length - 1]});
    
  }

  fetchPostsByCategory = async() => {
    //Blogpost reference.
    const blogpostsRef = collection(db, "blogposts");
       // Query.
       console.log(this.state.pageSize)
      const q = query(blogpostsRef,
        where("active", '==', true),
        orderBy("publishDate", "desc"),
        where("category", "==", `${this.state.category}`),
        limit(this.state.pageSize));

      const docSnap = await getDocs(q);
      let postArray = [];
      docSnap.forEach((doc) => {
        postArray.push({...doc.data(), id:doc.id });
      })
      this.setState({
        posts: postArray, 
        lastPost: docSnap.docs[docSnap.docs.length - 1]});
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
  getCategoryBasedBlogposts = async(_Category) => {
    const blogpostsRef = collection(db, 'blogposts');
    const queryRef = query(blogpostsRef, where("active", "==", true), where("category", "==", `${_Category}`) ,orderBy('view', 'asc') , limit(5));
    const docSnap = await getDocs(queryRef);
    let _popularPosts = [];
    docSnap.forEach((doc) => {
      _popularPosts.push({...doc.data(), id:doc.id });
    })
    this.setState({popularWritings: _popularPosts})
}

  updateCategory = async() => {
    const category = this.props.match.params.category;
    switch(category) {
      case "Technology":
        this.setCategory("Technology");
        this.getCategoryBasedBlogposts(category);
        break;
      case "World":
        this.setCategory("World");
        this.getCategoryBasedBlogposts(category);
        break;
      case "Sport":
        this.setCategory("Sport");
        this.getCategoryBasedBlogposts(category);
        break;
      case "History":
        this.setCategory("History");
        this.getCategoryBasedBlogposts(category);
        break;
      case "News":
        this.setCategory("News");
        this.getCategoryBasedBlogposts(category);
        break;
      case "Health":
        this.setCategory("Health");
        this.getCategoryBasedBlogposts(category);
        break;
      case "Home":
          this.setCategory("");
          this.getCategory();
          break;
          default:
            this.setCategory("");
            this.getCategory();
            this.props.history.push('/')
          }
  }

  componentDidMount () {
    //this.fetchposts();
    this.updateCategory();
  }


  render(){
    return(
      <>
      <MetaTags>
        <meta name="description" content="We are a group of students who try to write about right and useful informations to our dear readers. Also we are just students who want to improve himself and try to be good at writing with a excellent English language." />
      </MetaTags>
        <Category setChanged={this.setCategory} category={this.state.category} popularWritings={this.state.popularWritings}/>
          <h1 className="categoryTitle">
            {this.state.category === "" ? "Home": this.state.category}
          </h1>
        <Card posts={this.state.posts} />
          <div className="Pagination">
              {/* <a onClick={() => this.onPrevious()} class="previous round paginate">{'<'}</a>
              <a onClick={() => this.loadMore()} class="nextButton round paginate">{'>'}</a> */}
              <button onClick={() => this.state.category ?this.loadMoreCategoryBased() : this.loadMore()}>Load More</button>
              <DownOutlined className="icon"/>
          </div>
      </>
    )
  }
}


export default Home;
