import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import './popularPosts.css'

//--API--
import { fetchPosts } from "../../Api/blogpostController";

export const PopularPosts = (props) => {
    const [popularPosts, setPopularPosts] = useState([]);
    const pageSize = 5;

    useEffect(() => {
        getPopularPosts();
    }, [])

    //Gets 5 the most viewed posts.
    const getPopularPosts = async() => {
        const { posts } = await fetchPosts('publishDate', 'desc', pageSize, null);
        setPopularPosts(posts);
        console.log(posts);
    }

    return(
        <>
            <div className="cardItems">
            <div className="card">
              <h2 >Latest Releases</h2>
            </div>
            {popularPosts.map((item) => (
               <Link to={`/details/${item.id}`} className="link">
                 <div className="box boxItems" onClick={() => this.setId(item.id)} >
                   <img style={{objectFit:"cover"}} alt="Thumbnails of the writings." className="boxImage" src={item.imageCover}/>
                   <div className="postInfo">
                     <div >
                       <b>{item.title}</b>
                     </div>
                     <div >
                       <p >{item.desc.slice(0, 70).replace('&nbsp;', " ")}</p>
                     </div>
                   </div>
                 </div>
               </Link>
             ))}
            </div>
            </>
    )
} 