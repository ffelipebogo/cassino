import { createSlice } from '@reduxjs/toolkit';
import { IPlayerState } from '../../types/Interfaces';

const initialState: IPlayerState = {
	id: '',
	name: '',
	balance: 0,
	currency: '',
	accessToken: '',
};

const playerSlice = createSlice({
	name: 'player',
	initialState,
	reducers: {
		addPlayer: (state, action: { payload: IPlayerState }) => {
			state.id = action.payload.id;
			state.name = action.payload.name;
			state.balance = action.payload.balance;
			state.currency = action.payload.currency;
			state.message = action.payload.message;
		},
	},
});

export const { addPlayer } = playerSlice.actions;

export default playerSlice.reducer;
