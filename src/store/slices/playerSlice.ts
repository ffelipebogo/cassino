import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPlayerState } from '../../types/Interfaces';

const initialState: IPlayerState = {
	id: '',
	name: '',
	balance: 0,
	currency: '',
	accessToken: '',
	isFirstAccess: true,
};

const playerSlice = createSlice({
	name: 'player',
	initialState,
	reducers: {
		setPlayer: (_state, action: PayloadAction<IPlayerState>) => {
			return { ...action.payload, isFirstAccess: false };
		},
		updateBalance: (state, action: PayloadAction<number>) => {
			state.balance = action.payload; // Atualiza o saldo do jogador
		},
		resetPlayer: () => initialState,
	},
});

export const { setPlayer, updateBalance, resetPlayer } = playerSlice.actions;

export default playerSlice.reducer;
