import React, { StrictMode, useState, createContext } from "react"
import './index.css'
import { Footer } from "./components/footer/Footer"
import { Header } from "./components/header/Header"
import Home from "./pages/home/Home"
import Login from "./pages/login/Login"
import SignUp from "./pages/signUp/signUp.jsx"
import { userPage } from "./pages/user/userPage"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { DetailsPages } from "./pages/details/DetailsPages"
import { Contact } from "./components/contact/contact"
import { Create } from "./components/create/Create"
import { Edit } from "./components/edit/Edit"
import { About } from "./pages/about/about"
import { PrivateRoute } from "./pages/login/privateRoute"
import { Account } from "./pages/account/Account"
import { createAuthor } from "./pages/author/create/createAuthor"
import { editAuthor } from "./pages/author/edit/editAuthor"
import { bookmarks } from "./components/bookmarks/bookmarks"
import { useEffect } from "react"


export const ThemeContext = createContext(null);

const App = () => {
  const [theme, setTheme] = useState(false);

  useEffect(() => {
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    let savedTheme = localStorage.getItem("theme");
    if (savedTheme === null) {
      savedTheme = darkThemeMq.matches
      savedTheme = savedTheme.toString();
    };

    if (savedTheme === 'false') {
      // Theme set to light.
      setTheme(false)
    } else if (savedTheme === 'true') {
      // Theme set to dark.
      setTheme(true)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === true ? false : true;
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  return (
    <StrictMode>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className="App" id={theme === true ? 'light' : 'dark'}>
          <Router>
            <Header />
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/Home' component={Home} />
            </Switch>
            <Switch>
              <Route exact path='/about' component={About} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/signup' component={SignUp} />
              <PrivateRoute exact path='/admin/blogpost/create' component={Create} />
              <PrivateRoute exact path='/admin/blogpost/edit/:id' component={Edit} />
              <PrivateRoute exact path='/admin/author/create' component={createAuthor} />
              <PrivateRoute exact path='/admin/author/edit' component={editAuthor} />
              <Route exact path='/myaccount' component={Account} />
              <Route exact path='/myBookmarks' component={bookmarks} />
              <Route exact path='/authors/:id' component={userPage} />
              <Route exact path='/details/:id' component={DetailsPages} />
              <Route exact path='/contact' component={Contact} />
              <Route exact path='/:category' component={Home} />
            </Switch>
            <Footer />
          </Router>
        </div>
      </ThemeContext.Provider >
    </StrictMode>
  )
}
export default App


