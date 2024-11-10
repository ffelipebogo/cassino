import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MyBets from '../componets/bets/MyBets';
import Register from '../componets/register/Register';
import Login from '../componets/login/Login';

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
