import React from "react";
import { Link } from "react-router-dom";
import '../../pages/details/details.css'
import defaultUserImage from '../../assets/images/defaultUser.jpg'

export const AuthorCard = (props) => {
    const {authorId, profilePhoto, name, description} = props;

    //Gets the description of the post and returns slices description.
    const getSummaryDesc = () => {
        const desc = `${description}`;
        return desc.slice(3,60);
    }

    return(
        <>
            <Link to={`/authors/${authorId}`}>
                <div className="authorCard">
                    <img src={profilePhoto ? profilePhoto : defaultUserImage} alt='Profile.'/>
                    <div className="commentContent">
                        <b >{name}</b>
                        <p style={{fontSize:12, width: 250}}>{getSummaryDesc()}...</p>
                    </div>
                </div>
            </Link>
        </>
    )
}