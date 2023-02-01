import React,{useState} from "react"
import "./header.css"
import { nav } from "../../assets/data/data"
import { Link} from "react-router-dom"
import { useEffect } from "react"
import { DownOutlined } from '@ant-design/icons';
import { Dropdown } from "antd"
import { db } from "../../firebase-config";
import {getDoc, doc, } from "firebase/firestore";

const items = [
  {
    key: '1',
    label: (
        <p onClick={() => window.location.replace('/Technology')} target="_blank" rel="noopener noreferrer">
          Technology
        </p>
    ),
  },
  {
    key: '2',
    label:  (
        <p onClick={() => window.location.replace('/Culture')} target="_blank" rel="noopener noreferrer">
          Culture
        </p>
    ),
  },
  {
    key: '3',
    label:  (
        <p onClick={() => window.location.replace('/World')} target="_blank" rel="noopener noreferrer">
          World
        </p>
    ),
  },
  {
    key: '4',
    label:  (
        <p onClick={() => window.location.replace('/History')} target="_blank" rel="noopener noreferrer">
          History
        </p>
    ),
  },
  {
    key: '5',
    label:  (
        <p onClick={() => window.location.replace('/Sport')} target="_blank" rel="noopener noreferrer">
          Sport
        </p>
    ),
  },
];

export const Header = () => {
  const [user, setUser ] = useState({});

   window.addEventListener("scroll", function () {
    const header = this.document.querySelector(".header")
    header.classList.toggle("active", this.window.scrollY > 100)
  }) 

  useEffect(() => {
    isAdmin();
  }, [])

  const isAdmin = async() => {
    if(!localStorage.getItem("jwtToken")) return;
    const docRef = doc(db, "users", localStorage.getItem("jwtToken"));
    const docSnap = await getDoc(docRef);
    const user = docSnap.data();
    user.role === "admin" ? setUser(user) : setUser(null); 
    console.log("User Role has been set: " + user.role)
  }

  return (
    <>
      <header className='header'>
        <div className='scontainer flex'>
          <div className='logo'>
          </div>
          <nav>
            <ul>
              <li style={{fontSize:20, padding:10, paddingBottom:0, paddingTop:0, textTransform:"capitalize"}} key={nav[0].id}>
                  <Link to={nav[0].url}>
                    {nav[0].text}
                  </Link>
              </li>
                <Dropdown  menu={{items,}}>
                    <a style={{marginTop:3}} onClick={(e) => e.preventDefault()}>
                        Categories
                        <DownOutlined style={{marginLeft:5}} />
                    </a>
                </Dropdown>
              <li style={{fontSize:20, padding:10, paddingBottom:0, paddingTop:0, textTransform:"capitalize"}} key={nav[1].id}>
                  <Link to={nav[1].url}>
                    {nav[1].text}
                  </Link>
              </li>
              <li style={{fontSize:20, padding:10, paddingBottom:0, paddingTop:0, textTransform:"capitalize"}} key={nav[2].id}>
                  <Link to={nav[2].url}>
                    {nav[2].text}
                  </Link>
              </li>
            </ul>
          </nav>
          <div className='account flexCenter'>
            <h1 style={{textTransform:"capitalize"}}>{user.role === "admin" ? "Admin" : ""}</h1>
          </div>
        </div>
      </header>
    </>
  )
}
