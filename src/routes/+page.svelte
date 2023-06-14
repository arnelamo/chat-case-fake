<script lang="ts">
	import { onMount } from 'svelte';
	import type { Data } from '$lib/types.ts';

	let chatLog = [] as Data[];
	let input = '';

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
	};
</script>

<main>
	<section>
		<h2>Chat</h2>
		<div>
			{#each chatLog as { senderId, message }, index}
				<article aria-posinset={index + 1} aria-setsize={chatLog.length}>
					<h2>{senderId}</h2>
					<p>{message}</p>
				</article>
			{/each}
		</div>
	</section>
	<form on:submit={handleSubmit}>
		<label>
			New Message:
			<input type="text" bind:value={input} required />
		</label>
		<button type="submit">Submit</button>
	</form>
</main>
