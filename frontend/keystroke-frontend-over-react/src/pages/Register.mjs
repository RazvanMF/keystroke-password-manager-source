import '../styles/styleconstants.css';
import '../styles/Register.css';
import '../domain/User.mjs'
import axios from "axios";
import {IDLessUserDTO, User} from "../domain/User.mjs";
import {useNavigate} from "react-router-dom";

function Register(props) {
    let navigate = useNavigate();
    function HandleRegistration() {
        if (navigator.onLine === false) {
            props.setStatusErr("MAGI SERVER CONNECTION REJECTED");
            navigate("/denied", {replace: true});
            return;
        }

        let email = document.getElementById("mailInput").value;
        let username = document.getElementById("usernameInput").value;
        let masterkey = document.getElementById("masterkeyInput").value;

        let user = new IDLessUserDTO(email, username, masterkey);
        let result;
        axios.post('https://localhost:7013/api/users', user)
            .then(response => {
                result = response.data;
                console.log(result);
                navigate("/", {replace: true});
            })
            .catch(error => {
            console.log(error.code);
            switch (error.code) {
                case "ERR_BAD_REQUEST":
                    props.setStatusErr("CREDENTIAL DUPLICATION FORBIDDEN");
                    break;
                case "ERR_NETWORK":
                    props.setStatusErr("MAINFRAME LINK SEVERED");
                    break;
                case "ECONNABORTED":
                    props.setStatusErr("MAINFRAME LINK SEVERED");
                    break;
                default:
                    props.setStatusErr("FATAL CRASH");
                    console.log(error.message);
                    break;
            }
            navigate("/denied", {replace: true});
        });
    }

    function HandleReturn() {
        navigate("/", {replace: true});
    }

    return (
        <>
            <div className={"text-element --white --bigger --bordered-white --hacked-text-bg"}>END-USER REGISTRATION
                AGREEMENT
            </div>
            <div className={"main-register"}>
                <div className={"registration-body"}>
                    <div className={"terms-and-conditions"}>
                        <div className={"text-element --white --medium"}>BY COMPLETING THIS FORM, YOU FULLY AGREE WITH
                        </div>
                        <div className={"text-element --white --medium"}>LIDS' TERMS AND CONDITIONS,</div>
                        <div className={"text-element --white --medium"}>AS WELL AS THE PARENT BRANCH'S TERMS AND
                            CONDITIONS.
                        </div>
                        <div
                            className={"text-element --white"}>--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                        </div>
                        <div className={"text-element --red --medium --pulsating"}>FAILURE TO COMPLY OR BREACHING THESE
                            TERMS
                            AND CONDITIONS
                        </div>
                        <div className={"text-element --red --medium --pulsating"}>WILL LEAD TO A 100000$ FINE OR 10
                            YEARS
                            IMPRISONMENT.
                        </div>
                        <div
                            className={"text-element --white"}>--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                        </div>
                        <div className={"text-element --white --medium"}>UPON COMPLETING THIS FORM, YOU, THE END-USER,
                            SHOULD
                        </div>
                        <div className={"text-element --white --medium"}>RECEIVE AN EMAIL TO CONFIRM THE CREDENTIAL
                            GENERATION,
                        </div>
                        <div className={"text-element --white --medium"}>IF YOUR APPLICATION IS ACCEPTED.</div>
                        <button className={"white-button --hacked-upper-margin"} onClick={HandleReturn}>GO BACK</button>
                    </div>
                    <hr className={"--vertical-white"}></hr>
                    <div className={"application-form"}>
                        <div className={"text-element --orange --big --bordered-orange"}>EMAIL</div>
                        <input id={"mailInput"} className={"input-orange"}/>
                        <div className={"text-element --orange --big --bordered-orange"}>USER IDENTIFIER</div>
                        <input id={"usernameInput"} className={"input-orange"}/>
                        <div className={"text-element --red --big --bordered-red"}>MASTERKEY</div>
                        <input type={"password"} id={"masterkeyInput"} className={"input-red"}/>
                        <button className={"red-button"} onClick={HandleRegistration}>SEND APPLICATION</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;