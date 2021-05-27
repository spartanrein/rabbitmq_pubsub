import React, {useEffect, useState} from "react";
import socketIOClient from "socket.io-client";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const ENDPOINT = "http://localhost:4001";

function App() {
    const [response, setResponse] = useState([]);

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.on("FromAPI", data => {
            const parsedData = (JSON.parse(data));
            console.log(parsedData);
            setResponse(prevResponse => [...prevResponse, parsedData]);
        });

    }, []);

    const dataComponent = (response) => (
        <>
            {response.map(dataEntry => (
                <Box className="dataEntry"
                     key={dataEntry.timestamp}
                     margin={1}
                >
                    <Typography variant={"body1"} align={'left'}>
                        {`${dataEntry.quote}`}
                    </Typography>
                    <Typography
                        variant={"caption text"}>{`Priority: ${dataEntry.priority} Timestamp: ${dataEntry.timestamp}`}
                    </Typography>
                </Box>
            ))}
        </>
    );

    const noDataComponent = () => (
        <>
            <Box>
                <Typography align={"center"} variant={"h3"}>Rabbitmq pubsub waiting for data...</Typography>
            </Box>
        </>
    );

    return (

        <Container maxWidth={"md"}>
            <Box display={"flex"} flexDirection={"column"} className="validation-msg">
                {(response).length !== 0 ? dataComponent(response) : noDataComponent}
            </Box>
        </Container>
    );
}

export default App;
