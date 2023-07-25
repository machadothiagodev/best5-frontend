import './RankingForm.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSubmit, useNavigation } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha';

const RankingForm = (props) => {

	const navigate = useNavigate();
	const navigation = useNavigation();

	const isSubmitting = navigation.state === 'submitting';

	const submit = useSubmit();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	  } = useForm();

	const initalState_items = [
		{
			name: ''
		},
		{
			name: ''

		},
		{
			name: ''
		}
	];

	const [prodOrServ, setProdOrServ] = useState('');
	const [region, setRegion] = useState('');
	const [inputItems, setInputItems] = useState(initalState_items);

	// const rankingTitleHandler = (event) => {
	// 	setRankingTitle(event.target.value)
	// }

	const addInputItemHandler = () => {
		setInputItems(prevInputItems => {
			// console.log(prevInputItems);
			const tempArray = [...prevInputItems, {name: ''}];
			// console.log(tempArray);
			return tempArray;
		});
	}

	const deleteInputHandler = (index) => {
		setInputItems(prevInputItems => {
			// console.log(prevInputItems);
			let tempArray = [...prevInputItems];
			tempArray.splice(index, 1);
			// console.log(tempArray);
			return tempArray;
		});
		// console.log(inputItems);
	}

	const changeInputHandler = (event, index) => {
		setInputItems(prevInputItems => {
			let tempArray = [...prevInputItems];
			tempArray[index].name = event.target.value;
			return tempArray;
		});
	}

	const submitHandler = (event) => {
		let rankingTitle = 'QUAL É ';
		if (categoria) {
			rankingTitle += categoria.artigo + ' ' +(categoria.id !== 1 ? (prodOrServ.toUpperCase() + ' ' + categoria.name) : (categoria.name + ' ' +prodOrServ.toUpperCase())) + ' ' + preposition + ' ' + region.toUpperCase();
		}
		// console.log(rankingTitle);

		// const newRanking = {
		// 	name: rankingTitle,
		// 	items: inputItems
		// };

		const newRanking = {};
		newRanking['rankingName'] = rankingTitle;
		inputItems.forEach((el, index) => newRanking['rankingItemName_' + (index + 1)] = el.name);

		// fetch(`${host}/api/rankings`, {
		// 	method: 'POST',
		// 	body: JSON.stringify(newRanking),
		// 	headers: {
		// 		'Content-type': 'application/json; charset=UTF-8'
		// 	}
		// });

		// setProdOrServ('');
		// setRegion('');
		// setInputItems(initalState_items);

		// props.onCancel();

		// navigate('/');

		submit(newRanking, {method: 'POST'});
	};

	const categorias = [
		{
			id: 1,
			artigo: 'O (A)',
			name: 'MELHOR'
		},
		{
			id: 2,
			artigo: 'O',
			name: 'MAIS BONITO'
		},
		{
			id: 3,
			artigo: 'A',
			name: 'MAIS BONITA'
		}
	];

	const [categoria, setCategoria] = useState();
	const [preposition, setPreposition] = useState('');

	const selectCategoryHandler = categoryId => {
		if (categoryId) {
			const categoria = categorias.find(c => c.id == categoryId);
			setCategoria(categoria);
		} else {
			setCategoria();
		}
		setProdOrServ('');
	}

	const selectPrepositionHandler = prep => {
		setPreposition(prep);
	}

	return (
		<div className='new-expense'>
			<ReCAPTCHA size='invisible' sitekey='6LdmdPAmAAAAABINh3WHm_u3aHSeOTtGzFLGxryh' />
			<form onSubmit={handleSubmit(submitHandler)}>

					<div className='titlePieces'>
						<label>QUAL É {categoria ? categoria.artigo : ''}</label>
						{ (categoria && categoria.id !== 1) && 
							<input type='text' id='prodOrServ' name='prodOrServ' placeholder='O que você quer ranquear?' {...register('prodOrServ', { required: true, onChange: event => setProdOrServ(event.target.value) })} />
						}
						<select onChange={e => {selectCategoryHandler(e.target.value)}} className='categorySize' name='category'>
							<option value='' />
							{categorias.map(cat => (
								<option key={cat.id} value={cat.id}>{cat.name}</option>
							))}
						</select>
						{ (categoria && categoria.id === 1) && 
							<input type='text' id='prodOrServ' name='prodOrServ' placeholder='O que você quer ranquear?' {...register('prodOrServ', { required: true, onChange: event => setProdOrServ(event.target.value) })} />
						}
						{prodOrServ !== '' && 
							<>						
								<select onChange={e => selectPrepositionHandler(e.target.value)} className='prepositionSize' name='preposition'>
									<option value=''></option>
									<option value='DA'>DA</option>
									<option value='DE'>DE</option>
									<option value='DO'>DO</option>
								</select>
								<input type='text' id='region' name='region' placeholder='Qual o local do ranking?' {...register('region', { required: true, onChange: event => setRegion(event.target.value) })} />
								<span style={{fontWeight: 'bold'}}>?</span>
							</>
						}
					</div>

					{/* <div className={`titlePieces ${errors.prodOrServ ? 'invalid' : ''}`}>
						<input type='text' id='prodOrServ' placeholder='O que você quer ranquear' {...register('prodOrServ', { required: true, onChange: event => setProdOrServ(event.target.value) })} />
					</div> */}
					{/* {prodOrServ !== '' && 
						<div className={`titlePieces ${errors.region ? 'invalid' : ''}`}>
							<select>
								<option value=''></option>
								<option value='DA'>DA</option>
								<option value='DE'>DE</option>
								<option value='DO'>DO</option>
							</select>
							<input type='text' id='region' placeholder='Lugar do Ranking' {...register('region', { required: true, onChange: event => setRegion(event.target.value) })} /> <label>?</label>
						</div>
					} */}

				<div className='items'>
					{inputItems.map((element, index) => (
						<div key={index} className={`item ${errors[`item${index}`] && 'invalid'}`}>
							<label>{index + 1}° Lugar</label>
							<div style={{display: 'flex'}}>
								<input type='text' name={`item_${index}`} value={element.name} {...register(`item${index}`, { required: true, onChange: event => changeInputHandler(event, index) })} />
								{ index > 2 && <button type='button' onClick={() => {deleteInputHandler(index)}}>-</button> }
								{ index === (inputItems.length - 1) && <button type='button' onClick={addInputItemHandler}>+</button> }
							</div>
						</div>
					))}
				</div>
				<div className='new-expense__actions'>
					<button type="button" onClick={() => navigate('..')}>CANCEL</button>
					<button type='submit' disabled={isSubmitting}>{isSubmitting ? 'SUBMITTING...' : 'SAVE'}</button>
				</div>
			</form>
		</div>
	);
}

export default RankingForm;