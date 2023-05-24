import {useState, createContext} from "react"

export const UserContext = createContext();

export const UserProvider = props => {
    const [token, setToken] = useState()
    const [loggedIn, setLoggedIn] = useState()
    const [user , setUser] = useState()

    return (
        <UserContext.Provider
            value={{
            token,
            setToken,
            loggedIn,
            setLoggedIn,
            user,
            setUser
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
};