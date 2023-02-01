import React from "react"
import { Footer } from "./components/footer/Footer"
import { Header } from "./components/header/Header"
import Home from "./pages/home/Home"
import Login from "./pages/login/Login"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { DetailsPages } from "./pages/details/DetailsPages"
import { Contact } from "./components/contact/contact"
import { Create } from "./components/create/Create"
import { Edit } from "./components/edit/Edit"
import { About } from "./pages/about/about"
import { PrivateRoute } from "./pages/login/privateRoute"

const App = () => {
  return (
    //<React.StrictMode>
    <Router>
      <Header />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/Home' component={Home} />
      </Switch>
      <Switch>
        <Route exact path='/about' component={About} />
        <Route exact path='/admin/login' component={Login} />
        <PrivateRoute exact path='/admin/create' component={Create} />
        <PrivateRoute exact path='/admin/edit/:id' component={Edit} />
        <Route exact path='/details/:id' component={DetailsPages} />
        <Route exact path='/contact' component={Contact} />
        <Route exact path='/:category' component={Home} />
      </Switch>
      <Footer />
    </Router>
    //</React.StrictMode>
  )
}
export default App
