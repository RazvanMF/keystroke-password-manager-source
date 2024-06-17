import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Account} from "../domain/Account.mjs";

function HandleAdd(userID, token, setStatusErr, navigate, backendConnectionRef, internetConnectionRef, memory, setMemory) {
    let newService = document.getElementById("addService").value;
    let newEmail = document.getElementById("addEmail").value;
    let newUsername = document.getElementById("addUsername").value;
    let newPassword = document.getElementById("addPassword").value;

    if (backendConnectionRef.current === true && internetConnectionRef.current === true) {
        axios.get("https://localhost:7013/api/users/validate/" + token)
            .then(response => {
                if (userID === response.data.id) {
                    axios.post("https://localhost:7013/api/accounts", {
                        service: newService,
                        email: newEmail,
                        username: newUsername,
                        password: newPassword,
                        userid: userID
                    })
                        .then()
                } else {
                    if (typeof window !== 'undefined') {
                        sessionStorage.removeItem("token");
                        setStatusErr("TOKEN AUTHORIZATION FAILURE");
                        navigate("/denied", {replace: true});
                    }
                }
            });
    }
    else {
        let id = parseInt(sessionStorage.getItem("offlineCacheID"));
        let mem = sessionStorage.getItem("offlineCache");
        let entry = `{"command":"add", "service":"${newService}", "email":"${newEmail}", "username":"${newUsername}", "password":"${newPassword}"},`;
        sessionStorage.setItem("offlineCache", mem + entry);

        setMemory([
            ...memory,
            new Account(id, newService, newEmail, newUsername, newPassword, "red")
        ]);

        sessionStorage.setItem("offlineCacheID", (id - 1).toString());
    }
}

function AddAccountForm(props) {
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
            <button className={"orange-button"} onClick={() => {HandleAdd(props.userID, props.token, props.setStatusErr, props.navigate,
                props.backendConnectionRef, props.internetConnectionRef, props.memory, props.setMemory)}}>ADD ACCOUNT</button>
        </>
    );
}

export default AddAccountForm;