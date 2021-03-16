import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useContext, useState } from 'react';
import { UserContext } from "../../App";
import { useHistory, useLocation } from "react-router";

// firebase.initializeApp(firebaseConfig);
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}



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

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const ghProvider = new firebase.auth.GithubAuthProvider();
  const handleGoogleSignIn = () => {
    firebase.auth().signInWithPopup(googleProvider)
      .then(res => {
        const { displayName, email, photoURL } = res.user;
        const signedUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedUser);
        console.log(displayName, email, photoURL);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const handleGoogleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signedUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
          error: '',
          success: false
        }
        setUser(signedUser);
      })
      .catch(err => {
        console.log(err);
      })
  }
  const handleFBSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(fbProvider)
      .then((result) => {
        var user = result.user;
        setUser(user)
        console.log(user);
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.log(errorCode, errorMessage, email, credential);
      });
  }
  const handleGHSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(ghProvider)
      .then((result) => {
        var user = result.user;
        setUser(user);
        console.log(user);
      }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.log(errorCode, errorMessage, email, credential);
      });
  }

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

  const handleSubmit = (e) => {
    console.log(user.email, user.password)
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          // Signed in 
          console.log(res.user);
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          setLoggedInUser(newUserInfo);
          console.log("who: ", user.name)
          updateUserName(user.name);
          // ...
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
          console.log(error.code, error.message)
          // ..
        });
    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          console.log(res.user);
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          setLoggedInUser(newUserInfo);
          history.replace(from);
          console.log("sign in user info: ", res.user)
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
          console.log(error.code, error.message)
        });
    }

    e.preventDefault();
  }

  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
    }).then(function () {
      console.log('user name updated successfully.')
    }).catch(function (error) {
      console.log(error);
    });
  }

  return (
    <div style={{textAlign: 'center'}}>
      {user.isSignedIn
        ? <button onClick={handleGoogleSignOut}>Sign Out with Google</button>
        : <button onClick={handleGoogleSignIn}>Sign In with Google</button>
      }
      <button onClick={handleFBSignIn}>Sign in with Facebook</button>
      <button onClick={handleGHSignIn}>Sign in with Github</button>
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
