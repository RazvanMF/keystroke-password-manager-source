import AddAccountForm from "./AddAccountForm.mjs";
import ModifyAccountForm from "./ModifyAccountForm.mjs";

export default function HandlerAccountForm(props) {
    if (props.formStateRef.current === 0) {
        return <AddAccountForm userID={props.userID} token={props.token}
                               statusErr={props.statusErr} setStatusErr={props.setStatusErr}
                               navigate={props.navigate}
                               backendConnectionRef={props.backendConnectionRef} internetConnectionRef={props.internetConnectionRef}
                               setMemory={props.setMemory} memory={props.memory}/>
    }
    else {
        return <ModifyAccountForm userID={props.userID} token={props.token}
                                  statusErr={props.statusErr} setStatusErr={props.setStatusErr}
                                  navigate={props.navigate}
                                  backendConnectionRef={props.backendConnectionRef} internetConnectionRef={props.internetConnectionRef}
                                  setMemory={props.setMemory} memory={props.memory}/>
    }
}