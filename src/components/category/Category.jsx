import React from "react"
import "./category.css"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick"
import { GrFormPrevious } from "react-icons/gr"
import { MdNavigateNext } from "react-icons/md"
import { Link } from "react-router-dom"

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

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
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



  return (
    <>
      <section className='category'>
        <div className='content'>
          <h1 style={{marginBottom:20}}>Popular Writings</h1>
          <Slider {...settings}>
            {props.popularWritings.map((item) => (
              <div className='boxs'>
                <Link to={`/details/${item.id}`}>
                  <div className='box' onClick={() => props.setChanged(item.category)} key={item.id} >
                    <div className="imgContainer">
                      <img src={item.imageCover} alt='' />
                      </div>
                      <div className='overlay'>
                        <div className="titleBox" >
                          <h4>{item.title.length >= 40 ? `${item.title.slice(0, 37)}...` : item.title}</h4>
                        </div>
                        <div className="descBox">
                          <p>{item.desc.slice(0,100).replace('&nbsp;', ' ')}</p>
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
