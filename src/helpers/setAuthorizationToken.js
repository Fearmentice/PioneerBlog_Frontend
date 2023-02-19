

export const setAuthorizationToken = (token, role) => {
    if (token === false) {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("role");
        return;
    }

    localStorage.setItem("jwtToken", token);

}