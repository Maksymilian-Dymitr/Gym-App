import Input from "./Componets/Input";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useState } from "react";
import {useNavigate} from "react-router-dom"
import Login from "./Auth/Login";

const Fitness = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handelGoogleOauth2Login = () => {
    
  };
  //credentails is a jwt
  
  const handelLogout = () => {
    
  }

  return (
    <div className="fixed w-full h-full bg-[#282c33] flex justify-center items-center">
      
      <Login/>
        
    </div>
  );
};

export default Fitness;
