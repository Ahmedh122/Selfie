import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
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

export default Login; 