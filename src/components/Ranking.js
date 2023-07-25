import { useState } from 'react';
import { useSearchParams } from 'react-router-dom'

import Card from './UI/Card'
import Chart from './Chart'

const Ranking = (props) => {
    const [ranking, setRanking] = useState(props.ranking);
    const [searchParams] = useSearchParams();

	const voteHanlder = (rankingItemId) => {
		setRanking((prevRanking) => {
			prevRanking.totalVotes += 1;

			const itemIndex = prevRanking.items.findIndex(i => i.id == rankingItemId);
			prevRanking.items[itemIndex].votes += 1;
			prevRanking.items.sort((arg1, arg2) => {
				if (arg1.votes > arg2.votes) {
					return -1;
				}
				if (arg1.votes < arg2.votes) {
					return 1;
				}
				return 0;
			});

			return prevRanking;
		});
	}

	const addHandler = (rankingItem) => {
		setRanking((prevRanking) => {
			prevRanking.totalVotes += 1;

			prevRanking.items.push(rankingItem);

			return prevRanking;
		});
	}

    return (
        <Card className='rankings'>
            <Chart ranking={ranking} onVote={voteHanlder} onAdd={addHandler} showVoteOptions={searchParams.get('showVoteOptions')} showNewItem={searchParams.get('showNewItem')} />
        </Card>
    );
}

export default Ranking;