import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

import { getJwtToken } from '../util/auth'
import { getHost } from '../util/host';

import './Chart.css';
import FeedbackModal from './FeedbackModal';

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

		rankingItems.push({ id: -1, name: 'Outros', votes: otherVotes });
	}

	return rankingItems;
}

const allRankingItems = (ranking) => {
	let rankingItems = ranking.items.slice(0, 5);

	if (ranking.items.length > 5) {
		let otherVotes = 0;
		const remainingItems = ranking.items.slice(5);

		remainingItems.forEach(element => {
			otherVotes += element.votes;
		});

		rankingItems.push({ id: -1, name: 'Outros', votes: otherVotes });

		rankingItems.push(...remainingItems);
	}

	return rankingItems;
}

const Chart = (props) => {
	const [showExpandedRanking, setShowExpandedRanking] = useState(false);

	useEffect(() => {
		if (props.showVoteOptions === 'true') {
			setShowVoteOptions(true);
			if (props.showNewItem === 'true') {
				showAddItemHandler();
			}
		}
	}, []);

	const [showVoteOptions, setShowVoteOptions] = useState(false);
	const [ranKingItemSelect, setRanKingItemSelect] = useState();
	const [forceSelect, setForceSelect] = useState(false);
	const [showAddItem, setShowAddItem] = useState(false);
	const [newItem, setNewItem] = useState();
	const [errorMessage, setErrorMessage] = useState();
	const [showFeedbackModal, setShowFeedbackModal] = useState(false);

	const recaptchaRef = useRef();

	const navigate = useNavigate();

	const selectItemHandler = (event) => {
		const rankingItemId = event.target.value;
		console.log(event.target.value);
		setRanKingItemSelect(rankingItemId);
		setForceSelect(false);
	}

	const showVoteOptionsHandler = (flag) => {
		setShowExpandedRanking(false);

		if (props.source === 'home') {
			navigate(`ranking/${props.ranking.id}?showVoteOptions=true${flag === 2 ? '&showNewItem=true' : ''}`);
		}

		setShowVoteOptions(true);
		if (flag === 2) {
			showAddItemHandler();
		}
	}

	const selectChangeHandler = (rankingItemId) => {
		if (rankingItemId !== '') {
			setForceSelect(true);
			setRanKingItemSelect(rankingItemId);
		} else {
			setForceSelect(false);
			setRanKingItemSelect();
		}
	}

	const voteHandler = async () => {
		setErrorMessage(null);

		// const token = await recaptchaRef.current.executeAsync();

		// if (token) {
		// 	const response = await fetch(`${getHost()}/api/recaptcha/verify/${token}`, {
		// 		method: 'PUT'
		// 	});

		// 	const data = await response.json();
		// 	console.log('Result from verification', data);
		// }

		// recaptchaRef.current.reset();

		if (newItem) {
			try {
				const response = await fetch(`${getHost()}/api/rankings/${props.ranking.id}/items`, {
					method: 'POST',
					headers: {
						'Content-type': 'application/json; charset=UTF-8',
						'Authorization': 'Bearer ' + getJwtToken()
					},
					body: JSON.stringify({
						name: newItem,
						votes: 1
					})
				});

				const data = await response.json();

				if (response.status === 401) {
					throw new Error('Usuário deve estar autenticado para executar esta operação');
				}

				setShowVoteOptions(false);
				setShowAddItem(false);
				setForceSelect(false);

				setRanKingItemSelect();
				setNewItem();

				props.onAdd(data);
				// alert('OBRIGADO PELO SUA PARTICIPAÇÃO');
				setShowFeedbackModal(true);
			} catch (error) {
				setErrorMessage(error.message);
			}
		} else {
			try {
				const response = await fetch(`${getHost()}/api/rankings/${props.ranking.id}/items/${ranKingItemSelect}`, {
					method: 'PUT'
				});

				if (!response.ok) {
					throw new Error('Ops! Algo de errado aconteceu. Por favor, tente novamente');
				}

				setShowVoteOptions(false);
				setShowAddItem(false);
				setForceSelect(false);

				setRanKingItemSelect();
				setNewItem();

				props.onVote(ranKingItemSelect);
				// alert('OBRIGADO PELO SUA PARTICIPAÇÃO');
				setShowFeedbackModal(true);
			} catch (error) {
				setErrorMessage(error.message);
			}
		}
	};

	const showAddItemHandler = () => {
		setShowAddItem(true);
		setRanKingItemSelect(-1);
	}

	const newItemInputHandler = (event) => {
		if (event.target.value) {
			setNewItem(event.target.value);
			// setForceSelect(true);
		} else {
			setNewItem();
			// setForceSelect(false);
		}
	}

	let rankingItems_;
	let remainingItems;
	if (props.ranking) {
		// console.log(props.ranking.items);
		rankingItems_ = props.ranking.items.slice(0, 5);
		remainingItems = []
		if (props.ranking.items.length > 5) {
			remainingItems = props.ranking.items.slice(5);
			let otherVotes = 0;
			remainingItems.forEach(element => {
				otherVotes += element.votes;
			});

			rankingItems_.push({
				id: -1,
				name: 'Outros',
				votes: otherVotes
			});
		}
	}

	const cancelAddItemHandler = () => {
		setShowAddItem(false);
		setShowVoteOptions(false);
		setRanKingItemSelect();
		setNewItem();
		setErrorMessage();
	}

	const clickHandler = (bannerId) => {
		fetch(getHost() + '/api/banners/' + bannerId + '/click', { method: 'PUT' })
			.then(response => {
				if (!response.ok) {
					console.log('Deu ruim!');
				}
			}).catch(error => console.log(error));
	}

	const closeFeedbackModal = () => {
		setShowFeedbackModal(false);
	}

	return (
		<>
			{props.ranking &&
				<>
					<FeedbackModal open={showFeedbackModal} onClose={closeFeedbackModal}></FeedbackModal>
					<div style={{ textAlign: 'right', fontSize: '0.7rem', paddingBottom: '8px' }}>#{props.ranking.id}</div>
					<div style={{ fontSize: '2rem', paddingBottom: '20px' }}>{props.ranking.name}</div>
					<div className='charts'>
						{showExpandedRanking && allRankingItems(props.ranking).map((rankingItem, index) => (
							<div key={rankingItem.id} className='chart-bar'>
								{ rankingItem.logo && 
									<div style={{display: 'flex', alignItems: 'center'}}>
										<a href={rankingItem.logo.redirectUrl} target='_blank'>
											<img src={`${getHost()}/img/logo/${rankingItem.logo.fileName}`} style={{width: '2rem', height: 'auto'}} />
										</a>
										<span style={{fontSize: '0.9rem'}}>
											<a href={rankingItem.logo.redirectUrl} target='_blank' style={{textDecoration: 'none', color: 'black'}}>
												{rankingItem.name} 
											</a>
											{rankingItem.id === -1 && <button type='button' onClick={event => setShowExpandedRanking(false)} style={{ border: 'none', color: '#48A7E6', backgroundColor: '#FFF', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold', padding: '0' }}>OCULTAR OUTROS ITENS</button>}
										</span>
									</div>
								}
								{ !rankingItem.logo && 
									<span style={{fontSize: '0.9rem'}}>{rankingItem.name} {rankingItem.id === -1 && <button type='button' onClick={event => setShowExpandedRanking(false)} style={{ border: 'none', color: '#48A7E6', backgroundColor: '#FFF', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold', padding: '0' }}>OCULTAR OUTROS ITENS</button>}</span>
								}
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<div className={`charts__chart chart--p${barFillHeight(props.ranking.totalVotes, rankingItem.votes)} ${barColors[index]}`} style={{ fontWeight: 'bolder', display: 'flex', alignItems: 'center' }}>
										&nbsp;&nbsp;&nbsp;{barFillHeight(props.ranking.totalVotes, rankingItem.votes)}%
                      				</div>
								</div>
							</div>
						))}
						{!showExpandedRanking && best5RankingItems(props.ranking).map((rankingItem, index) => (
							<div key={rankingItem.id} className='chart-bar'>
								{ rankingItem.logo && 
									<div style={{display: 'flex', alignItems: 'center'}}>
										<a href={rankingItem.logo.redirectUrl} target='_blank'>
											<img src={`${getHost()}/img/logo/${rankingItem.logo.fileName}`} style={{width: '2rem', height: 'auto'}} />
										</a>
										<span style={{fontSize: '0.9rem'}}>
											<a href={rankingItem.logo.redirectUrl} target='_blank' style={{textDecoration: 'none', color: 'black'}}>
												{rankingItem.name} 
											</a>
											{rankingItem.id === -1 && <button type='button' onClick={event => setShowExpandedRanking(true)} style={{ border: 'none', color: '#48A7E6', backgroundColor: '#FFF', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold', padding: '0' }}>VEJA TODOS OS ITENS</button>}
										</span>
									</div>
								}
								{ !rankingItem.logo && 
									<span style={{fontSize: '0.9rem'}}>{rankingItem.name} {rankingItem.id === -1 && <button type='button' onClick={event => setShowExpandedRanking(true)} style={{ border: 'none', color: '#48A7E6', backgroundColor: '#FFF', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold', padding: '0' }}>VEJA TODOS OS ITENS</button>}</span>
								}
								<div style={{ display: 'flex', alignItems: 'center' }}>
									{showVoteOptions && <input type='radio' name={`ranking_id_${props.ranking.id}`} value={rankingItem.id} onChange={selectItemHandler} checked={rankingItem.id == ranKingItemSelect || forceSelect} disabled={showAddItem && rankingItem.id !== -1} />}
									{(rankingItem.id !== -1 || !showVoteOptions) &&
										<div className={`charts__chart chart--p${barFillHeight(props.ranking.totalVotes, rankingItem.votes)} ${barColors[index]}`} style={{ fontWeight: 'bolder', display: 'flex', alignItems: 'center' }}>
											&nbsp;&nbsp;&nbsp;{barFillHeight(props.ranking.totalVotes, rankingItem.votes)}%
						  		</div>
									}
									{(showVoteOptions && !showAddItem && rankingItem.id === -1) &&
										<div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
											<select onChange={(event) => { selectChangeHandler(event.target.value) }}>
												<option value='' />
												{remainingItems.map(item => (
													<option key={item.id} value={item.id}>{item.name}</option>
												))}
											</select>
											<button type='button' onClick={showAddItemHandler} style={{ whiteSpace: 'nowrap' }}>NOVO ITEM</button>
										</div>
									}
									{(showAddItem && rankingItem.id === -1) &&
										<div style={{ display: 'flex', width: '100%', padding: '0.5rem 0rem' }}>
											<input type='text' onChange={newItemInputHandler} style={{ font: 'inherit', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '90%' }} />
											<button type='button' onClick={cancelAddItemHandler}>CANCELAR</button>
										</div>
									}
								</div>
							</div>
						))}
						{(showAddItem && rankingItems_.length < 6) &&
							<div style={{ display: 'flex', width: '100%', padding: '0.5rem 0rem', alignItems: 'center' }}>
								<input type='radio' name={`ranking_id_${props.ranking.id}`} value='-1' onChange={selectItemHandler} checked={showAddItem} />
								<input type='text' onChange={newItemInputHandler} style={{ font: 'inherit', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }} />
								<button type='button' onClick={cancelAddItemHandler}>CANCELAR</button>
							</div>
						}
					</div>
					{!showVoteOptions &&
						<div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px' }}>
							<button type='button' onClick={() => showVoteOptionsHandler(1)}>VOTE!</button>
							<button type='button' onClick={() => showVoteOptionsHandler(2)}>NOVO ITEM</button>
						</div>
					}
					{showVoteOptions &&
						<div style={{ textAlign: 'center', marginTop: '25px' }}>
							<button type='button' onClick={voteHandler} disabled={!(ranKingItemSelect || newItem)}>CONFIRMAR</button>
							{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
						</div>
					}
					{props.ranking.banner &&
						<div className='banner'>
							<a href={props.ranking.banner.redirectUrl} target='_blank' onClick={() => clickHandler(props.ranking.banner.id)}>
								<img style={{ width: '100%', maxWidth: '500px', height: 'auto' }} src={`${getHost()}/img/banner/${props.ranking.banner.fileName}`} />
							</a>
						</div>
					}
					{/* <ReCAPTCHA ref={recaptchaRef} onChange={e => console.log(e)} size='invisible' sitekey='6LdmdPAmAAAAABINh3WHm_u3aHSeOTtGzFLGxryh' /> */}
				</>
			}
		</>
	);
};

export default Chart;