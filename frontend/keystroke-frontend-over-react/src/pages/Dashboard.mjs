import {useNavigate} from "react-router-dom";
import "../styles/Dashboard.css";
import "../styles/styleconstants.css";
import RedRibbon from "../components/RedRibbon.mjs";
import {useEffect} from "react";
import AccountStockList from "../components/AccountStockList.mjs";
import {Account} from "../domain/Account.mjs"
import axios from "axios";
import {User} from "../domain/User.mjs";
import AddAccountForm from "../components/AddAccountForm.mjs";
import useState from "react-usestateref";
import HandlerAccountForm from "../components/HandlerAccountForm.mjs";
import {HubConnectionBuilder, LogLevel} from "@microsoft/signalr";

function Dashboard(props) {
    const [formState, setFormState, formStateRef] = useState(0);
    const [backendConnection, setBackendConnection, backendConnectionRef] = useState(false);
    const [internetConnection, setInternetConnection, internetConnectionRef] = useState(true);
    let navigate = useNavigate();

    function HandleEndingSession() {
        props.setUser({});
        props.setMemory([]);
        sessionStorage.removeItem("token");
        navigate("/", {replace: true});
    }

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token == null || token === "") {
            props.setUser({});
            props.setStatusErr("TOKEN AUTHORIZATION FAILURE");
            navigate("/denied", {replace: true});
            return () => {};
        }

        axios.get("https://localhost:7013/api/users/validate/" + token)
            .then(response => {
                props.setUser(new User(response.data.id, response.data.email, response.data.username, response.data.masterKey));
            })
            .catch(error => {
                console.log(error.data);
                props.setUser({});
                props.setMemory([]);
                props.setStatusErr("TOKEN AUTHORIZATION FAILURE");
                navigate("/denied", {replace: true});
            });

        const connection = new HubConnectionBuilder()
            .withUrl("https://localhost:7013/ping")
            .configureLogging(LogLevel.Information)
            .build();

        const getInternetConnection = () => {
            setInternetConnection(navigator.onLine);
        }

        async function firstFetch() {
            const information = [];
            let retrievedID = -1;
            await axios.get("https://localhost:7013/api/users/validate/" + token)
                .then(response => {
                    retrievedID = response.data.id;
                });
            if (retrievedID === props.userRef.current.ID) {
                await axios.get("https://localhost:7013/api/accounts/foruser/" + props.userRef.current.ID)
                    .then(response => {
                        response.data.forEach(entry => information.push(
                            new Account(entry.id, entry.service, entry.email, entry.username, entry.password)));
                        props.setMemory(information);
                    });
            }
            else {
                props.setUser({});
                props.setMemory([]);
                props.setStatusErr("TOKEN AUTHORIZATION FAILURE");
                navigate("/denied", {replace: true});
            }
        }

        async function start() {
            if (internetConnectionRef.current === true) {
                try {
                    await connection.start();
                    setBackendConnection(true);
                    await firstFetch();
                    console.log("SignalR Connected.");
                } catch (err) {
                    console.log(err);
                    setBackendConnection(false);
                    setTimeout(start, 5000);
                }
            }
            else {
                console.log("NO INTERNET CONNECTION");
            }
        }

        connection.on("ReceiveMessage", (data) => {
            console.log("data: ", data);
        });

        connection.on("InvokeGETRequest", (data) => {
           firstFetch();
        });

        connection.onclose(async () => {
            setBackendConnection(false);
            await start();
        });

        window.addEventListener("load", getInternetConnection);
        window.addEventListener("online", () => {
            getInternetConnection();
            if (internetConnectionRef.current === true)
                start();
        });
        window.addEventListener("offline", () => {
            getInternetConnection();
            if (internetConnectionRef.current === false)
                connection.stop();
        });

        start();

        //cleanup
        return (() => {
            window.removeEventListener("load", getInternetConnection);
            window.removeEventListener("online", getInternetConnection);
            window.removeEventListener("offline", getInternetConnection);
        });

    }, [navigator.onLine], 100);

    return (
        <>
            <div className={"main-dashboard"}>

                <div className={"header-app"}>
                    <div className={"text-element --bigger --orange --bordered-orange title"}>KEYSTROKE</div>
                    <div className={"status-bar"}>
                        <RedRibbon/>
                        <div className={"status-carousel"}>
                            <div className={"scroller"}>
                                <div className={`text-element --big --${backendConnection === true ? "orange" : "red"}`}>
                                    {backendConnection === true ? "MAINFRAME LINK STATUS: ESTABLISHED" : "MAINFRAME LINK STATUS: SEVERED"}
                                </div>
                                <div className={`text-element --big --${internetConnection === true ? "orange" : "red"}`}>
                                    {internetConnection === true ? "MAGI SERVER CONNECTION STATUS: STABLE" : "MAGI SERVER CONNECTION STATUS: REJECTED"}
                                </div>
                            </div>
                        </div>
                        <RedRibbon/>
                    </div>
                </div>

                <div className={"logged-info text-element --medium --orange"}>LOGGED IN AS: {props.user.username}</div>

                <div className={"interface"}>

                    <div className={"add-account-form"}>
                        <div className={"modifiers-button-bar"}>
                            <button className={"orange-button"} onClick={() => {setFormState(0); console.log("add")}}>ADD</button>
                            <button className={"orange-button"} onClick={() => {setFormState(1); console.log("modify")}}>MODIFY</button>
                        </div>
                        <HandlerAccountForm formStateRef={formStateRef} userID={props.userRef.current.ID} token={sessionStorage.getItem("token")}
                                            statusErr={props.statusErr} setStatusErr={props.setStatusErr} navigate={navigate}/>
                    </div>

                    <div className={"account-display-container"}>
                        <div className={"bottom-margined text-element --big --orange --bordered-orange"}>ACCOUNTS</div>
                        <ul className={"account-display-list"}>
                            <AccountStockList memory={props.memory} userID={props.userRef.current.ID}
                                              token={sessionStorage.getItem("token")} setStatusErr={props.setStatusErr} navigate={navigate}/>
                        </ul>
                    </div>

                    <div className={"routing-buttons"}>
                        <button className={"orange-button"}>GENERIC BUTTON 1</button>
                        <button className={"orange-button"}>GENERIC BUTTON 2</button>
                        <button className={"orange-button"}>GENERIC BUTTON 3</button>
                        <button className={"orange-button"}>GENERIC BUTTON 4</button>
                        <button onClick={HandleEndingSession} className={"red-button"}>END SESSION</button>
                    </div>

                </div>

            </div>
        </>
    );
}

export default Dashboard;