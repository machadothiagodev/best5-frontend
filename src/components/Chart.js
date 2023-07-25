import ChartBar from './ChartBar';
import './Chart.css';
import { useState, useRef, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../util/auth'
import { getHost } from '../util/host';

const barColors = ['chart--red', 'chart--orange', 'chart--yellow', 'chart--green', 'chart--purple', 'chart--blue']

const getBarFillHeight = (totalVotes, votes) => {
	return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
}

const Chart = (props) => {
	useEffect(() => {
		if (props.showVoteOptions === 'true') {
			setShowVoteOptions(true);
			if (props.showNewItem === 'true') {
				setShowAddItem(true);
			}
		}
	}, []);

	const [showVoteOptions, setShowVoteOptions] = useState(false);
	const [ranKingItemSelect, setRanKingItemSelect] = useState();
	const [forceSelect, setForceSelect] = useState(false);
	const [showAddItem, setShowAddItem] = useState(false);
	const [newItem, setNewItem] = useState();

	const recaptchaRef = useRef();

	const navigate = useNavigate();

	const selectItemHandler = (event) => {
		// console.log(event.target.value);
		setRanKingItemSelect(event.target.value);
		setForceSelect(false);
	}

    const showVoteOptionsHandler = (flag) => {
		// const token = await recaptchaRef.current.executeAsync();
		// // console.log(token);

		// const response = await fetch(`${host}/api/recaptcha/verify/${token}`, {
		// 	method: 'PUT'
		// });

		// const data = await response.json();
		// console.log(data);

		if (props.source === 'home') {
			navigate(`ranking/${props.ranking.id}?showVoteOptions=true${flag === 2 ? '&showNewItem=true' : ''}`);
		}

		setShowVoteOptions(true);
		if (flag === 2 && rankingItems_.length < 6) {
			setShowAddItem(true);
		}
	}

	const selectChangeHandler = (rankingItemId) => {
		if (rankingItemId !== '') {
			setForceSelect(true);
			setRanKingItemSelect(rankingItemId);
		} else {
			setForceSelect(false);
		}
    }

	const voteHandler = async () => {
		if (newItem) {
			fetch(`${getHost()}/api/ranking/${props.ranking.id}/item`, {
				method: 'POST',
				body: JSON.stringify({
					name: newItem,
					votes: 1
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
					'Authorization': 'Bearer ' + getAuthToken()
				}
			}).then(response => response.json())
				.then(data => {
					setShowVoteOptions(false);
					setRanKingItemSelect();
					setShowAddItem(false);
					setForceSelect(false);
					setNewItem();

					console.log(data);
					props.onAdd(data);
					alert('OBRIGADO PELO SEU VOTO!\nSUA OPINIÃO É MUITO IMPORTANTE PARA NÓS');
				})
		} else {
			const res = await fetch(`${getHost()}/api/ranking/${props.ranking.id}/item/${ranKingItemSelect}`, {
				method: 'PUT'
			});
	
			setShowVoteOptions(false);
			setRanKingItemSelect();
	
			if (res.ok) {
				props.onVote(ranKingItemSelect);
				alert('OBRIGADO PELO SEU VOTO!\nSUA OPINIÃO É MUITO IMPORTANTE PARA NÓS');
			}
		}
	};

	const showAddItemHandler = () => {
		setShowAddItem(true);
	}

	const newItemInputHandler = (event) => {
		if (event.target.value) {
			setNewItem(event.target.value);
			setForceSelect(true);
		} else {
			setNewItem();
			setForceSelect(false);
		}
	}

	let rankingItems_;
	let remainingItems;
	if (props.ranking) {
		rankingItems_ = props.ranking.items.slice(0, 5);
		remainingItems = []
		if (props.ranking.items.length > 5) {
			remainingItems = props.ranking.items.slice(5);
			let otherVotes = 0;
			remainingItems.forEach(element => {
				otherVotes += element.votes;
			});
	
			rankingItems_.push({
				id: 999,
				name: 'Outros',
				votes: otherVotes
			});
		}
	}

	return (
		<div>
		{props.ranking && 
		<>
			<ReCAPTCHA ref={recaptchaRef} size='invisible' sitekey='6LdmdPAmAAAAABINh3WHm_u3aHSeOTtGzFLGxryh' />
			<div style={{textAlign: 'right', fontSize: '0.7rem', paddingBottom: '8px'}}>#{props.ranking.id}</div>
			<div style={{ fontSize: '2rem', paddingBottom: '20px' }}>{props.ranking.name}</div>
			<div className='charts'>
				{rankingItems_.map((rankingItem, index) => (
					// <ChartBar
					//   key={rankingItem.id}
					//   votes={rankingItem.votes}
					//   totalVotes={props.totalVotes}
					//   name={rankingItem.name}
					//   barColor={barColors[index]}
					// />
					<div key={rankingItem.id} className='chart-bar'>
						<span>{rankingItem.name}</span>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							{showVoteOptions && <input type='radio' name={`ranking_id_${props.ranking.id}`} value={rankingItem.id} onChange={selectItemHandler} checked={rankingItem.id == ranKingItemSelect || forceSelect} />}
							{(rankingItem.name !== 'Outros' || !showVoteOptions) && 
								<div className={`charts__chart chart--p${getBarFillHeight(props.ranking.totalVotes, rankingItem.votes)} ${barColors[index]}`} style={{ fontWeight: 'bolder', display: 'flex', alignItems: 'center' }}>
									&nbsp;&nbsp;&nbsp;{getBarFillHeight(props.ranking.totalVotes, rankingItem.votes)}%
						  		</div>
							}
							{(showVoteOptions && !showAddItem && rankingItem.name === 'Outros') && 
								<div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
									<select onChange={(event) => {selectChangeHandler(event.target.value)}}>
										<option value='' />
										{remainingItems.map(item => (
											<option key={item.id} value={item.id}>{item.name}</option>
										))}
									</select>
									<button type='button' onClick={showAddItemHandler}>ADICIONAR ITEM</button>
								</div>
							}
							{(showAddItem && rankingItem.name === 'Outros') && 
								<div style={{display: 'flex', width: '100%', padding: '0.5rem 0rem'}}>
									<input type='text' onChange={newItemInputHandler} style={{font: 'inherit', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '90%'}} />
									<button type='button' onClick={() => setShowAddItem(false)}>CANCELAR</button>
								</div>
							}
						</div>
					</div>
				))}
				{(showAddItem && rankingItems_.length < 6) &&
					<div style={{display: 'flex', width: '100%', padding: '0.5rem 0rem', alignItems: 'center'}}>
						<input type='radio' name={`ranking_id_${props.ranking.id}`} value='999' onChange={selectItemHandler} checked={forceSelect} />
						<input type='text' onChange={newItemInputHandler} style={{font: 'inherit', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '100%'}} />
						{/* <button type='button' onClick={() => setShowAddItem(false)}>CANCELAR</button> */}
					</div>
				}
			</div>
			{!showVoteOptions && 
				<div style={{display: 'flex', justifyContent: 'center', marginTop: '25px'}}>
					<button type='button' onClick={() => showVoteOptionsHandler(1)}>VOTE!</button>
					<button type='button' onClick={() => showVoteOptionsHandler(2)}>NOVO ITEM</button>
				</div>
            }
			{showVoteOptions &&
				<div style={{display: 'flex', justifyContent: 'center', marginTop: '25px'}}>
					<button type='button' onClick={voteHandler} disabled={!(ranKingItemSelect || newItem)}>CONFIRMAR</button>
				</div>
			}
		</>
		}
		</div>
	);
};

export default Chart;