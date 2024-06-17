import axios from "axios";

export default function RetrievePasswordFromBackend() {
    axios.get("https://localhost:7013/api/systems/sec/forpassword")
        .then(response => {
            const type = "text/plain";
            const blob = new Blob([response.data], { type });
            const data = [new ClipboardItem({ [type]: blob })];
            navigator.clipboard.write(data);
            let console = document.getElementById("console");
            console.innerText += "[i] Generated a cryptographically secure password and copied it to clipboard\n";
        });
}