import React,{useState} from "react"
import "./header.css"
import { nav } from "../../assets/data/data"
import { Link } from "react-router-dom"
import axios from "axios"
import { useEffect } from "react"

export const Header = () => {
  const [user, setUser ] = useState({});

   window.addEventListener("scroll", function () {
    const header = this.document.querySelector(".header")
    header.classList.toggle("active", this.window.scrollY > 100)
  }) 

  useEffect(() => {
    isAdmin();
  }, [user])

  const isAdmin = async() => {
    await axios.get(`http://localhost:8000/users/me`).then(response => {
      console.log(response)
      setUser(response.data)
    }).catch(error => {
      console.log(error)
    })
  }

  return (
    <>
      <header className='header'>
        <div className='scontainer flex'>
          <div className='logo'>
          </div>
          <nav>
            <ul>
              {nav.map((link) => (
                <li style={{fontSize:20, padding:10, paddingBottom:0, paddingTop:0, textTransform:"capitalize"}} key={link.id}>
                  <Link to={link.url}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className='account flexCenter'>
            {/* <User /> */}
            <h1 style={{textTransform:"capitalize"}}>{user.role === "admin" ? "Admin" : ""}</h1>
          </div>
        </div>
      </header>
    </>
  )
}
