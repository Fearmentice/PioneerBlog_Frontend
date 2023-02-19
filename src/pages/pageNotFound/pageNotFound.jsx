import React, { Component } from 'react'
import './pageNotFound.css'
import notFound from '../../assets/images/not-Found.gif'

export default class PageNotFound extends Component {

    componentDidMount(){
        console.log("merhab")
    }

    render() {
        return(
            <div className='page'>
            <div className="notFound">
                <h4>Oops... :)</h4>
                <img src={notFound} alt='Not found gif.'/>
                <h5>You've found a page that doesn't exist.</h5>
                <h6>Breathe in, on the out breathe go back and try again. </h6>
            </div>
        </div>
        )
    }
}