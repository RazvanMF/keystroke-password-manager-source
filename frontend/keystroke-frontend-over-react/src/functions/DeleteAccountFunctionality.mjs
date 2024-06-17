import axios from "axios";

export default function DeleteAccountFunctionality(accountID, userID, token, setStatusErr, navigate, backendConnectionRef, internetConnectionRef, memory, setMemory) {
    if (backendConnectionRef.current === true && internetConnectionRef.current === true) {
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
    else {
        let mem = sessionStorage.getItem("offlineCache");
        let entry = `{"command":"delete", "id":${accountID}},`;
        sessionStorage.setItem("offlineCache", mem + entry);

        setMemory(memory.filter(element => element.ID !== accountID));
    }
}

