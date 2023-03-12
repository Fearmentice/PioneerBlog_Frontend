import React from "react";
import { Helmet } from "react-helmet";

export const SeoSocialMedia = (props) => {
    const {description, canonical, title, url, image} = props;

    return (
        <Helmet>
            <meta name="description" content={description}/>
            <link rel="canonical" href={canonical} />

            <meta property="og:title" content={title} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />

            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={`Learn about ${title}`} />
            <meta name="twitter:image" content={image} />
      </Helmet>
    )
}