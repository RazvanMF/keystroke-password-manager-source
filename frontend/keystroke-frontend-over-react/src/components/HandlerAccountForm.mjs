import AddAccountForm from "./AddAccountForm.mjs";
import ModifyAccountForm from "./ModifyAccountForm.mjs";

export default function HandlerAccountForm(props) {
    if (props.formStateRef.current === 0) {
        return <AddAccountForm userID={props.userID} token={props.token}
                               statusErr={props.statusErr} setStatusErr={props.setStatusErr}
                               navigate={props.navigate}/>
    }
    else {
        return <ModifyAccountForm userID={props.userID} token={props.token}
                                  statusErr={props.statusErr} setStatusErr={props.setStatusErr}
                                  navigate={props.navigate}/>
    }
}