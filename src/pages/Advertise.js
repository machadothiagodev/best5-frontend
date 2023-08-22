import Card from "../components/UI/Card"
import AdvertiseForm from "../components/AdvertiseForm"
import { useLoaderData } from "react-router-dom";
import { checkUserLogin } from "../util/auth";
import { getHost } from "../util/host";

const AdvertisePage = () => {
    const data = useLoaderData();

    return (
        <Card>
            <AdvertiseForm rankings={data} />
        </Card>
    );
}

export default AdvertisePage;

export async function loader() {
    let response = checkUserLogin();

    if (response == null) {
        response = await fetch(getHost() + '/api/rankings', {
            method: 'GET'
        }).catch(error => { throw { message: `Network error (${error.message})` } });

        if (!response.ok) {
            throw { message: 'Could not fetch rankings' }
        } else {
            return await response.json();
        }
    }

    return response;
}