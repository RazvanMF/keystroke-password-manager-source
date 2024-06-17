export default function TransferModifyDataToForm(ID, service, email, username, password, setFormState) {
    try {
        document.getElementById("modifyID").value = ID;
        document.getElementById("modifyService").value = service;
        document.getElementById("modifyEmail").value = email;
        document.getElementById("modifyUsername").value = username;
        document.getElementById("modifyPassword").value = password;
    }
    catch (e) {
    }
}