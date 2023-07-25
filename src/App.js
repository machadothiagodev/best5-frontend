import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './App.css'
import ErrorPage from './pages/Error';
import RootLayout from './pages/Root';
import RankingsPage, { loader as rankingsLoader } from './pages/Rankings'
import RankingDetailPage, { loader as rankingDetailLoader } from './pages/RankingDetail';
import NewRankingPage, { action as newRankingAction } from './pages/NewRanking';
import LoginPage, { action as loginAction } from './pages/Login'
import SignupPage, { action as signupAction } from './pages/Signup'
import { action as logoutAction } from './pages/Logout'
import { isLogIn, checkUserLogin } from './util/auth';

const router = createBrowserRouter(
	[
		{
			id: 'root',
			path: '/',
			errorElement: <ErrorPage />,
			loader: isLogIn,
			children: [
				{
					path: '',
					element: <RootLayout />,
					children: [
						{
							path: 'rankings',
							children: [
								{ index: true, element: <RankingsPage />, loader: rankingsLoader },
								{ path: ':id', element: <RankingDetailPage />, loader: rankingDetailLoader },
								{ path: 'new', element: <NewRankingPage />, action: newRankingAction, loader: checkUserLogin }
							]
						},
					]
				},
				{
					path: 'login',
					element: <LoginPage />,
					action: loginAction
				},
				{
					path: 'logout',
					action: logoutAction
				},
				{
					path: 'signup',
					element: <SignupPage />,
					action: signupAction
				}
			]
		},
	]
);

const App = () => {
	return (
		<RouterProvider router={router} />
	);
}

export default App;