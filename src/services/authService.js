import axios from 'axios';
import { setAuthorizationToken } from '../helpers/setAuthorizationToken';

const login = (email, password) => {
    return axios.post("https://pioneerblog-api.onrender.com/blogposts/users/login", { email, password })
        .then(user => {
            //eğer kullanıcı bulunursa (user.data.status = true) 
            if (user.data.status) {
                const { token } = user.data;
                localStorage.setItem("jwtToken", token);
                setAuthorizationToken(token);
            }
            return user.data;
        })
        .catch(err => console.log(err));
}

const logout = () => {
    localStorage.removeItem("jwtToken");
    setAuthorizationToken(false);
}

export default { login, logout };