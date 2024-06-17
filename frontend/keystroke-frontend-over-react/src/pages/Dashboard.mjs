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
import {HubConnectionBuilder, HubConnectionState, LogLevel} from "@microsoft/signalr";
import LoadOfflineChanges from "../functions/LoadOfflineChanges.mjs";
import RetrievePasswordFromBackend from "../functions/RetrievePasswordFromBackend.mjs";

import {ConnectionSingleton} from "../domain/ConnectionSingleton.mjs";

function Dashboard(props) {
    const [formState, setFormState, formStateRef] = useState(0);
    const [backendConnection, setBackendConnection, backendConnectionRef] = useState(false);
    const [internetConnection, setInternetConnection, internetConnectionRef] = useState(true);
    const [offlineID, setOfflineID, offlineIDRef] = useState(0);
    let navigate = useNavigate();

    const delay = ms => new Promise(res => setTimeout(res, ms));

    let connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7013/ping")
        .configureLogging(LogLevel.Information)
        .build();

    function HandleEndingSession() {
        props.setUser({});
        props.setMemory([]);
        sessionStorage.removeItem("token");
        connection.stop()
            .then(response => {
                navigate("/", {replace: true});
            });
    }

    function HandleStatistics() {
        // props.setUser({});
        // props.setMemory([]);
        navigate("/statistics", {replace: true});
    }

    useEffect(() => {
            const token = sessionStorage.getItem("token");
            // if ((token == null || token === "") && window.location.href.includes("dashboard")) {
            //     props.setUser({});
            //     props.setStatusErr("TOKEN AUTHORIZATION FAILURE");
            //     navigate("/denied", {replace: true});
            //     return () => {
            //     };
            // }

            sessionStorage.setItem("offlineCache", "");
            sessionStorage.setItem("offlineCacheID", "0");

            axios.get("https://localhost:7013/api/users/validate/" + token)
                .then(response => {
                    props.setUser(new User(response.data.id, response.data.email, response.data.username, response.data.masterKey));
                })
                .catch(error => {
                    if (window.location.href.includes("dashboard") && typeof window !== 'undefined') {
                        console.log(error.data);
                        props.setUser({});
                        props.setMemory([]);
                        props.setStatusErr("TOKEN AUTHORIZATION FAILURE");
                        navigate("/denied", {replace: true});
                    }
                });

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
                                new Account(entry.id, entry.service, entry.email, entry.username, entry.password, "orange")));
                            props.setMemory(information);
                        });
                }
                else {
                    if (window.location.href.includes("dashboard") && typeof window !== 'undefined') {
                        props.setUser({});
                        props.setMemory([]);
                        props.setStatusErr("TOKEN AUTHORIZATION FAILURE");
                        navigate("/denied", {replace: true});
                    }
                }
            }

            async function start() {
                if (internetConnectionRef.current === true && typeof window !== 'undefined') {
                    try {
                        await connection.start();
                        setBackendConnection(true);
                        if (backendConnectionRef.current === true && internetConnectionRef.current === true) {
                            await firstFetch();
                            await LoadOfflineChanges(props.userRef.current.ID, sessionStorage.getItem("token"));
                        }
                        console.log("SignalR Connected.");
                    } catch (err) {
                        console.log(err);
                        setBackendConnection(false);
                        setTimeout(start, 5000);
                    }
                } else {
                    console.log("NO INTERNET CONNECTION");
                }
            }

            connection.on("ReceiveMessage", (data) => {
                console.log("data: ", data);
            });

            connection.on("InvokeGETRequest", (data) => {
                if (backendConnectionRef.current === true && internetConnectionRef.current === true)
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
        //}
    }, [navigator.onLine]);

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
                                            statusErr={props.statusErr} setStatusErr={props.setStatusErr} navigate={navigate}
                                            backendConnectionRef={backendConnectionRef} internetConnectionRef={internetConnectionRef}
                                            memory={props.memory} setMemory={props.setMemory}/>
                    </div>

                    <div className={"account-display-container"}>
                        <div className={"bottom-margined text-element --big --orange --bordered-orange"}>ACCOUNTS</div>
                        <ul className={"account-display-list"}>
                            <AccountStockList memory={props.memory} setMemory={props.setMemory} userID={props.userRef.current.ID}
                                              token={sessionStorage.getItem("token")} setStatusErr={props.setStatusErr} navigate={navigate}
                                              setFormState={setFormState}
                                              backendConnectionRef={backendConnectionRef} internetConnectionRef={internetConnectionRef}/>
                        </ul>
                    </div>

                    <div className={"routing-buttons"}>
                        <button onClick={HandleStatistics} className={"orange-button"}>CHECK STATISTICS</button>
                        <button className={"orange-button"}>CHECK BREACHES</button>
                        <button className={"orange-button"}>PREPARE SECURITY REPORT</button>
                        <button onClick={RetrievePasswordFromBackend} className={"orange-button"}>GENERATE PASSWORD</button>
                        <button onClick={HandleEndingSession} className={"red-button"}>END SESSION</button>
                        <div className={"text-element --orange --medium --at-end"}>CONSOLE:</div>
                        <div id={"console"} className={"ua-console"}></div>
                    </div>

                </div>

            </div>
        </>
    );
}

export default Dashboard;