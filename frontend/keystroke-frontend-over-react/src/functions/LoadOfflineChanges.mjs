import axios from "axios";
import {Account} from "../domain/Account.mjs";

export default async function LoadOfflineChanges(userID, token) {
    let offsideMem = sessionStorage.getItem("offlineCache");
    offsideMem = "[" + offsideMem.replace(/.$/, "]");
    let changesList = null;
    try {
        changesList = JSON.parse(offsideMem);
    } catch {
        return;
    }

    if (changesList == null)
        throw ("raaaah");

    let retrievedID = -1;
    await axios.get("https://localhost:7013/api/users/validate/" + token)
        .then(response => {
            retrievedID = response.data.id;
        });

    if (retrievedID !== userID) {
        throw ("awooooo");
    }

    for await (const entry of changesList) {
        if (entry.command === "add")
            await axios.post("https://localhost:7013/api/accounts",{
                service: entry.service,
                email: entry.email,
                username: entry.username,
                password: entry.password,
                userid: userID
            })
                .then()
                .catch(error => console.error(error.data));
        else if (entry.command === "update")
            await axios.put("https://localhost:7013/api/accounts/" + entry.id,{
                id: entry.id,
                service: entry.service,
                email: entry.email,
                username: entry.username,
                password: entry.password
            })
                .then()
                .catch(error => console.error(error.data));
        else if (entry.command === "delete")
            await axios.delete("https://localhost:7013/api/accounts/" + entry.id)
                .then()
                .catch(error => console.error(error.data));
        else
            throw ("???");
    }
    sessionStorage.setItem("offlineCache", "");

}