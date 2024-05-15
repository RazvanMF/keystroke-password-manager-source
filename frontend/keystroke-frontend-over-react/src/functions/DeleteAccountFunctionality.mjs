import axios from "axios";

export default function DeleteAccountFunctionality(accountID, userID, token, setStatusErr, navigate) {
    axios.get("https://localhost:7013/api/users/validate/" + token)
        .then(response => {
            if (userID === response.data.id) {
                axios.delete("https://localhost:7013/api/accounts/" + accountID)
                    .then()
            }
            else {
                setStatusErr("TOKEN AUTHORIZATION FAILURE");
                sessionStorage.removeItem("token");
                navigate("/denied", {replace: true});
            }
        });
}

