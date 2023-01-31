import React,{useState} from "react"
import "./header.css"
import { nav } from "../../assets/data/data"
import { Link } from "react-router-dom"
import { useEffect } from "react"
import { db } from "../../firebase-config";
import {getDoc, doc, } from "firebase/firestore";

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
            <h1 style={{textTransform:"capitalize"}}>{user.role === "admin" ? "Admin" : ""}</h1>
          </div>
        </div>
      </header>
    </>
  )
}
