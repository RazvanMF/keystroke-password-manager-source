import '../styles/Denied.css';
import '../styles/styleconstants.css';
import {redirect, useNavigate} from 'react-router-dom';

function Denied(props) {
    let navigate = useNavigate();
    function HandleOperationAttempt() {
        props.setStatusErr("");
        navigate("/", {replace: true});
    }

    return (
        <>
            <div className={"mainDenied"}>
                <div className={".text-element --bigger --red --bordered-red --extrapadded"}>
                    ACCESS DENIED
                </div>
                <div className={".text-element --bigger --red --blinking"}>
                    {props.statusErr}
                </div>
                <button className={"red-button"} onClick={HandleOperationAttempt}>REATTEMPT OPERATION</button>
            </div>
        </>
    );
}

export default Denied;