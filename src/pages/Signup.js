import { json, redirect } from "react-router-dom";

import SignUpForm from "../components/SignupForm";
import { getHost } from "../util/host";

const SignupPage = () => {
    return <SignUpForm />
}

export default SignupPage;

export async function action({ request }) {
    const formData = await request.formData();

    const newUser = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        birthdayDate: formData.get('day') + '/' + formData.get('month') + '/' + formData.get('year'),
        gender: formData.get('gender'),
        password: formData.get('password')
    }

    // console.log(newUser);

    const response = await fetch(getHost() + '/api/users/signup', {
        method: request.method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    }).catch(error => { return json({ message: `Network error (${error.message})` }, { status: 500 }) })

    if (!response.ok) {
        return response;
    }

    return redirect('/email-confirm?email=' + newUser.email);
}