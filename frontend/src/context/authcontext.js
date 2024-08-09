import { createContext, useEffect, useState } from "react";
import axios from "axios";


export const AuthContext = createContext();


export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    try {
      const res = await axios.post(
        "http://localhost:8800/api/auth/login",
        inputs,
        {
          withCredentials: true,
        }
      );
      
      setCurrentUser(res.data);
     
    } catch (error) {
      if(error.response.status){
       throw(error);
        
      }
    }
  };




const logout = async () => {
  try {
  
    await axios.post("http://localhost:8800/api/auth/logout", null, {
      withCredentials: true,
    });
    setCurrentUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("activeIcon"); 
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};