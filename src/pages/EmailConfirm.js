import { json, redirect } from "react-router-dom";

import { getHost } from "../util/host";
import { setAuthToken } from "../util/auth"
import EmailConfirmForm from "../components/EmailConfirmForm";

const EmailConfirmPage = () => {
    return <EmailConfirmForm />
}

export default EmailConfirmPage;

export async function action({ request }) {
    const formData = await request.formData();

    const response = await fetch(getHost() + '/api/otp/validate?otp=' + formData.get('otp') + '&email=' + formData.get('email'), {
        method: request.method,
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(error => { return json({ message: `Network error (${error.message})` }, { status: 500 }) })

    if (!response.ok) {
        return response;
    }

    const responseData = await response.json();
    setAuthToken(JSON.stringify(responseData));

    return redirect('/rankings');
}