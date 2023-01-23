import React from "react"
import "./about.css"

export const About = () => {

  return (
    <>
      <section className='contact'>
        <p>Who we are ?</p>
        <div style={{display: "flex", flexDirection:"row", width:1250}}>
            <p style={{marginLeft:40 ,textTransform:"unset"}} >We are a group of students who try to write about right and useful informations to our dear readers. Also we are just students who want to improve himself and try to be good at writing with a excellent English language.</p>
        </div>
        <p style={{marginTop:25}}>What are our goals ?</p>
        <div style={{display: "flex", flexDirection:"row", width:1250}}>
            <p style={{marginLeft:40 ,textTransform:"unset"}} >Actually we have some different goals but the most important goal is to write the rights. Also we have chosen English for being global and be able to take comments from every nations. Another thing is give useful informations to dear readers in our personnel exposition.</p>
        </div>
        <p style={{marginTop:25}}>How can you help us ?</p>
        <div style={{display: "flex", flexDirection:"row", width:1250}}>
            <p style={{marginLeft:40 ,textTransform:"unset"}} >We want to achieve our goal like every group but we want a help in a different way. You can share our writes so we can become popular in groups. Also you can make comments so we can improve us.</p>
        </div>
      </section>
    </>
  )
}
