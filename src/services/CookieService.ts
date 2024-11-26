import Cookies from 'js-cookie';

export const CookieServices = {
	save: (key: string, value: string, expiresInDays: number = 7) => {
		Cookies.set(key, value, { expires: expiresInDays });
		console.log(`Cookie '${key}' armazenado com sucesso!`);
	},

	get: (key: string): string | undefined => {
		return Cookies.get(key);
	},

	remove: (key: string) => {
		Cookies.remove(key);
		console.log(`Cookie '${key}' removido com sucesso!`);
	},
};
