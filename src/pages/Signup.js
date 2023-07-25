import { json, redirect } from "react-router-dom";

import SignUpForm from "../components/SignupForm";
import { setAuthToken } from "../util/auth"
import { getHost } from "../util/host";

const SignupPage = () => {
    return <SignUpForm />
}

export default SignupPage;

export async function action({ request }) {
    const formData = await request.formData();

    const newUser = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
    }

    const response = await fetch(getHost() + '/api/user/signup', {
        method: request.method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    }).catch(error => { return json({ message: `Network error (${error.message})` }, { status: 500 }) })

    if (!response.ok) {
        return response;
    }

    const responseData = await response.json();
    setAuthToken(responseData.token);

    return redirect('/rankings');
}