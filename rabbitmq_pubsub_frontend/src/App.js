import React, {useEffect, useState} from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:4001";

function App() {
    const [response, setResponse] = useState([""]);

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.on("FromAPI", data => {
            setResponse(prevResponse => [...prevResponse, data]);
        });
    }, []);

    return (
        <p>
            {response}
        </p>
    );
}

export default App;
