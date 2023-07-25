import { redirect, json } from "react-router-dom";

import RankingForm from "../components/RankingForm";
import { getAuthToken } from "../util/auth";
import { getHost } from "../util/host";

const NewRankingPage = () => {
    return (
        <RankingForm />
    );
}

export default NewRankingPage;

export async function action({ request }) {
    const formData = await request.formData();

    // console.log(formData.get('rankingName'));
    // for (let i = 1; true; i++) {
    //     if (!formData.get('rankingItemName_' + i)) {
    //         break;
    //     }
    //     console.log(formData.get('rankingItemName_' + i));
    // }

    const newRankingItems = [];
    for (let i = 1; true; i++) {
        if (!formData.get('rankingItemName_' + i)) {
            break;
        }
        newRankingItems.push({name: formData.get('rankingItemName_' + i)});
    }

    const newRanking = {
        name: formData.get('rankingName'),
        items: newRankingItems
    }

    // console.log(newRanking);

    const response = await fetch(getHost() + '/api/rankings', {
        method: request.method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getAuthToken()
        },
        body: JSON.stringify(newRanking)
    })

    if (!response.ok) {
        throw json({ message: 'Could not save ranking.' }, { status: 500 })
    }

    return redirect('/rankings');
}