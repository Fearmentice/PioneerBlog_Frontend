import React from "react"
import './footer.css'
import { AiFillTwitterCircle, AiFillYoutube } from "react-icons/ai"
import { RiInstagramFill } from "react-icons/ri"

export const Footer = () => {
  return (
    <>
      <footer className='boxItems'>
        <div className='container flex'>
          <div/>
          <div className='social'>
            <a href="https://www.instagram.com/pioneergenerations/" target="_blank" rel="noopener noreferrer">
              <RiInstagramFill className='icon' style={{width: 30, height: 30}} color="#000000" />
            </a>
            <a href="https://twitter.com/PioneerGenerat1" target="_blank" rel="noopener noreferrer">
              <AiFillTwitterCircle className='icon' style={{width: 30, height: 30}} color="#000000" />
            </a>
            <a href="https://www.youtube.com/channel/UCH4cKVes_phoCxAc6WH-zUA" target="_blank" rel="noopener noreferrer">
              <AiFillYoutube className='icon' style={{width: 30, height: 30}} color="#000000" />
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
