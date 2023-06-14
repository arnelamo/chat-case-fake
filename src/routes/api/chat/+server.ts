import type { RequestEvent } from '@sveltejs/kit';
import { messages, users } from '$lib/chat-data.json';

export const POST = async (event: RequestEvent) => {
	try {
		const requestBody = await event.request.json();
		const { senderId, receiverId, input } = requestBody;

		const newMessage = {
			id: messages.length + 1,
			senderId,
			receiverId,
			message: input,
			name: users.find((user) => user.id === senderId)?.name
		};
		messages.push(newMessage);

		const blob = new Blob([JSON.stringify(messages, null, 2)], {
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
