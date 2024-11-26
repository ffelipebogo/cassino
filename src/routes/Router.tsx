import React, { lazy, Suspense } from 'react';
import Login from '../pages/login/Login';
import MyBets from '../pages/bets/MyBets';
import Register from '../pages/register/Register';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('../pages/home/Home'));

const Router: React.FC = () => {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<Suspense>
						<Home />
					</Suspense>
				}
			/>

			<Route
				path="/register"
				element={
					<Suspense>
						<Register />
					</Suspense>
				}
			/>

			<Route
				path="/login"
				element={
					<Suspense>
						<Login />
					</Suspense>
				}
			/>

			<Route
				path="/my-bets"
				element={
					<Suspense>
						<MyBets />
					</Suspense>
				}
			/>
		</Routes>
	);
};

export default Router;
