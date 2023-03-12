import React,{useState} from "react"
import "./header.css"
import { nav } from "../../assets/data/data"
import { Link} from "react-router-dom"
import { User } from './User';
import { useEffect } from "react"
import { DownOutlined } from '@ant-design/icons';
import { Dropdown } from "antd"

import { DarkModeSwitch } from 'react-toggle-dark-mode';

import lightLogo from '../../assets/images/lightLogo.svg'
import darkLogo from '../../assets/images/darkLogo.svg'

import { useContext } from "react";
import { ThemeContext } from "../../App";

import { getAuth } from "../../helpers/getAuthorizationToken";

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
        <p onClick={() => window.location.replace('/Health')} target="_blank" rel="noopener noreferrer">
          Health
        </p>
    ),
  },
  {
    key: '6',
    label:  (
        <p onClick={() => window.location.replace('/Sport')} target="_blank" rel="noopener noreferrer">
          Sport
        </p>
    ),
  },
];

export const Header = () => {
  const [user, setUser ] = useState({});
  const themeContext = useContext(ThemeContext);

   window.addEventListener("scroll", function () {
    const header = this.document.querySelector(".header")
    header.classList.toggle("active", this.window.scrollY > 100)
  }) 

  //Cheks if logged in if it is gets the user information.
  useEffect(() => {
    isAdmin();
  }, [])
  const isAdmin = async() => {
    setUser(await getAuth())
  }

  const detectMob = () => {
    return window.innerWidth <= 768
  }

  return (
    <>
      <header className='header'>
        <div className='scontainer flex'>
          <div className='logo'>
            <button onClick={() => window.location.replace('/')}>
              <img src={localStorage.getItem("theme") === "true" ? darkLogo : lightLogo} alt={'Logo of the website.'} width='175px' />
              </button>
          </div>
          {detectMob() ?
          <nav>
            <ul>
              <li style={{paddingBottom:0, paddingTop:0, textTransform:"capitalize"}} key={nav[0].id}>
                  <a href={nav[0].url}>
                    {nav[0].text}
                  </a>
              </li>
                <Dropdown className="dropdown" menu={{items,}}>
                    <a href="/" className="categoriesTitle" onClick={(e) => e.preventDefault()}>
                        Categories
                        <DownOutlined style={{marginLeft:5}} />
                    </a>
                </Dropdown>
                <li style={{paddingBottom:0, paddingTop:0, textTransform:"capitalize"}} key={nav[0].id}>
                  <a href={nav[6].url}>
                    {nav[6].text}
                  </a>
              </li>
            </ul>
          </nav>
          :
          <nav>
            <ul>
              {nav.map((link) => (
                <li key={link.id}>
                  <a href={`${link.url}`}>{link.text}</a>
                </li>
              ))}
            </ul>
          </nav>
}
          <div className='account flexCenter'>

            {user == null ?
              <>
              <div className="notLoggedIn">
                <div className="loginSignup">
                  <li style={{fontSize:20, paddingBottom:0, paddingTop:0, textTransform:"capitalize"}}>
                    <Link to={"/login"}>
                    <a href="/login">Login</a>
                    </Link>
                  </li>
                  <li style={{fontSize:20, padding:10, paddingBottom:0, paddingTop:0, textTransform:"capitalize"}}>
                    <Link to={"/signup"}>
                    <a href="/signup">Sign Up</a>
                    </Link>
                  </li>
                </div>
                <DarkModeSwitch
                className="darkModeToggleButton"
                checked={themeContext.theme}
                onChange={() => themeContext.toggleTheme()}
                size={40}
                />
                </div>
            </>
            :<>
            <div className="notLoggedIn">
            <User/>
            <DarkModeSwitch
              className="darkModeToggleButton"
              style={{marginBottom: 7, marginLeft: 15}}
              checked={themeContext.theme}
              onChange={() => themeContext.toggleTheme()}
              size={40}
            />
            </div>
            </>}
          </div>
        </div>
      </header>
    </>
  )
}
