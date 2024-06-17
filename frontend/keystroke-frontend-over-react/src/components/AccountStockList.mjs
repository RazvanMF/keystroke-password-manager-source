import axios from "axios";
import "../styles/AccountStockList.css";
import "../styles/styleconstants.css";
import DeleteAccountFunctionality from "../functions/DeleteAccountFunctionality.mjs";
import TransferModifyDataToForm from "../functions/TransferModifyDataToForm.mjs";
function AccountStockList(props) {
    props.memory.forEach(entry => console.log(entry.ID))
    const accounts = props.memory.map((entry, index) =>
        <li id={index}>
            <div className={`account-entry --bordered-${entry.creationtype}`}>
                <div className={`text-element --${entry.creationtype} --medium`}>SERVICE: {entry.service}</div>
                <div className={`text-element --${entry.creationtype} --medium`}>EMAIL: {entry.email}</div>
                <div className={`text-element --${entry.creationtype} --medium`}>USERNAME: {entry.username}</div>
                <div className={`text-element --${entry.creationtype} --medium`}>PASSWORD: {entry.password}</div>
                <div className={"button-bar"}>
                    <button className={"red-button"} onClick={() => {DeleteAccountFunctionality(entry.ID, props.userID, props.token, props.setStatusErr,
                        props.navigate, props.backendConnectionRef, props.internetConnectionRef, props.memory, props.setMemory)}}>DELETE</button>
                    <button className={`${entry.creationtype}-button`} onClick={() => {TransferModifyDataToForm(entry.ID, entry.service, entry.email, entry.username, entry.password, props.setFormState)}}>MODIFY</button>
                </div>
            </div>
        </li>
    );
    return (
        <>
        {accounts}
        </>
    );
}

export default AccountStockList;