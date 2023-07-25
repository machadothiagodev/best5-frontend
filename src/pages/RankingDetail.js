import { Suspense } from "react";
import { useLoaderData, defer, Await } from "react-router-dom";

import Ranking from "../components/Ranking";
import { getHost } from "../util/host";

const RankingDetailPage = () => {
    const data = useLoaderData();

    return (
        <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
            <Await resolve={data.ranking}>
                {(ranking) => <Ranking ranking={ranking} />}
            </Await>
        </Suspense>
    );
}

export default RankingDetailPage;

async function loadRanking(id) {
    const response = await fetch(getHost() + '/api/rankings/' + id);

    if (!response.ok) {
        throw { message: 'Could not fetch rankings.' }
    } else {
        return await response.json();
    }
}

export function loader({ params }) {
    return defer({
        ranking: loadRanking(params.id)
    });
}