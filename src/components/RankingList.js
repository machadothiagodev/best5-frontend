import { useNavigate, Link } from 'react-router-dom';
import { useRef } from 'react';
import slugify from 'react-slugify';

import Card from '../components/UI/Card'
import RankingItemList from './RankingItemList';

import './RankingList.css'
import { getHost } from '../util/host';

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

	const clickHandler = (bannerId) => {
		fetch(getHost() + '/api/banners/' + bannerId + '/click', { method: 'PUT' })
			.then(response => {
				if (!response.ok) {
					console.log('Deu ruim!');
				}
			}).catch(error => console.log(error));
	}

	return (
		<>
			<Card className='rankings'>
				<form onSubmit={searchHandler} style={{ display: 'flex' }}>
					<input type='text' ref={searchParamInputRef} />
					<button type='submit'>BUSCAR</button>
				</form>
			</Card>
			{rankings && rankings.map(ranking => (
				<Card key={ranking.id} className='rankings'>
					<div style={{ textAlign: 'right', fontSize: '0.7rem', paddingBottom: '8px' }}>
						<Link to={`/rankings/${ranking.id}/${slugify(ranking.name)}`} style={{ color: 'black', textDecoration: 'none' }}>#{ranking.id}</Link>
					</div>
					<div style={{ fontSize: '2rem', paddingBottom: '20px' }}>{ranking.name}</div>
					<RankingItemList ranking={ranking} />
					<div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px' }}>
						<button type='button' onClick={() => showVoteOptionsHandler(ranking, 1)}>VOTE!</button>
						<button type='button' onClick={() => showVoteOptionsHandler(ranking, 2)}>NOVO ITEM</button>
					</div>
					{ranking.banner &&
						<div className='banner'>
							<a href={ranking.banner.redirectUrl} target='_blank' onClick={() => clickHandler(ranking.banner.id)}>
								<img style={{ width: '100%', maxWidth: '500px', height: 'auto' }} src={`${window.location.protocol}//${window.location.host}/${ranking.banner.imagePath}`} />
							</a>
						</div>
					}
				</Card>
			))}
		</>
	);
}

export default RankingList