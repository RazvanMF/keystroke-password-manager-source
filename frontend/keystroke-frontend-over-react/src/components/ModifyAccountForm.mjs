import ModifyAccountFunctionality from "../functions/ModifyAccountFunctionality.mjs";

function ModifyAccountForm(props) {
    return (
        <>
            <div className={"text-element --medium --red --bordered-red"}>ACCOUNT IDENTIFIER</div>
            <input id={"modifyID"} className={"input-red"} type={"text"} disabled></input>
            <div className={"text-element --medium --orange --bordered-orange"}>SERVICE</div>
            <input id={"modifyService"} className={"input-orange"} type={"text"}></input>
            <div className={"text-element --medium --orange --bordered-orange"}>EMAIL</div>
            <input id={"modifyEmail"} className={"input-orange"} type={"text"}></input>
            <div className={"text-element --medium --orange --bordered-orange"}>USERNAME</div>
            <input id={"modifyUsername"} className={"input-orange"} type={"text"}></input>
            <div className={"text-element --medium --orange --bordered-orange"}>PASSWORD</div>
            <input id={"modifyPassword"} className={"input-orange"} type={"text"}></input>
            <button className={"orange-button"} onClick={() => ModifyAccountFunctionality(props.userID, props.token, props.setStatusErr, props.navigate, props.backendConnectionRef, props.internetConnectionRef, props.memory, props.setMemory)}>MODIFY ACCOUNT</button>
        </>
    );
}

export default ModifyAccountForm