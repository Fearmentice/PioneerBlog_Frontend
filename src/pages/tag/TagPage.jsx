import React, { Component } from "react";
import './tagPage.css'
import Principle from '../../assets/images/Tag/Abdulkerim-Ersan.jpg'
import cordinator from '../../assets/images/Tag/muhammedcicek.jpeg'
import generalEditor from '../../assets/images/Tag/TahsinKerimPolat.jpg'
import developer from '../../assets/images/Tag/TalhaSahin.jpg'
import historyEditor from '../../assets/images/Tag/OmerFarukKoser.jpg'
import techEditor from '../../assets/images/Tag/FehmiBerkaySelmanoğlu.jpg'
import newsEditor from '../../assets/images/Tag/YavuzSelimKaya.jpg'
import worldEditor from '../../assets/images/Tag/YusaEr.jpg'
import healthEditor from '../../assets/images/Tag/OmerLutfiTopaloglu.jpg'
import sportEditor from '../../assets/images/Tag/MuhammedErenDuran.jpg'
import designer1 from '../../assets/images/Tag/HuseyinBilal.jpeg'
import designer2 from '../../assets/images/Tag/SefaOzyurt.jpeg'
import designer3 from '../../assets/images/Tag/ÖmerFarukMaraşli.jpg'

const authors = [
    {
        name: 'Ömer Faruk Koşer',
        title: 'History Editor',
        image: historyEditor
    },
    {
        name: 'Fehmi Berkay Selmanoğlu',
        title: 'Technology Editor',
        image: techEditor
    },
    {
        name: 'Muhammed Eren Duran',
        title: 'Sport Editor',
        image: sportEditor
    },
    {
        name: 'Ömer Lütfi Topaloğlu',
        title: 'Health Editor',
        image: healthEditor
    },
    {
        name: 'Yuşa Er',
        title: 'World Editor',
        image: worldEditor
    },
    {
        name: 'Yavuz Selim Kaya',
        title: 'News Editor',
        image: newsEditor
    },
]

export const TagPage = () => {
        return(
            <div className="tagPage">

                <h2>Administration</h2>

                <div className="personCard">
                    <img src={Principle} alt=''/>
                    <h3>Abdulkerim Ersan</h3>
                    <h4>School Principal</h4>
                </div>
                
                <div className="personCard">
                    <img src={cordinator} alt=''/>
                    <h3>Muhammed Çiçek</h3>
                    <h4>Coordinator</h4>
                </div>

                <div className="personCard">
                    <img src={generalEditor} alt=''/>
                    <h3>Tahsin Kerim Polat</h3>
                    <h4>General Editor</h4>
                </div>
                
                <h2>Web Design and Development</h2>

                <div className="personCard">
                    <img src={developer} alt=''/>
                    <h3>Talha Şahin</h3>
                    <h4>Developer</h4>
                </div>

                <h2>Graphic Design</h2>

                <div className="Management">
                    <div className="personCard">
                        <img src={designer3} alt=''/>
                        <h3>Ömer Faruk Maraşlı</h3>
                    </div>
                    <div className="personCard">
                        <img src={designer2} alt=''/>
                        <h3>Sefa Özyurt</h3>
                    </div>
                    <div className="personCard">
                        <img src={designer1} alt=''/>
                        <h3>Hüseyin Bilal Yitik</h3>
                    </div>
                </div>
                <h2>Editors</h2>
                <div className="container grid3">
                    {authors.map((item) => (
                        <div className="authorCard">
                            <img src={item.image} alt=''/>
                            <h3>{item.name}</h3>
                            <h4>{item.title}</h4>
                        </div>
                    ))}
                </div>
            </div>
        )
}