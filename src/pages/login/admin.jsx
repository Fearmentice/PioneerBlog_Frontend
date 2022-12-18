import React, {useState, useCallback} from "react"
import { Login } from "./Login"
import { Create } from "../../components/create/Create"

export const Admin = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean);

    const changeIsLoggedIn = useCallback((_isLoggedIn) => {
        setIsLoggedIn(_isLoggedIn);
        console.log("Asd");
      }, [isLoggedIn]);

    if(isLoggedIn){
        return(<Create/>);
    }
    else{
        return(<Login setIsLoggedIn={changeIsLoggedIn}/>);
    }
}
