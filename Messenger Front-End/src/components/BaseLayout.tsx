import React, { Component } from "react";
import { createState } from "../state";
import RegisterView from './RegisterView';
import LoginView from "./LoginView";
import HomeView from "./HomeView";


class BaseLayout extends Component {

    state = createState(this);

    render() {
        return (
            <div className="centerViews">
                {this.state.currentView === "register" && <RegisterView state={this.state} />}
                {this.state.currentView === "login" && <LoginView state={this.state} />}
                {this.state.currentView === "home" && <HomeView state={this.state} />}
            </div>
        );
    }
}

export default BaseLayout;