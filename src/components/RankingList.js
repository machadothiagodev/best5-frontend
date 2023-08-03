import { useNavigate, Link } from 'react-router-dom';
import { useRef } from 'react';

import Card from '../components/UI/Card'
import RankingItemList from './RankingItemList';

import './RankingList.css'

const RankingList = ({ rankings }) => {

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
					<div style={{textAlign: 'right', fontSize: '0.7rem', paddingBottom: '8px'}}><Link to={`/rankings/${ranking.id}`} style={{color: 'black', textDecoration: 'none'}}>#{ranking.id}</Link></div>
					<div style={{ fontSize: '2rem', paddingBottom: '20px' }}>{ranking.name}</div>
					<RankingItemList ranking={ranking} />
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