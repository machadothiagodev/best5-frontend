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
	const [inputItems, setInputItems] = useState(initalState_items);

	const addInputItemHandler = () => {
		setInputItems(prevInputItems => {
			// console.log(prevInputItems);
			const tempArray = [...prevInputItems, { name: '' }];
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
		let rankingTitle = 'MELHOR ' + prodOrServ.toUpperCase();

		const newRanking = {};
		newRanking['rankingName'] = rankingTitle;
		inputItems.forEach((el, index) => newRanking['rankingItemName_' + (index + 1)] = el.name);

		submit(newRanking, { method: 'POST' });
	};

	return (
		<div className='new-expense'>
			<ReCAPTCHA size='invisible' sitekey='6LdmdPAmAAAAABINh3WHm_u3aHSeOTtGzFLGxryh' />
			<form onSubmit={handleSubmit(submitHandler)}>
				<div className='titlePieces'>
					<label>MELHOR</label>
					<input type='text' id='prodOrServ' name='prodOrServ' placeholder='O que você deseja ranquear?' {...register('prodOrServ', { required: true, onChange: event => setProdOrServ(event.target.value) })} />
				</div>
				<div className='items'>
					{inputItems.map((element, index) => (
						<div key={index} className={`item ${errors[`item${index}`] && 'invalid'}`} style={{ display: 'flex' }}>
							<label style={{ marginRight: '0.5rem' }}>{index + 1}°</label>
							<input type='text' name={`item_${index}`} value={element.name} {...register(`item${index}`, { required: true, onChange: event => changeInputHandler(event, index) })} />
							{index > 2 && <button type='button' onClick={() => { deleteInputHandler(index) }}>-</button>}
							{index === (inputItems.length - 1) && <button type='button' onClick={addInputItemHandler}>+</button>}
						</div>
					))}
				</div>
				<div className='new-expense__actions'>
					<button type="button" onClick={() => navigate('..')}>CANCELAR</button>
					<button type='submit' disabled={isSubmitting}>{isSubmitting ? 'PROCESSANDO...' : 'SALVAR'}</button>
				</div>
			</form>
		</div>
	);
}

export default RankingForm;