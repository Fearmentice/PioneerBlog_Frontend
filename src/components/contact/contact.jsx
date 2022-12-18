import React from "react"
import "./contact.css"
import { Link } from "react-router-dom"

export const Contact = () => {

  return (
    <>
      <section className='contact'>
        <p>Contact Infos:</p>
        <div style={{display: "flex", flexDirection:"row"}}>
            <p style={{marginLeft:40 ,textTransform:"unset"}} >Email: </p>
            <a href="mailto:pioneersgenerations@gmail.com">
                <p style={{marginLeft: 10, textTransform:"unset", color:"black"}}>pioneersgenerations@gmail.com</p>
            </a>
        </div>
        <p style={{marginLeft:40}} >Phone: </p>
      </section>
    </>
  )
}
