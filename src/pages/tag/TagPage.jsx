import React, { Component } from "react";
import './tagPage.css'
import Principle from '../../assets/images/Tag/Abdulkerim-Ersan.jpg'
import cordinator from '../../assets/images/Tag/muhammedcicek.jpg'
import generalEditor from '../../assets/images/Tag/TahsinKerimPolat.jpg'
import developer from '../../assets/images/Tag/TalhaSahin.jpeg'
import historyEditor from '../../assets/images/Tag/OmerFarukKoser.jpg'
import techEditor from '../../assets/images/Tag/FehmiBerkaySelmanoğlu.jpg'
import newsEditor from '../../assets/images/Tag/YavuzSelimKaya.jpg'
import worldEditor from '../../assets/images/Tag/YusaEr.jpg'
import healthEditor from '../../assets/images/Tag/OmerLutfiTopaloglu.jpg'
import sportEditor from '../../assets/images/Tag/MuhammedErenDuran.jpg'



export class TagPage extends Component {

    render() {
        return(
            <div className="tagPage">
                <div className="personCard">
                    <img src={developer} alt=''/>
                    <h3>Talha Şahin</h3>
                    <h4>Developer</h4>
                </div>
                <div className="personCard">
                    <img src={generalEditor} alt=''/>
                    <h3>Tahsin Kerim Polat</h3>
                    <h4>General Editor</h4>
                </div>
                <div className="Management">
                    <div className="personCard">
                        <img src={Principle} alt=''/>
                        <h3>Abdülkerim Ersan</h3>
                        <h4>School Principal</h4>
                    </div>
                    <div className="personCard">
                        <img src={cordinator} alt=''/>
                        <h3>Muhammed Çiçek</h3>
                        <h4>Coordinator</h4>
                    </div>
                </div>
                <h2>Graphic Design Team</h2>
                <div className="Management">
                    <div className="personCard">
                        <img src={historyEditor} alt=''/>
                        <h3>Sefa Özyurt</h3>
                    </div>
                    <div className="personCard">
                        <img src={historyEditor} alt=''/>
                        <h3>Hüseyin Bilal Yitik</h3>
                    </div>
                </div>
                <h2>Editors</h2>
                <div className="Management">
                    <div className="authorCard">
                        <img src={historyEditor} alt=''/>
                        <h3>Ömer Faruk Koşer</h3>
                        <h4>History Editor</h4>
                    </div>
                    <div className="authorCard">
                        <img src={techEditor} alt=''/>
                        <h3>Fehmi Berkay Selmanoğlu</h3>
                        <h4>Technology Editor</h4>
                    </div>
                    <div className="authorCard">
                        <img src={healthEditor} alt=''/>
                        <h3>Ömer Lütfi Topaloğlu</h3>
                        <h4>Health Editor</h4>
                    </div>
                    <div className="authorCard">
                        <img src={worldEditor} alt=''/>
                        <h3>Yuşa Er</h3>
                        <h4>World Editor</h4>
                    </div>
                    <div className="authorCard">
                        <img src={sportEditor} alt=''/>
                        <h3>Muhammed Eren Duran</h3>
                        <h4>Sport Editor</h4>
                    </div>
                    <div className="authorCard">
                        <img src={newsEditor} alt=''/>
                        <h3>Yavuz Selim Kaya</h3>
                        <h4>News Editor</h4>
                    </div>
                </div>
            </div>
        )
    }
}