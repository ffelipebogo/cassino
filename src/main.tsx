import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { message } from 'antd';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import './global.css';

message.config({
	top: window.innerHeight - 70,
});

createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Provider store={store}>
				<App />
			</Provider>
		</BrowserRouter>
		,
	</React.StrictMode>,
);
