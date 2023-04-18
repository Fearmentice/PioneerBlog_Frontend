import React from "react";
 
export const Verify = (props) => {
    const {handleChange, verifyInput, verifyAccount} = props;

    return(
        <form onSubmit={verifyAccount}>
            <span>Verify *</span>
            <p>* Please provide the code that we have sent your email.</p>
            <br/>
            <input type='text' value={verifyInput}  onChange={(e) => handleChange(e)} name={"verifyInput"} required />
            <button style={{color:"white"}} className='button' >Verify</button>
        </form>
    )
}