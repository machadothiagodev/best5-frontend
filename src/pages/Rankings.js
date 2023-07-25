import { Suspense } from "react";
import { useLoaderData, defer, Await } from "react-router-dom";

import RankingList from "../components/RankingList";
import { getHost } from "../util/host";

const RankingsPage = () => {
    const data = useLoaderData();

    return (
        // <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
        //     <Await resolve={data.rankings}>
        //         {(rankings) => <RankingList rankings={rankings} />}
        //     </Await>
        // </Suspense>
        <RankingList rankings={data} />
    );
}

export default RankingsPage;

// async function loadRankings(request) {
//     const searchParam = new URL(request.url).searchParams.get('search');

//     const response = await fetch(getHost() + '/api/rankings' + (searchParam ? '?search=' + searchParam : ''));

//     if (!response.ok) {
//         throw { message: 'Could not fetch rankings.' }
//     } else {
//         return await response.json();
//     }
// }

// export function loader({ request }) {
//     return defer({
//         rankings: loadRankings(request)
//     });
// }

export async function loader({ request }) {
    const searchParam = new URL(request.url).searchParams.get('search');

    const response = await fetch(getHost() + '/api/rankings' + (searchParam ? '?search=' + searchParam : ''))
        .catch(error => { throw { message: `Network error (${error.message})` } });

    if (!response.ok) {
        throw { message: 'Could not fetch rankings' }
    } else {
        return await response.json();
    }
}