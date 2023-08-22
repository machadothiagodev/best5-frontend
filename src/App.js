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
import { getAuthToken, checkUserLogin } from './util/auth';
import EmailConfirmPage, { action as emailConfirmAction } from './pages/EmailConfirm';
import AboutPage from './pages/About';
import AdvertisePage, { loader as advertiseLoader } from './pages/Advertise';

const router = createBrowserRouter(
	[
		{
			id: 'root',
			path: '/',
			errorElement: <ErrorPage />,
			children: [
				{
					path: '',
					element: <RootLayout />,
					loader: getAuthToken,
					children: [
						{ index: true, element: <RankingsPage />, loader: rankingsLoader },
						{ path: 'rankings', element: <RankingsPage />, loader: rankingsLoader },
						{ path: 'rankings/:id', element: <RankingDetailPage />, loader: rankingDetailLoader },
						{ path: 'rankings/:id/:slug', element: <RankingDetailPage />, loader: rankingDetailLoader },
						{ path: 'rankings/new', element: <NewRankingPage />, action: newRankingAction, loader: checkUserLogin },
						{ path: 'advertise', element: <AdvertisePage />, loader: advertiseLoader },
						{ path: 'about', element: <AboutPage /> }
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
				},
				{
					path: 'email-confirm',
					element: <EmailConfirmPage />,
					action: emailConfirmAction
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