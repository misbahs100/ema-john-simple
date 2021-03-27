
import { useContext, useState } from 'react';
import { UserContext } from "../../App";
import { useHistory, useLocation } from "react-router";
import { createUserWithEmailAndPassword, handleFBSignIn, handleGHSignIn, handleGoogleSignIn, handleGoogleSignOut, signInWithEmailAndPassword } from './loginManager';



function Login() {
  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    error: '',
    photo: ''
  });
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  
  const handleOnBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);

    }
    if (e.target.name === 'password') {
      const isPasswordLength = e.target.value.length > 6;
      const isPasswordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordLength && isPasswordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
      console.log(isFieldValid)
    }

  }

  const googleSignIn = () => {
    handleGoogleSignIn()
    .then(res => {
      handleResponse(res, true);
    })
  }

  const fbSignIn = () => {
    handleFBSignIn()
    .then(res => {
      handleResponse(res, true);
    })
  }

  const ghSignIn = () => {
    handleGHSignIn()
    .then(res => {
      handleResponse(res, true);
    })
  }

  const googleSignOut = () => {
    handleGoogleSignOut()
    .then(res => {
      handleResponse(res, false);
    })
  }

  const handleSubmit = (e) => {
    console.log(user.email, user.password)
    if (newUser && user.email && user.password) {
      createUserWithEmailAndPassword(user.name, user.email, user.password)
      .then(res => {
        handleResponse(res, true);
      })
    }
    if (!newUser && user.email && user.password) {
      signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        handleResponse(res, true);
      })
    }

    e.preventDefault();
  }

  const handleResponse = (res, redirect) => {
    setUser(res);
      setLoggedInUser(res);
      if(redirect){
        history.replace(from);
      }
  }

  

  return (
    <div style={{textAlign: 'center'}}>
      {user.isSignedIn
        ? <button onClick={googleSignOut}>Sign Out with Google</button>
        : <button onClick={googleSignIn}>Sign In with Google</button>
      }
      <button onClick={fbSignIn}>Sign in with Facebook</button>
      <button onClick={ghSignIn}>Sign in with Github</button>
      {
        user.isSignedIn && <div>
          <p>Name: {user.name}</p>
          <p>email: {user.email}</p>
          {/* <img className="App-logo" src={user.photo} alt=""/> */}
        </div>
      }

      
      <br />
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser">New User Registration</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input type="text" name="name" onBlur={handleOnBlur} placeholder="Your name" />}
        <br />
        <input type="email" name="email" onBlur={handleOnBlur} placeholder="Your email" required />
        <br />
        <input type="password" name="password" onBlur={handleOnBlur} placeholder="Your password" required />
        <br />
        <input type="submit" value={newUser ? "Sign up" : "Sign in"} />
      </form>
      <p style={{ color: 'red' }}>{user.error}</p>
      {
        user.success && <p style={{ color: 'green' }}>User {newUser ? 'signed up' : 'signed in'} successfull</p>
      }

    </div>
  );
}

export default Login;
