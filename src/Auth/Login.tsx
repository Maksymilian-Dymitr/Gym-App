import Input from "../Input";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useState } from "react";
import {useNavigate} from "react-router-dom"

const Login= () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handelGoogleOauth2Login = () => {
    
  };
  //credentails is a jwt
  
  const handelLogout = () => {
    
  }

  return (
    <div className="fixed w-full h-full bg-[#282c33] flex justify-center items-center">
      <div
        className="bg-gray-700 rounded-2xl p-5 text-white flex flex-col justify-center
        items-center"
      >
        <h1 className="text-center font-bold text-5xl">GYM APP</h1>
        <Input setFunc={setEmail} nameValue="Email" type="text"></Input>
        <Input setFunc={setPassword} nameValue="Password" type="text"></Input>
        <button className="bg-green-700 rounded-xl px-3 py-2 font-bold  mt-3">
          Login
        </button>

        <GoogleLogin
          onSuccess={handelGoogleOauth2Login}
          onError={() => console.log("Login failed")}
        />
      </div>
    </div>
  );
};

export default Login;
