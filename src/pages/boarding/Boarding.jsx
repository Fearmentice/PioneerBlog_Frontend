import React from "react"
import { Component } from "react"
import './boarding.css'
import { Card } from "../../components/blog/Card"
import { Category } from "../../components/category/Category"
import { db } from "../../firebase-config";
import {collection, getDocs, query, where, orderBy, limit} from "firebase/firestore";
import { MetaTags } from "react-meta-tags"
import { loadMoreBlogposts, fetchPosts } from "../../Api/blogpostController"
import { categories } from '../../assets/data/data.js'
import { Link } from "react-router-dom"



class Boarding extends Component{
  constructor(props) {
    super(props)

    this.state = {
      category: "",
      posts: [],
      lastPost: {},
      pageSize: 9,
      popularWritings: [],
      mostPopular: []
    }
    this.setCategory = this.setCategory.bind(this);
    this.fetchposts = this.fetchposts.bind(this);
    this.fetchPostsByCategory = this.fetchPostsByCategory.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.getMostPopularPosts = this.getMostPopularPosts.bind(this);
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

   getMostPopularPosts = async() => {
        const {posts} = await fetchPosts('view', 'desc',
        4, null);
        this.setState({mostPopular: posts})
}

  getCategory = async() => {
    const blogpostsRef = collection(db, 'blogposts');
    const categories = ['Technology', 'Culture', 'History', 'World', 'Health', 'Sport', 'News'];
    let _popularPosts = [...this.state.popularWritings];

    
    const queryRef = query(blogpostsRef, where("active", "==", true), where("category", "==", `News From School`) ,orderBy('view', 'asc') , limit(3));
    const docSnap = await getDocs(queryRef);
    docSnap.forEach((doc) => {
      _popularPosts.push({...doc.data(), id:doc.id });
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
      this.setCategory("");
      this.getCategory();
      this.props.history.push('/')
    }
  }

  componentDidMount () {
    this.updateCategory();
    this.getMostPopularPosts();
  }

  getSummary(text, length) {
    if(!text) return '';
    return text.slice(0,length);
  }

  render(){
    return(
      <>
      <MetaTags>
        <meta name="description" content="We are a group of students who try to write about right and useful informations to our dear readers. Also we are just students who want to improve himself and try to be good at writing with a excellent English language." />
      </MetaTags>
      <div className="popularPosts">
        <h2>Popular Writings</h2>
            <div className="content">
            <Link to ={`/details/${{...this.state.mostPopular[0]}.id}`}>
              <div className='leftBox'  >
                  <div className="imgContainer">
                      {console.log()}
                      <img src={{...this.state.mostPopular[0]}.imageCover} alt={``} />
                  </div>
                  <div className='overlay'>
                      <div className="titleBox" >
                          <h4 style={{ color: '#fdf77e'}}>{this.getSummary({...this.state.mostPopular[0]}.title, 50)}</h4>
                      </div>
                      <div className="descBox">
                          <p style={{ color:"white"}}>{this.getSummary({...this.state.mostPopular[0]}.desc, 150)}...</p>
                          <p style={{color: "grey"}}>Continue Reading...</p>
                      </div>
                  </div>
              </div>
            </Link>
            <div className="rightImages">
            <Link to ={`/details/${{...this.state.mostPopular[1]}.id}`}>
                <div className='rightBox'  >
                    <div className="imgContainer">
                        <img src={{...this.state.mostPopular[1]}.imageCover} alt={``} />
                    </div>
                    <div className='overlay'>
                        <div className="titleBox" >
                            <h4 style={{ color: '#fdf77e'}}>{this.getSummary({...this.state.mostPopular[1]}.title, 50)}</h4>
                        </div>
                        <div className="descBox">
                            <p style={{color:"white",}}>{this.getSummary({...this.state.mostPopular[1]}.desc, 100)}...</p>
                            <p style={{color: "grey", padding: 0}}>Continue Reading...</p>
                        </div>
                    </div>
                </div>
              </Link>
                <div className="miniImages">
                <Link to ={`/details/${{...this.state.mostPopular[2]}.id}`}>
                    <div className='miniBox'  >
                        <div className="imgContainer">
                            <img src={{...this.state.mostPopular[2]}.imageCover} alt={``} />
                        </div>
                        <div className='overlay'>
                            <div className="titleBox" >
                                <h4 style={{ color: '#fdf77e'}}>{this.getSummary({...this.state.mostPopular[2]}.title, 50)}</h4>
                            </div>
                            <div className="descBox">
                                <p style={{color:"white", padding: 0}}>{this.getSummary({...this.state.mostPopular[2]}.desc, 70)}...</p>
                                <p style={{color: "grey", padding:0}}>Continue Reading...</p>
                            </div>
                        </div>
                    </div>
                  </Link>
                  <Link to ={`/details/${{...this.state.mostPopular[3]}.id}`}>
                    <div className='miniBox'  >
                        <div className="imgContainer">
                            <img src={{...this.state.mostPopular[3]}.imageCover} alt={``} />
                        </div>
                        <div className='overlay'>
                            <div className="titleBox" >
                                <h4 style={{ color: '#fdf77e'}}>{this.getSummary({...this.state.mostPopular[3]}.title, 50)}</h4>
                            </div>
                            <div className="descBox">
                                <p style={{color:"white", padding:0,}}>{this.getSummary({...this.state.mostPopular[3]}.desc, 70)}...</p>
                                <p style={{color: "grey", padding:0}}>Continue Reading...</p>
                            </div>
                        </div>
                    </div>
                  </Link>
                </div>
            </div> 
        </div>
      </div>
        <Category title="News From Our School" setChanged={this.setCategory} category={this.state.category} popularWritings={this.state.popularWritings}/>
          <h2 className="categoryTitle">
            {this.state.category === "" ? "Latest Posts": this.state.category}
          </h2>
        <Card posts={this.state.posts} />
          <div className="Pagination">
            <a href="/Latest">See all latest posts</a>
          </div>
      </>
    )
  }
}
export default Boarding;