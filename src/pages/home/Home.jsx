import React from "react"
import { Card } from "../../components/blog/Card.js"
import { Category } from "../../components/category/Category"

export const Home = () => {
  return (
    <>
      {/*  <Slider />*/}
      <Category />
      <Card />
    </>
  )
}
