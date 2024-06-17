import logo from './logo.svg';
import './App.css';

import useState from 'react-usestateref'
import {BrowserRouter, Route, Routes} from "react-router-dom";

import Login from "./pages/Login.mjs";
import Register from "./pages/Register.mjs";
import Dashboard from "./pages/Dashboard.mjs";
import Recovery from "./pages/Recovery.mjs";
import Denied from "./pages/Denied.mjs";
import Statistics from "./pages/Statistics.mjs";

function App() {

    const [token, setToken, tokenRef] = useState(0);
    const [statusErr, setStatusErr, statusErrRef] = useState("");
    const [memory, setMemory, memoryRef] = useState([]);
    const [offlineChanges, setOfflineChanges, offlineChangesRef] = useState([]);
    const [user, setUser, userRef] = useState({});
    return (
        <BrowserRouter>
            <Routes>
            <Route path="/">
                <Route index element={<Login token={token} setToken={setToken} setStatusErr={setStatusErr}
                                            user={user} setUser={setUser} userRef={userRef}/>} />
                <Route path="register" element={<Register setStatusErr={setStatusErr}/>} />
                <Route path="dashboard" element={<Dashboard user={user} setUser={setUser} userRef={userRef}
                                                            memory={memory} setMemory={setMemory} memoryRef={memoryRef}
                                                            statusErr={statusErr} setStatusErr={setStatusErr}
                                                            offlineChanges={offlineChanges} setOfflineChanges={setOfflineChanges} offlineChangesRef={offlineChangesRef}/>} />
                <Route path="recovery" element={<Recovery />} />
                <Route path="denied" element={<Denied statusErr={statusErr} setStatusErr={setStatusErr}/>}></Route>
                <Route path="statistics" element={<Statistics user={user}/>}></Route>
            </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
