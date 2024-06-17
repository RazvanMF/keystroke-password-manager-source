import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Account} from "../domain/Account.mjs";

export default function ModifyAccountFunctionality(userID, token, setStatusErr, navigate, backendConnectionRef, internetConnectionRef, memory, setMemory) {

    const htmlBody = {};
    htmlBody.id = document.getElementById("modifyID").value;
    htmlBody.service = document.getElementById("modifyService").value;
    htmlBody.email = document.getElementById("modifyEmail").value;
    htmlBody.username = document.getElementById("modifyUsername").value;
    htmlBody.password = document.getElementById("modifyPassword").value;

    if (backendConnectionRef.current === true && internetConnectionRef.current === true) {
        axios.get("https://localhost:7013/api/users/validate/" + token)
            .then(response => {
                if (userID === response.data.id) {
                    axios.put("https://localhost:7013/api/accounts/" + htmlBody.id, htmlBody)
                        .then();
                }
                else {
                    sessionStorage.removeItem("token");
                    setStatusErr("TOKEN AUTHORIZATION FAILURE");
                    navigate("/denied", {replace: true});
                }
            });
    }
    else {
        let mem = sessionStorage.getItem("offlineCache");
        let entry = `{"command":"update", "id":${htmlBody.id}, "service":"${htmlBody.service}", "email":"${htmlBody.email}", "username":"${htmlBody.username}", "password":"${htmlBody.password}"},`;
        sessionStorage.setItem("offlineCache", mem + entry);

        const nextMemory = [];
        memory.forEach(element => {
            console.log(element.ID, htmlBody.id);
            if (element.ID === parseInt(htmlBody.id)) {
                nextMemory.push(new Account(element.id, htmlBody.service, htmlBody.email, htmlBody.username, htmlBody.password, "red"));
            }
            else {
                nextMemory.push(element);
            }
        })
        setMemory(nextMemory);
    }
}