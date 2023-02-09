import React from "react"
import { Component } from "react"
import { Card } from "../../components/blog/Card"
import './Home.css'
import { Category } from "../../components/category/Category"
import { db } from "../../firebase-config";
import { DownOutlined } from '@ant-design/icons';
import {collection, getDocs, startAfter, query, where, orderBy, limit} from "firebase/firestore";




class Home extends Component{
  constructor(props) {
    super(props)

    this.state = {
      category: "",
      posts: [],
      user: {},
      firstPost: {},
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
    //console.log(this.state.category);
    if(this.state.category){
      this.fetchPostsByCategory();
    }else{
      this.fetchposts();
    }
  }

  fetchposts = async() => {
    //Blogpost ref.
    const blogpostsRef = collection(db, 'blogposts');

    //Query.
    const queryRef = query(blogpostsRef,  
      where("active", "==", true) , 
      orderBy("publishDate", "desc"),
      limit(this.state.pageSize));
    const docSnap = await getDocs(queryRef);
    let _posts = [];
    docSnap.forEach((doc) => {
      _posts.push({...doc.data(), id:doc.id });
    })
    this.setState({posts: _posts});
    this.setState({lastPost: docSnap.docs[docSnap.docs.length - 1]});
    
  }

  fetchPostsByCategory = async() => {
    //Blogpost reference.
    const blogpostsRef = collection(db, "blogposts");
    try {
       // Query.
      const q = query(blogpostsRef,
        where("active", '==', true),
        where("category", "==", `${this.state.category}`,
        limit(this.state.pageSize)));

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

  // onPrevious = async() => {
  //       //Blogpost ref.
  //       const blogpostsRef = collection(db, 'blogposts');

  //       const lastVisible = this.state.firstPost;
  //       console.log(lastVisible);

  //       //Query.
  //       const queryRef = query(blogpostsRef,  
  //         where("active", "==", true) , 
  //         orderBy("publishDate", "desc"), 
  //         endBefore(lastVisible?lastVisible:0),
  //         limitToLast(this.state.pageSize));
  //       const docSnap = await getDocs(queryRef);
  //       let _posts = [];
  //       docSnap.forEach((doc) => {
  //         _posts.push({...doc.data(), id:doc.id });
  //       });
  //       //Check if there is next page.
  //       if (_posts.length === 0){
  //         return;
  //       }
  //       this.setState({posts: _posts});
  //       this.setState({lastPost: docSnap.docs[docSnap.docs.length - 1]});
  //       this.setState({firstPost: docSnap.docs[0]});
  // }

  loadMore = async() => {
        //Blogpost ref.
        const blogpostsRef = collection(db, 'blogposts');

        const lastVisible = this.state.lastPost;

        if(this.state.category != null){
          console.log("ASD");
        }
        //Query.
        const queryRef = query(blogpostsRef,  
          where("active", "==", true) , 
          orderBy("publishDate", "desc"), 
          startAfter(lastVisible?lastVisible:0),
          limit(this.state.pageSize));
        const docSnap = await getDocs(queryRef);
        let _posts = [...this.state.posts];
        docSnap.forEach((doc) => {
          _posts.push({...doc.data(), id:doc.id });
        })
        //Check if there is next page.
        if (_posts.length === 0){
          return;
        }

        this.setState({posts: _posts});
        console.log(_posts);
        this.setState({lastPost: docSnap.docs[docSnap.docs.length - 1]})
        this.setState({firstPost: docSnap.docs[0]});
  }

  loadMoreCategoryBased = async() => {
    //Blogpost ref.
    const blogpostsRef = collection(db, 'blogposts');

    const lastVisible = this.state.lastPost;

    if(this.state.category != null){
      console.log("ASD");
    }
    //Query.
    const queryRef = query(blogpostsRef,  
      where("active", "==", true) , 
      orderBy("publishDate", "desc"), 
      where("category","==",`${this.state.category}`),
      startAfter(lastVisible?lastVisible:0),
      limit(this.state.pageSize));
    const docSnap = await getDocs(queryRef);
    let _posts = [...this.state.posts];
    docSnap.forEach((doc) => {
      if(_posts.includes({...doc.data(), id:doc.id } === false)){
        _posts.push({...doc.data(), id:doc.id });
      }
    })
    //Check if there is next page.
    if (_posts.length === 0){
      return;
    }

    this.setState({posts: _posts});
    console.log(_posts);
    this.setState({lastPost: docSnap.docs[docSnap.docs.length - 1]})
    this.setState({firstPost: docSnap.docs[0]});
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
      case "Culture":
        this.setCategory("Culture");
        this.getCategoryBasedBlogposts(category);
        break;
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
      {console.log(this.state.category)}
        <Category setChanged={this.setCategory} category={this.state.category} popularWritings={this.state.popularWritings}/>
          <h1 style={{position:"inherit", marginLeft:50, padding:200, paddingBottom:0,paddingTop:0}}>
            {this.state.category === "" ? "Home": this.state.category}
          </h1>
        <Card posts={this.state.posts} />
          <div className="Pagination">
              {/* <a onClick={() => this.onPrevious()} class="previous round paginate">{'<'}</a>
              <a onClick={() => this.loadMore()} class="nextButton round paginate">{'>'}</a> */}
              <button onClick={() => this.state.category ?this.loadMoreCategoryBased() : this.loadMore()}>Load More</button>
              <DownOutlined/>
          </div>
      </>
    )
  }
}


export default Home;
