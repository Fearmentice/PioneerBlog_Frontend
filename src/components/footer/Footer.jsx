import React from "react"
import { Link } from "react-router-dom"
import { AiFillTwitterCircle, AiFillLinkedin, AiFillYoutube } from "react-icons/ai"
import { BsFacebook } from "react-icons/bs"
import { RiInstagramFill } from "react-icons/ri"

export const Footer = () => {
  return (
    <>
      <footer className='boxItems'>
        <div className='container flex'>
          <div/>
          <div className='social'>
            <a href="https://www.instagram.com/pioneergenerations/">
              <RiInstagramFill className='icon' style={{width: 30, height: 30}} color="#000000" />
            </a>
            <a href="https://twitter.com/PioneerGenerat1">
              <AiFillTwitterCircle className='icon' style={{width: 30, height: 30}} color="#000000" />
            </a>
            <a href="https://www.youtube.com/channel/UCH4cKVes_phoCxAc6WH-zUA">
              <AiFillYoutube className='icon' style={{width: 30, height: 30}} color="#000000" />
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
