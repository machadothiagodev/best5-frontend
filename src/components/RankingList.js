import Card from '../components/UI/Card'

import './RankingList.css'
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import RankingItemList from './RankingItemList';

const RankingList = ({ rankings }) => {

	// const [showExpandedRanking, setShowExpandedRanking] = useState(false);
	const searchParamInputRef = useRef();
	const navigate = useNavigate();

	const showVoteOptionsHandler = (ranking, flag) => {
		navigate(`/rankings/${ranking.id}?showVoteOptions=true${flag === 2 ? '&showNewItem=true' : ''}`);
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
					<RankingItemList ranking={ranking} />
					{/* <div className='charts'>
						{!showExpandedRanking && best5RankingItems(ranking).map((rankingItem, index) => (
							<div key={rankingItem.id} className='chart-bar'>
								<span>{rankingItem.name} {rankingItem.id === -1 && <button type='button' onClick={event => setShowExpandedRanking(true)} style={{ border: 'none', color: '#48A7E6', backgroundColor: '#FFF', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold', padding: '0' }}>VEJA TODOS OS ITENS</button>}</span>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<div className={`charts__chart chart--p${barFillHeight(ranking.totalVotes, rankingItem.votes)} ${barColors[index]}`} style={{ fontWeight: 'bolder', display: 'flex', alignItems: 'center' }}>
										&nbsp;&nbsp;&nbsp;{barFillHeight(ranking.totalVotes, rankingItem.votes)}%
							  		</div>
								</div>
							</div>
						))}
						{showExpandedRanking && allRankingItems(ranking).map((rankingItem, index) => (
							<div key={rankingItem.id} className='chart-bar'>
								<span>{rankingItem.name} {rankingItem.id === -1 && <button type='button' onClick={event => setShowExpandedRanking(false)} style={{ border: 'none', color: '#48A7E6', backgroundColor: '#FFF', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold', padding: '0' }}>OCULTAR OUTROS ITENS</button>}</span>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<div className={`charts__chart chart--p${barFillHeight(ranking.totalVotes, rankingItem.votes)} ${barColors[index]}`} style={{ fontWeight: 'bolder', display: 'flex', alignItems: 'center' }}>
										&nbsp;&nbsp;&nbsp;{barFillHeight(ranking.totalVotes, rankingItem.votes)}%
							  		</div>
								</div>
							</div>
						))}
					</div> */}
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