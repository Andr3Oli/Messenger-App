import React from "react";

const LoginView = ({ state }: any) => {
    return (
        <div className="App">
            <header className="header-Chat">
                <div className="header-left" />
                <div className="header-center" style={{ marginLeft: "2.5%" }}>
                    <h1 className="header-Title">MECKASSENGER</h1>
                </div>
                <div className="header-right">
                    <button className="header-Logout-button" onClick={state.showRegisterView}>Sign In</button>
                </div>
            </header>
            <div className="App-header">
                <div className="wrap-login">
                    <div className="login-form-title">
                        Login
                    </div>
                    <form onSubmit={state.handleSubmit} noValidate>
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
                        <input className="confirm-Button" type="submit" value="Log in" />
                        <br />
                    </form>
                    <a href="#" onClick={state.showRegisterView}>Don´t have an account?</a>
                </div>
            </div>
        </div>
    );
}

export default LoginView;