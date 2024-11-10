import { API_URL } from '../config';

const apiBase = API_URL;

const defaultHeaders: HeadersInit = {
	'Content-Type': 'application/json',
};

const fetchRequest = <TResponse>(url: string, config: RequestInit = {}): Promise<TResponse> =>
	fetch(`${apiBase}${url}`, config)
		.then((response) => response.json())
		.then((data) => data as TResponse);

const request = {
	get: <TResponse>(url: string, customHeaders?: HeadersInit) =>
		fetchRequest<TResponse>(url, {
			method: 'GET',
			headers: { ...defaultHeaders, ...customHeaders },
		}),

	delete: <TResponse>(url: string, customHeaders?: HeadersInit) =>
		fetchRequest<TResponse>(url, {
			method: 'DELETE',
			headers: { ...defaultHeaders, ...customHeaders },
		}),

	post: <TBody extends BodyInit, TResponse>(
		url: string,
		body: TBody,
		customHeaders?: HeadersInit,
	) =>
		fetchRequest<TResponse>(url, {
			method: 'POST',
			body,
			headers: { ...defaultHeaders, ...customHeaders },
		}),

	put: <TBody extends BodyInit, TResponse>(
		url: string,
		body: TBody,
		customHeaders?: HeadersInit,
	) =>
		fetchRequest<TResponse>(url, {
			method: 'PUT',
			body,
			headers: { ...defaultHeaders, ...customHeaders },
		}),
};

export enum ERequestStatus {
	IDLE = 'IDLE',
	LOADING = 'LOADING',
	SUCCEEDED = 'SUCCEEDED',
	FAILED = 'FAILED',
}

export default request;
