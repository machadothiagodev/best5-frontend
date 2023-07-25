import { useRouteError } from "react-router-dom";

import Header from "../components/Header"

const ErrorPage = () => {
    const error = useRouteError()

    return (
        <>
            <Header />
            <main style={{textAlign: 'center'}}>
                <h1 style={{color: 'red'}}>AN ERROR OCCURRED</h1>
                <p>{error.message}</p>
            </main>
        </>
    );
}

export default ErrorPage;