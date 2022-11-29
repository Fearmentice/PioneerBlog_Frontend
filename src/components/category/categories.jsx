import React from "react"
import { Component } from "react"
import { Card } from "../blog/Card"
import { Category } from "./Category"

export class Categories extends Component{
  constructor(props) {
    super(props)

    this.state = {
      category: "",
      changed: false
    }
    this.setChange = this.setChanged.bind(this);
  }

  setChanged(_category) {
    this.setState({ category: _category });
    console.log(_category);
  }

  render(){
    return(
      <>
      <Category setChanged={this.setChange}/>
      <Card category={this.state.category} />
      </>
    )
  }
}
