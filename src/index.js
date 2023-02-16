import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import { setAuthorizationToken } from "./helpers/setAuthorizationToken"


//redux config 
import { Provider } from "react-redux";
import store from './helpers/store';


const jwtToken = localStorage.getItem("jwtToken");
if (jwtToken) {
  setAuthorizationToken(jwtToken);
}

const root = createRoot(document.getElementById("root"))
root.render(
  <Provider store={store}><App /></Provider>
)
