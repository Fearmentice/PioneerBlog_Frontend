import React from "react"
import { Footer } from "./components/footer/Footer"
import { Header } from "./components/header/Header"
import Home from "./pages/home/Home"
import Login from "./pages/login/Login"
import { SignUp } from "./pages/signUp/signUp.jsx"
import { userPage } from "./pages/user/userPage"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { DetailsPages } from "./pages/details/DetailsPages"
import { Contact } from "./components/contact/contact"
import { Create } from "./components/create/Create"
import { Edit } from "./components/edit/Edit"
import { About } from "./pages/about/about"
import { PrivateRoute } from "./pages/login/privateRoute"
import { Account } from "./pages/account/Account"
import { createAuthor } from "./pages/author/createAuthor"
import textEditor from "./components/texEditor/textEditor"

const App = () => {
  return (
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
        <PrivateRoute exact path='/admin/author/create' component={createAuthor} />
        <PrivateRoute exact path='/admin/blogpost/edit/:id' component={Edit} />
        <Route exact path='/myaccount' component={Account} />
        <Route exact path='/authors/:id' component={userPage} />
        <Route exact path='/details/:id' component={DetailsPages} />
        <Route exact path='/contact' component={Contact} />
        <Route exact path='/:category' component={Home} />
      </Switch>
      <Footer />
    </Router>
  )
}
export default App
