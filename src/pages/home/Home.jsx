import React from "react"
import { Component } from "react"
import { Card } from "../../components/blog/Card"
import './Home.css'
import { Category } from "../../components/category/Category"
import { db } from "../../firebase-config";
import { DownOutlined } from '@ant-design/icons';
import {collection, getDocs, startAfter, endBefore, query, where, orderBy, limit, limitToLast} from "firebase/firestore";




class Home extends Component{
  constructor(props) {
    super(props)

    this.state = {
      category: "",
      posts: [],
      user: {},
      firstPost: {},
      lastPost: {},
      pageSize: 9
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
        if (_posts.length == 0){
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
    if (_posts.length == 0){
      return;
    }

    this.setState({posts: _posts});
    console.log(_posts);
    this.setState({lastPost: docSnap.docs[docSnap.docs.length - 1]})
    this.setState({firstPost: docSnap.docs[0]});
}

  updateCategory = async() => {
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

  componentDidMount(){
    //this.fetchposts();
    this.updateCategory();
  }


  render(){
    return(
      <>
        <Category setChanged={this.setCategory}/>
          <h1 style={{position:"inherit", marginLeft:50}}>
            {this.state.category === "" ? "Home": this.state.category}
          </h1>
        <Card category={this.state.category} posts={this.state.posts} />
          <div className="Pagination">
              {/* <a onClick={() => this.onPrevious()} class="previous round paginate">{'<'}</a>
              <a onClick={() => this.loadMore()} class="nextButton round paginate">{'>'}</a> */}
              <a onClick={() => this.state.category ?this.loadMoreCategoryBased() : this.loadMore()}>Load More</a>
              <DownOutlined/>
          </div>
      </>
    )
  }
}


export default Home;
