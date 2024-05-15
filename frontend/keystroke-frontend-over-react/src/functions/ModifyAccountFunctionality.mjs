import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function ModifyAccountFunctionality(userID, token, setStatusErr, navigate) {

    const htmlBody = {};
    htmlBody.id = document.getElementById("modifyID").value;
    htmlBody.service = document.getElementById("modifyService").value;
    htmlBody.email = document.getElementById("modifyEmail").value;
    htmlBody.username = document.getElementById("modifyUsername").value;
    htmlBody.password = document.getElementById("modifyPassword").value;

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