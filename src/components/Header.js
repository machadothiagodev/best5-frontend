import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons'

import { useRef, useEffect } from 'react';
import { Link, useNavigate, Form, useLoaderData, useSubmit } from 'react-router-dom';

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
				<div className="sidenav" style={{ fontFamily: 'Noteworthy', color: '#9cabf1', marginLeft: '3rem', fontSize: '6rem', alignItems: 'center' }}>Best 5</div>
				<div className="logo" style={{display: 'flex', justifyContent: 'end', alignItems: 'center', fontSize: '0.8rem', fontWeight: 'bold', marginRight: '1rem'}}>
					{/* <select>
						<option value='pt-BR'>Português (Brasil)</option>
						<option value='en-US'>English (US)</option>
					</select> */}
				</div>
				<div className="content" style={{display: 'flex', justifyContent: 'end', alignItems: 'end', marginRight: '1rem'}}>
					{!authToken &&
						<button onClick={() => navigate('/login')} style={{ border: 'none', backgroundColor: '#FFF', cursor: 'pointer', fontSize: '1.3rem', fontWeight: 'bold' }}>
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
			<hr style={{ borderTop: '3px solid #9cabf1' }} />
			<div className='topnav'>
				<Link to='/'>HOME</Link>
				{/* <Link to='/rankings'>RANKINGS</Link> */}
				<Link to='/rankings/new'>CRIE SEU RANKING</Link>
				{/* <div className='search-container'>
					<form onSubmit={searchHandler}>
						<input type='text' ref={searchParamInputRef} />
						<button type='submit'>BUSCAR</button>
					</form>
				</div> */}
			</div>
			<hr style={{ borderTop: '1px solid #9cabf1' }} />
		</>
	);
}

export default Header;