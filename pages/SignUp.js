import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";
import { setDoc, doc, addDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import useFetchTodos from "../hooks/fetchUserData";

function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(true);
  const { signup, currentUser, Error } = useAuth();
  const push = () => {
    router.push("/");
  };

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
    } else if (name.length === 0) {
      setError("Name is required");
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

  const register = async () => {
    try {
      if (check(email, password)) {
        console.log("GGGGGG");
        await signup(name, email, password).then(() => push());
      }
    } catch (error) {
      setIsError(true);
    }
  };
  return (
    <div>
      <div className="container">
        <div className="heading">
          <h1>SIGN-UP PAGE</h1>
          <h3>{Error ? Error : ""}</h3>
          <h3>{error}</h3>
        </div>
        <div className="signinform">
          <div className="input">
            <input
              type={"text"}
              placeholder={"Enter Name"}
              required
              onChange={(e) => setName(e.target.value)}
            />
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
          <button onClick={register}>Sign Up</button>
        </div>
        <div className="navigate">
          <Link href={"/"} className={"link"}>
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
export default SignUp;
