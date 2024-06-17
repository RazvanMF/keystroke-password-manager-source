import {useNavigate} from "react-router-dom";
import "../styles/styleconstants.css";
import "../styles/Statistics.css";
import {useEffect} from "react";
import axios from "axios";
import useState from "react-usestateref";
import {Chart} from "react-google-charts";

export default function Statistics() {
    let navigate = useNavigate();

    function HandleReturn() {
        navigate("/dashboard", {replace: true});
    }

    const [passwordData, setPasswordData] = useState([]);
    const [usernameData, setUsernameData] = useState([]);
    const [emailData, setEmailData] = useState([]);
    let pd = [["Strength", "No. Passwords"]];
    let ed = [["Emails", "No. Times Used"]];
    let ud = [["Usernames", "No. Times Used"]];

    axios.get("https://localhost:7013/api/users/validate/" + sessionStorage.getItem("token"))
        .then(result => {
            axios.get("https://localhost:7013/api/systems/stats/forpassword/" + result.data.id)
                .then(response => {
                    let localData = [];
                    for (const key in response.data) {
                        pd.push([key, response.data[key]]);
                    }
                    //setPasswordData(localData);
                })
            axios.get("https://localhost:7013/api/systems/stats/foremail/" + result.data.id)
                .then(response => {
                    let localData = [];
                    for (const key in response.data) {
                        ed.push([key, response.data[key]]);
                    }
                    //setEmailData(localData);
                })
            axios.get("https://localhost:7013/api/systems/stats/forusername/" + result.data.id)
                .then(response => {
                    let localData = [];
                    for (const key in response.data) {
                        ud.push([key, response.data[key]]);
                    }
                    //setUsernameData(localData);
                })
        });

    const options = {
        //slices: {0: {color: "#ffffff"}},
        backgroundColor: { fill:'transparent' },
        color: "#ffaa00ff",
        hAxis: {
            textStyle: {
                color: '#ffffff',
                fontName: 'Arial Narrow'
            }
        },
        vAxis: {
            textStyle: {
                color: '#ffffff',
                fontName: 'Arial Narrow'
            }
        },
        legend: {
            textStyle: {
                color: '#ffffff',
                fontName: 'Arial Narrow'
            }
        },
        titleTextStyle: {
            color: '#ffffff',
            fontName: 'Arial Narrow'
        }
    };

    return (
        <>
            <div className={"text-element --orange --bigger --bordered-orange"}>USER STATISTICS</div>
            <div className={"main-statistics"}>
                <div className={"password-statistics --bordered-orange"}>
                    <div className={"text-element --orange --medium"}>PASSWORD STRENGTH</div>
                    <Chart
                        chartType="PieChart"
                        data={pd}
                        options={options}
                        width={"100%"}
                        height={"100%"}
                    />
                </div>
                <div className={"email-statistics --bordered-orange"}>
                    <div className={"text-element --orange --medium"}>EMAIL USAGE</div>
                    <Chart
                        chartType="PieChart"
                        data={ed}
                        options={options}
                        width={"100%"}
                        height={"100%"}
                    />
                </div>
                <div className={"username-statistics --bordered-orange"}>
                <div className={"text-element --orange --medium"}>USERNAME USAGE</div>
                    <Chart
                        chartType="PieChart"
                        data={ud}
                        options={options}
                        width={"100%"}
                        height={"100%"}
                    />
                </div>
            </div>
            <button onClick={HandleReturn} className={"orange-button"}>GO BACK</button>
        </>
    );
}