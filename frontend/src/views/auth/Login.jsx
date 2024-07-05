import { Link, useNavigate } from 'react-router-dom';
/*import { useContext } from 'react';
import { useState } from 'react';
import { AuthContext } from '../../context/authcontext';

const Login = () => {
  const { login } = useContext(AuthContext);

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate("/");
    } catch (err) {
      setErr(err.response.data);
    }
  };
  return (
    <div className="login">
      <div className="card">
        <h1 className="welcome">Welcome!</h1>

        <form className="form">
          <input className="text" type="username" placeholder="Username" name='username'  onChange={handleChange} />

          <input className="text" type="password" placeholder="Password" name = 'password' onChange={handleChange}/>

          {err && err}
          <button className="logbutton" onClick={handleLogin}>
            Login
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/register">
            <a className="regbutton">Sign up</a>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login; */
import React from "react";

const Login = () => {
  return (
    <div
      className="login"
      class="min-w-[100vh] min-h-[100vh] bg-[#313338] flex items-center justify-center text-white"
    >
      <div class="card bg-[#232428] flex rounded-2xl max-w-3xl p-5 min-h-[80vh] shadow-2xl">
        <div class="sm:w-1/2 px-8">
          <h2 class="font-bold text-2xl text-center">SELFIE</h2>

          <form class="form flex flex-col gap-4">
            <p class="text-sm mt-4 text-slate-500">
              if you already a member, easily log in
            </p>
       
            <input
              class="p-2 mt-8  rounded-xl border"
              className="text"
              type="email"
              placeholder="email"
              name="email"
            />
            
            <input
              class="p-2 rounded-xl border"
              className="text"
              type="password"
              placeholder="Password"
              name="password"
            />
            <button class="logbutton bg-violet-800 py-2 rounded-xl ">
              Login
            </button>
          </form>
          <div class="mt-10 grid grid-cols-3 items-center text-gray-500">
            <hr class="outline-slate-500"/>
            <p class="text-center">OR</p>
            <hr class="outline-slate-500"/>
          </div>
          <p class="mb-5">
            Don't have an account?{" "}
            <Link to="/register">
              <a className="regbutton">Sign up</a>
            </Link>
          </p>
        </div>
        <div class="w-1/2 sm:block hidden ">
          <img
            class=" rounded-2xl min-h-[80vh]"
            src="https://static.vecteezy.com/system/resources/previews/003/764/663/original/selfie-flat-illustration-happy-people-making-selfie-stick-picture-together-capturing-bright-moment-group-of-friends-taking-self-photo-with-phone-isolated-cartoon-character-on-grey-background-vector.jpg"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
