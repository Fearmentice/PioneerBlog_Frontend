import React, {useCallback, useEffect, useState} from "react"
import "./category.css"
import { category } from "../../assets/data/data"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick"
import { GrFormPrevious } from "react-icons/gr"
import { MdNavigateNext } from "react-icons/md"
import { Card } from "../blog/Card"
import { currentCategory } from "../../assets/data/data"
import { RiWindyFill } from "react-icons/ri"
import { Link, useHistory } from "react-router-dom"
import axios from "axios"
import { popperUnstyledClasses } from "@mui/base"
import { flexbox } from "@mui/system"

const SampleNextArrow = (props) => {
  const { onClick } = props
  return (
    <div className='control-btn' onClick={onClick}>
      <button className='next'>
        <MdNavigateNext className='icon' />
      </button>
    </div>
  )
}
const SamplePrevArrow = (props) => {
  const { onClick } = props
  return (
    <div className='control-btn' onClick={onClick}>
      <button className='prev'>
        <GrFormPrevious className='icon' />
      </button>
    </div>
  )
}


export const Category = (props) => {

  const [popularWritings, setPopularWritings] = useState([]);

  useEffect(() => {
    getCategory("Culture");
    getCategory("Technology");
    getCategory("World");
    getCategory("Sport");
    getCategory("History");
    getCategory("News");
    getCategory("Health");
    // console.log(popularWritings.length);
    //setPopularWritings([...popularWritings, {name:"Talha", surname:"Şahin"}])
    console.log(popularWritings);
  }, [popularWritings]);

  const getCategory = async(_Category) => {
    const query = "limit=1&sort=-views";
    await axios.get(`https://pioneerblog-api.onrender.com/blogposts/category/${_Category}?${query}`).then(_response =>{
    console.log(_response)
    const _Response = _response.data.doc[0];
    if(_Response){
      popularWritings.push(_Response);
    }
  })
   .catch(error => {
     console.log(error)
   });
   //setPopularWritings([...popularWritings, _Response]);
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  }

  const navigateToCategory = (_category) => {
    useHistory().push(`/${_category}`);
  }


  return (
    <>
      <section className='category'>
        <div className='content'>
          <h1 style={{marginBottom:20}}>Popular Writings</h1>
          <Slider {...settings}>
            {popularWritings.map((item) => (
              <div className='boxs'>
                <Link to={`/details/${item._id}`}>
                  <div className='box' onClick={() => props.setChanged(item.category)} key={item.id} >
                      <img src={`https://pioneerblog-api.onrender.com/blogposts/image/` + item.imageCover} alt='' />
                      <div className='overlay'>
                        <div className="titleBox" >
                          <h4>{item.title}</h4>
                        </div>
                        <div className="descBox">
                          <p>{item.desc.slice(0,100)}</p>
                        </div>
                        <Link to={`/${item.category}`}>
                          <div className="categoryButton">
                            <p style={{ justifySelf: "flex-end", color:"black"}}>{item.category}</p>
                          </div>
                        </Link>
                      </div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </>
  )
}
