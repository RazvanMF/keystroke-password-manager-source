import {redirect, useNavigate} from 'react-router-dom';
import '../styles/Login.css';
import '../styles/styleconstants.css';
import axios from "axios";
import {IDLessUserDTO, User} from "../domain/User.mjs";
function Login(props) {
    let navigate = useNavigate();

    function HandleLogin() {
        if (navigator.onLine === false) {
            props.setStatusErr("SERVER LINK BROKEN");
            navigate("/denied", {replace: true});
            return;
        }

        //`https://localhost:7013/api/users/${document.getElementById("usernameCase").value}-${document.getElementById("passwordCase").value}`
        axios.get(`https://localhost:7013/api/users/login/${document.getElementById("usernameCase").value}&${document.getElementById("passwordCase").value}`, {timeout: 1000})
            .then(response => {
                if (response.status === 200) {
                    console.log("success");
                    sessionStorage.setItem("token", response.data);
                    //sessionStorage.setItem("user", `{"id": ${response.data.id}, "email": "${response.data.email}", "username": "${response.data.username}", "masterkey": "${response.data.masterKey}"}`);
                    //console.log(props.userRef.current.id + " " + props.userRef.current.email)
                    navigate("/dashboard", {replace: true});
                }
            })
            .catch(error => {
                console.log(error.code);
                switch (error.code) {
                    case "ERR_BAD_REQUEST":
                        props.setStatusErr("CREDENTIAL VALIDATION FAILURE");
                        break;
                    case "ERR_NETWORK":
                        props.setStatusErr("MAINFRAME LINK SEVERED");
                        break;
                    case "ECONNABORTED":
                        props.setStatusErr("MAINFRAME LINK SEVERED");
                        break;
                }
                navigate("/denied", {replace: true});
            });
    }

    function HandleRegister() {
        navigate("/register", {replace: true});
    }

    function HandleRecovery() {
        navigate("/recovery", {replace: true});
    }

    return (
        <>
            <div className={"main"}>
                <div className={"warning-sign"}>
                    <div className={"text-element --bigger --red --pulsating --centered"}>
                        KEEP OUT
                    </div>
                    <div className={"text-element --medium --red --pulsating --centered"}>
                        UNAUTHORIZED PERSONNEL WILL BE HELD LIABLE FOR USAGE OF THIS PROGRAM
                    </div>
                </div>
                <div className={"main-interactable-part"}>
                    <div className={"left-hand-side"}>
                        <div className={"title-text"}>
                            <div className={"text-element --biggest --orange"}>
                                KEYSTROKE
                            </div>
                            <div className={"text-element --big --orange --bordered-orange"}>
                                CREDENTIAL MANAGER
                            </div>
                        </div>
                    </div>
                    <hr className={"--vertical-orange"}></hr>
                    <div className={"right-hand-side"}>
                        <div className={"text-element --medium --orange --bordered-orange"}>USER IDENTIFIER</div>
                        <input id={"usernameCase"} className={"input-orange"} type={"text"}></input>
                        <div className={"text-element --medium --orange --bordered-orange"}>MASTER KEY</div>
                        <input id={"passwordCase"} className={"input-orange"} type={"password"}></input>
                        <button onClick={HandleLogin} className={"orange-button"}>VALIDATE</button>
                    </div>
                </div>
                <div className={"registration-restoration"}>
                    <div className={"registration"}>
                        <div className={"text-element --medium --orange"}>APPLY FOR USAGE:</div>
                        <button onClick={HandleRegister} className={"orange-button"}>REGISTER</button>
                    </div>
                    <div className={"restoration"}>
                        <div className={"text-element --medium --orange"}>RECOVER CREDENTIALS:</div>
                        <button onClick={HandleRecovery} className={"orange-button"}>RECOVERY</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;