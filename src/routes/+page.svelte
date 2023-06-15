<script lang="ts">
	import { onMount } from 'svelte';
	import type { Data } from '$lib/types.ts';

	let chatLog = [] as Data[];
	let input = '';
	let answer: Data;
	let allMessages: Data[];

	$: if (answer) {
		allMessages = [...chatLog, answer];
	} else {
		allMessages = chatLog;
	}

	onMount(async () => {
		const response = await fetch('/api/log', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		chatLog = await response.json();
	});

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		const response = await fetch('/api/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				senderId: 1,
				receiverId: 2,
				input
			})
		});

		if (response.ok) {
			const log = await response.json();
			chatLog = log;
		} else {
			console.error('Error:', response.status);
		}

		input = '';
		getResponse();
	};

	const getResponse = async () => {
		const response = await fetch('/api/answer', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		answer = await response.json();
	};

	const getNameTag = (name: string | undefined) => {
		if (!name) return '?';
		return name.charAt(0).toLocaleUpperCase();
	};

	const scrollToBottom = (node) => {
		const scroll = () =>
			node.scroll({
				top: node.scrollHeight,
				behavior: 'smooth'
			});
		scroll();

		return { update: scroll };
	};
</script>

<main>
	<section>
		<h2 class="text-3xl font-semibold">Superchat</h2>
		<div class="bg-gray-50 rounded-2xl mt-8 p-8">
			<div use:scrollToBottom={chatLog} class="flex flex-col space-y-4 h-[48rem] overflow-y-auto">
				{#each allMessages as { name, message, senderId }, index}
					{@const myUser = senderId === 1}
					<article
						aria-posinset={index + 1}
						aria-setsize={chatLog.length}
						class={`flex items-center ${myUser ? 'justify-end' : 'justify-start'} ${
							index === 0 ? 'mt-auto' : ''
						}`}
					>
						<span
							class={`flex items-center justify-center h-10 w-10 rounded-full bg-indigo-200 flex-shrink-0 `}
							>{getNameTag(name)}</span
						>
						<p
							class={`${
								myUser ? 'order-first mr-2 bg-indigo-500 text-white' : 'order-last ml-2 bg-white'
							} px-4 py-2 rounded-md shadow-sm`}
						>
							{message}
						</p>
					</article>
				{/each}
			</div>
			<form on:submit={handleSubmit} class="flex w-full items-center space-x-2 pt-4">
				<label class="w-full">
					<input
						type="text"
						bind:value={input}
						required
						class="w-full text-lg px-2 border border-gray-500 rounded-md"
					/>
				</label>
				<button
					type="submit"
					class="flex items-center bg-indigo-500 text-white py-1 px-4 rounded-md hover:opacity-80"
				>
					<span class="pr-2">Send</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-4 h-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
						/>
					</svg>
				</button>
			</form>
		</div>
	</section>
</main>
