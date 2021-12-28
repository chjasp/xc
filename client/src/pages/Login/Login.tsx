import "./Login.css";
import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";

/*
Handle user login
*/
const Login: React.FC = (props) => {
  // Reference mail and pw inputs to use them as login arguments
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Constants directly supporting "handleSubmit" execution
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Retrieve login functionality
  const { login } = useAuth();
  // Redirect user after login
  const history = useHistory();

  /*
  - Check if mail and pw values set
  - Perform login
  - Redirect to personal Sensors-page
  */
  async function handleSubmit(e: any) {
    // Prevent form from refreshing (default HTML-behavior)
    e.preventDefault();

    try {
      setError("")
      setLoading(true);
      // ?.-syntax (see following) not compatible with Internet Explorer
      if (passwordRef?.current?.value && emailRef?.current?.value) {
        await login(emailRef.current.value, passwordRef.current.value);
        history.push("/Sensors");
      }
    } catch {
      setError("Failed to log in");
    }
    setLoading(false);
  }

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-inner">
          <h2>Login</h2>
          {error && <div>{error}</div>}
          <div className="form-group">
            <label htmlFor="email">E-Mail:</label>
            <input type="text" id="email" ref={emailRef} required></input>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              ref={passwordRef}
              required
            ></input>
          </div>
          <input type="submit" disabled={loading} value="Login" />
        </div>
      </form>
    </div>
  );
};

export default Login;
