import { json, redirect } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import { setAuthToken } from "../util/auth"
import { getHost } from "../util/host";

const LoginPage = () => {
    return <LoginForm />
}

export default LoginPage;

export async function action({ request }) {
    const formData = await request.formData();

    const userLogin = {
        email: formData.get('email'),
        password: formData.get('password')
    }

    const response = await fetch(getHost() + '/api/user/login', {
        method: request.method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userLogin)
    }).catch(error => { return json({ message: `Network error (${error.message})` }, { status: 500 }) })

    if (!response.ok) {
        return response;
    }

    const responseData = await response.json();
    setAuthToken(responseData.token);

    return redirect('/rankings');
}