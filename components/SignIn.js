import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, currentUser, Error, setEror } = useAuth();
  console.log(currentUser);

  const validateUserEmail = (text) => {
    const reg =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
  };

  function check(email, password) {
    if (email.length === 0 || password.length === 0) {
      setError("Email and Password both are Required");
      return false;
    } else if (!validateUserEmail(email)) {
      setError("Invalid Email Address");
      return false;
    } else if (password.length < 8) {
      setError("Password Must Be 8 characters Long");
      return false;
    } else {
      setError("");
      return true;
    }
  }
  const signIn = async () => {
    try {
      const promise = new Promise((resolve, reject) => {
        resolve(login(email, password));
      });
      if (check(email, password)) {
        await promise.then(() => {
          setEror("");
        });
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  return (
    <div>
      <div className="container">
        <div className="heading">
          <h1>LOG-IN PAGE</h1>
          {/* <h3 className="Error">{error ? error : ""}</h3> */}
          <h3 className="Error">{Error ? Error : ""}</h3>
        </div>
        <div className="signinform">
          <div className="input">
            <input
              type={"text"}
              placeholder={"Enter Email"}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type={"password"}
              placeholder={"Enter Password"}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={signIn}>Login</button>
        </div>
        <div className="navigate">
          <Link href={"/SignUp"} className={"link"}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
