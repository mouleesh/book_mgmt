import React, { Component, Fragment } from "react";
import { Redirect } from 'react-router-dom';
import { Growl } from 'primereact/growl';
import { growlData, APIserverURL } from "../../constant";
import './login.css';
import Axios from "axios";

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginDetails: [],
            username: null,
            isValueEntered: false,
            redirectToReferrer: false
        };
        this.password = React.createRef();
        this.username = React.createRef();
    }

    componentDidMount() {
        //this state property on the location will be set only when we are redirecting from the logout button click. 
        if(this.props.location.state && this.props.location.state.showLogoutThankGrowl){
            this.growl.show(growlData.thanks);
        }
    }

    getUserDetails = (userName = '') => {
        return Axios.get(APIserverURL.loginAPI+'?username=' + userName);
    }

    userNameCheck = (username) => {
        this.getUserDetails(username).then((response) => {
            this.setUserDetails(response.data[0]);
        }).catch((err) => {
            this.growl.show(this.growlData.requestFailed)
        });
    }

    formSubmit = (event) => {
        const { keyCode, type } = event;
        event.preventDefault();
        const password = this.password.current.value;
        this.setIsValueEntered();
        const { username, loginDetails } = this.state;

        if (keyCode === 13 || type === "click") {
            const loginInfo = this.checkPasswordAndGetLogInInfo(username, password, loginDetails);
            if (loginInfo) {
                localStorage.setItem('username', loginInfo.username);
                this.setState({ redirectToReferrer: true });
            } else {
                this.growl.show(growlData.loginError);
            }
        }
    }

    checkPasswordAndGetLogInInfo = (username, password, loginDetails) => {
        if (username && password.length > 0) {

            const isLoggedIn = (loginDetails.password === password);
            const loginInfo = {
                username: username,
                isLoggedIn: isLoggedIn
            };
            return loginInfo;
        } else {
            return false;
        }
    }

    setUserDetails(userLoginDetails) {
        (userLoginDetails) ?
            this.setState(
                {
                    username: userLoginDetails.username,
                    loginDetails: userLoginDetails
                }) :
            this.setIsValueEntered();

    }

    getCheckClass() {
        let checkClass = "check-hidden";
        if (this.state.username) {
            checkClass = "check-visible";
        }
        return checkClass;
    }

    setIsValueEntered = () => {
        if (this.username.current.value.length > 0 && this.password.current.value.length > 0) {
            this.setState({
                isValueEntered: true
            })
        } else {
            this.setState({
                isValueEntered: false
            })
        }
    }

    render() {
        let manageBtnIcon = "btn btn-login btn-cursor-";
        manageBtnIcon = this.state.isValueEntered ? manageBtnIcon += 'pointer' : manageBtnIcon += 'not-allowed';

        const { redirectToReferrer } = this.state;

        if (redirectToReferrer) {
            return <Redirect to={{
                pathname: '/dashboard',
                state: { showLoginSuccessGrowl: true }
            }} />;
        }

        return (
            <Fragment>
                <Growl ref={el => { this.growl = el }} />
                <section className="login-block">
                    <div className="container login-container">
                        <div className="row">
                            <div className="col-md-4 login-sec">
                                <h2 className="text-center">Login Now</h2>
                                <form className="login-form">
                                    <div className="form-group">
                                        <label className="badge badge-primary" htmlFor="username">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            placeholder=""
                                            ref={this.username}
                                            onBlur={(input) => { this.userNameCheck(this.username.current.value) }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="badge badge-primary" htmlFor="password">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            placeholder=""
                                            ref={this.password}
                                            onKeyUp={this.formSubmit}
                                        />
                                    </div>
                                    <div className="form-check">
                                        <label className="form-check-label">
                                            <input type="checkbox" className="form-check-input" />
                                            <small>Remember Me (beta) </small>
                                        </label>
                                        <button id="submit-btn" type="submit" disabled={!this.state.isValueEntered} className={manageBtnIcon} onClick={this.formSubmit}>Login</button>
                                    </div>
                                </form>
                            </div>
                            <div className="col-md-8 banner-sec"></div>
                        </div>
                    </div>
                </section>
            </Fragment>
        )
    }
}
