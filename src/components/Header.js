import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons'

import { useRef, useEffect } from 'react';
import { Link, useNavigate, Form, useLoaderData, useSubmit, NavLink } from 'react-router-dom';

import './Header.css'

const Header = () => {
	// const searchParamInputRef = useRef();
	const navigate = useNavigate();
	const authToken = useLoaderData();
	const submit = useSubmit();

	// const searchHandler = (event) => {
	// 	event.preventDefault();
	// 	navigate('/rankings?search=' + searchParamInputRef.current.value);
	// }

	useEffect(() => {
		if (authToken) {
			const tokenExpiration = JSON.parse(authToken).expires_in - new Date().getTime();

			setTimeout(() => {
				submit(null, {action: '/logout', method: 'POST'})
			}, tokenExpiration);
		}
	}, [authToken, submit]);

	return (
		<>
			<section className="grid grid-template-areas-2">
				<div className="title">
					<Link to='/'>
						<img src="/best5-full-logo.png" style={{maxWidth: '25rem', height: 'auto', margin: '10px'}} />
					</Link>
				</div>
				{/* <div className="title" style={{ fontFamily: 'Noteworthy', color: '#6F6FF1', marginLeft: '1rem', fontSize: '6rem' }}>
					Best5
				</div> */}
				{/* <div className='subtitle' style={{ marginLeft: '1rem', color: '#6F6FF1', fontSize: '1.1rem', fontWeight: 'bold'}}>
					Site de Rankings
				</div> */}
				<div className="logo" style={{display: 'flex', justifyContent: 'end', alignItems: 'center', fontSize: '0.8rem', fontWeight: 'bold', marginRight: '1rem'}}>
					{/* <select>
						<option value='pt-BR'>Português (Brasil)</option>
						<option value='en-US'>English (US)</option>
					</select> */}
				</div>
				<div className="content" style={{display: 'flex', justifyContent: 'end', alignItems: 'end'}}>
					{!authToken &&
						<button onClick={() => navigate('/login')} style={{ border: 'none', backgroundColor: '#FFF', cursor: 'pointer', fontSize: '1.3rem', fontWeight: 'bold', color: '#000' }}>
							ENTRAR
						</button>
					}
					{authToken &&
						<Form action='/logout' method='POST'>
							<button type='submit' style={{ border: 'none', backgroundColor: '#FFF', cursor: 'pointer', fontSize: '1.3rem', fontWeight: 'bold' }}>
								SAIR
							</button>
						</Form>
					}
				</div>
			</section>
			<hr style={{ borderTop: '3px solid #6F6FF1', marginBottom: '-1px'}} />
			<div className='topnav'>
				<NavLink end to='/rankings'>RANKINGS</NavLink>
				{/* <Link to='/rankings'>RANKINGS</Link> */}
				<NavLink to='/rankings/new'>CRIE SEU RANKING</NavLink>
				{/* <div className='search-container'>
					<form onSubmit={searchHandler}>
						<input type='text' ref={searchParamInputRef} />
						<button type='submit'>BUSCAR</button>
					</form>
				</div> */}
				<NavLink to='/advertise'>ANUNCIE</NavLink>
				<NavLink to='/about'>SOBRE</NavLink>
			</div>
			<hr style={{ borderTop: '1px solid #6F6FF1', marginTop: '-1px' }} />
		</>
	);
}

export default Header;