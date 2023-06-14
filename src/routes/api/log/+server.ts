import { messages, users } from '$lib/chat-data.json';
import type { Data } from '$lib/types.ts';

export const GET = async () => {
	try {
		const data = messages.reduce((acc, value) => {
			const userName = users.find((user) => value.senderId === user.id)?.name;
			return [
				...acc,
				{
					...value,
					name: userName
				}
			];
		}, [] as Data[]);

		console.log(data);

		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: 'application/json'
		});
		const responseOptions = { status: 200, statusText: 'SuperSmashingGreat!' };
		const response = new Response(blob, responseOptions);

		return response;
	} catch (error) {
		console.error('Error:', error);
		return {
			status: 500,
			body: {
				error: 'Internal Server Error'
			}
		};
	}
};
