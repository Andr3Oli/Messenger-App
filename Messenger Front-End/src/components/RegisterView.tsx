import React from "react";

const RegisterView = ({ state }: any) => {

  return (
    <div className="App">
      <header className="header-Chat">
        <div className="header-left" />
        <div className="header-center" style={{ marginLeft: "2.5%" }}>
          <h1 className="header-Title">MECKASSENGER</h1>
        </div>
        <div className="header-right">
          <button className="header-Logout-button" onClick={state.showLoginView}>Login</button>
        </div>
      </header>
      <div className="App-header">
        <div className="wrap-login">
          <div className="login-form-title">
            Register
          </div>
          <form onSubmit={state.handleSubmit} noValidate>
            <div className="black">
              Name<br />
              <input type="text" name="name" value={state.name} onChange={state.testName} /><br />
              {<span style={{ color: "red" }}>{state.errName}</span>}
            </div>
            <div className="black">
              Email<br />
              <input type="text" name="email" value={state.email} onChange={state.testEmail} /><br />
              {<span style={{ color: "red" }}>{state.errEmail}</span>}
            </div>
            <div className="black">
              Password<br />
              <input type="password" name="password" value={state.password} onChange={state.testPass} /><br />
              {<span style={{ color: "red" }}>{state.errPass}</span>}
            </div>
            <div className="black">
              Password Confirmation<br />
              <input type="password" name="passwordConfirmation" value={state.passwordConfirmation} onChange={state.testPassConfirmation} /><br />
              {<span style={{ color: "red" }}>{state.errPassConfirmation}</span>}
            </div>
            <input className="confirm-Button" type="submit" value="Sign Up" />
            <br />
          </form>
          <a href="#" onClick={state.showLoginView}>Already have an account?</a>
        </div>
      </div>
    </div>
  );
}

export default RegisterView;