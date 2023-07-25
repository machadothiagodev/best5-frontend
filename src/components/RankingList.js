import Card from '../components/UI/Card'

import './RankingList.css'
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const barColors = ['chart--red', 'chart--orange', 'chart--yellow', 'chart--green', 'chart--purple', 'chart--blue']

const barFillHeight = (totalVotes, votes) => totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

const best5RankingItems = (ranking) => {
	let rankingItems = ranking.items.slice(0, 5);

	if (ranking.items.length > 5) {
		let otherVotes = 0;
		const remainingItems = ranking.items.slice(5);

		remainingItems.forEach(element => {
			otherVotes += element.votes;
		});

		rankingItems.push({ id: 999, name: 'Outros', votes: otherVotes });
	}

	return rankingItems;
}

const RankingList = ({ rankings }) => {

	const searchParamInputRef = useRef();
	const navigate = useNavigate();

	const showVoteOptionsHandler = (ranking, flag) => {
		navigate(`${ranking.id}?showVoteOptions=true${flag === 2 ? '&showNewItem=true' : ''}`);
	}

	const searchHandler = (event) => {
		event.preventDefault();
		navigate('?search=' + searchParamInputRef.current.value);
	}

	return (
		<>
			<Card className='rankings'>
				<form onSubmit={searchHandler} style={{display: 'flex'}}>
					<input type='text' ref={searchParamInputRef} />
					<button type='submit'>BUSCAR</button>
				</form>
			</Card>
			{rankings && rankings.map(ranking => (
				<Card key={ranking.id} className='rankings'>
					<div style={{textAlign: 'right', fontSize: '0.7rem', paddingBottom: '8px'}}>#{ranking.id}</div>
					<div style={{ fontSize: '2rem', paddingBottom: '20px' }}>{ranking.name}</div>
					<div className='charts'>
						{best5RankingItems(ranking).map((rankingItem, index) => (
							<div key={rankingItem.id} className='chart-bar'>
								<span>{rankingItem.name}</span>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<div className={`charts__chart chart--p${barFillHeight(ranking.totalVotes, rankingItem.votes)} ${barColors[index]}`} style={{ fontWeight: 'bolder', display: 'flex', alignItems: 'center' }}>
										&nbsp;&nbsp;&nbsp;{barFillHeight(ranking.totalVotes, rankingItem.votes)}%
							  		</div>
								</div>
							</div>
						))}
					</div>
					<div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px' }}>
						<button type='button' onClick={() => showVoteOptionsHandler(ranking, 1)}>VOTE!</button>
						<button type='button' onClick={() => showVoteOptionsHandler(ranking, 2)}>NOVO ITEM</button>
					</div>
				</Card >
			))}
		</>
	);
}

export default RankingList