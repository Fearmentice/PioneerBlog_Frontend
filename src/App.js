import React from "react"
import { Footer } from "./components/footer/Footer"
import { Header } from "./components/header/Header"
import Home from "./pages/home/Home"
import Login from "./pages/login/Login"
import { Regsiter } from "./pages/login/Regsiter"
import { BrowserRouter as Router, Switch, Route, useParams, useHistory } from "react-router-dom"
import { DetailsPages } from "./pages/details/DetailsPages"
import { Account } from "./pages/account/Account"
import { Contact } from "./components/contact/contact"
import { Create } from "./components/create/Create"
import { About } from "./pages/about/about"
import { PrivateRoute } from "./pages/login/privateRoute"

const App = () => {
  return (
    <>
      <Router>
        <Header />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/about' component={About} />
          <Route exact path='/admin/login' component={Login} />
          <PrivateRoute exact path='/admin/create' component={Create} />
          <Route exact path='/details/:id' component={DetailsPages} />
          <Route exact path='/contact' component={Contact} />
          <Route exact path='/:category' component={Home} />
        </Switch>
        <Footer />
      </Router>
    </>
  )
}
export default App
