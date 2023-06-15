import { messages, answers, users } from '$lib/chat-data.json';

export const GET = async () => {
	try {
		const answerData = answers[Math.floor(Math.random() * answers.length)];

		const newMessage = {
			...answerData,
			id: messages.length + 1,
			name: users.find((user) => user.id === answerData.senderId)?.name
		};

		const blob = new Blob([JSON.stringify(newMessage, null, 2)], {
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
