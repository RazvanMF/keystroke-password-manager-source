import axios from "axios";
import {useNavigate} from "react-router-dom";

function HandleAdd(userID, token, setStatusErr, navigate) {
    let newService = document.getElementById("addService").value;
    let newEmail = document.getElementById("addEmail").value;
    let newUsername = document.getElementById("addUsername").value;
    let newPassword = document.getElementById("addPassword").value;

    axios.get("https://localhost:7013/api/users/validate/" + token)
        .then(response => {
            if (userID === response.data.id) {
                axios.post("https://localhost:7013/api/accounts", {service: newService, email: newEmail, username: newUsername, password: newPassword, userid: userID})
                    .then()
            }
            else {
                sessionStorage.removeItem("token");
                setStatusErr("TOKEN AUTHORIZATION FAILURE");
                navigate("/denied", {replace: true});
            }
        });
}

function AddAccountForm(props) {
    console.log(props.userID)
    return (
        <>
            <div className={"text-element --medium --orange --bordered-orange"}>SERVICE</div>
            <input id={"addService"} className={"input-orange"} type={"text"}></input>
            <div className={"text-element --medium --orange --bordered-orange"}>EMAIL</div>
            <input id={"addEmail"} className={"input-orange"} type={"text"}></input>
            <div className={"text-element --medium --orange --bordered-orange"}>USERNAME</div>
            <input id={"addUsername"} className={"input-orange"} type={"text"}></input>
            <div className={"text-element --medium --orange --bordered-orange"}>PASSWORD</div>
            <input id={"addPassword"} className={"input-orange"} type={"text"}></input>
            <button className={"orange-button"} onClick={() => {HandleAdd(props.userID, props.token, props.setStatusErr, props.navigate)}}>ADD ACCOUNT</button>
        </>
    );
}

export default AddAccountForm;