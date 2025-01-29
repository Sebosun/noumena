<script lang="ts">
	import ollama, { type Message, type ModelResponse } from "ollama"; // Import the Ollama library
	import ParseMessage from "./ParseMessage.svelte";
	import { onMount } from "svelte";

	let message = $state("");
	let messages = $state<Message[]>([]);
	let models = $state<ModelResponse[]>([]);
	let modelSelected = $state<string>("");

	async function sendMessage(event: SubmitEvent) {
		event.preventDefault();
		console.log("Calling llama with", modelSelected, " model");

		if (message.trim()) {
			// Add the user's message to the chat
			messages.push({ role: "user", content: message });
			message = "";

			// Send the message to Ollama and get a response
			try {
				const response = await ollama.chat({
					model: "deepseek-r1:7b",
					messages: messages,
				});

				messages.push(response.message);
			} catch (error) {
				console.error("Error communicating with Ollama:", error);
				messages = [
					...messages,
					{ role: "assistant", content: "Failed to get a response." },
				];
			}
		}
	}

	onMount(async () => {
		const response = await ollama.list();
		models = response.models;
		modelSelected = models[1].name;
	});
</script>

<div class="chat-view">
	<div class="chat-view__models">
		<label for="model"> Change your model </label>
		<select bind:value={modelSelected} name="model" id="model">
			{#each models as mod}
				<option value={mod.name}>{mod.name}</option>
			{/each}
		</select>
	</div>
	<div class="messages">
		{#each messages as msg}
			{#if msg.role === "user"}
				<div class="message {msg.role}">
					<strong>You</strong>
					{msg.content}
				</div>
			{:else}
				<div class="message {msg.role}">
					<strong>Chat</strong>
					<ParseMessage content={msg.content} />
				</div>
			{/if}
		{/each}
	</div>
	<div>
		<form class="message__wrapper" onsubmit={sendMessage}>
			<input
				class="message__input"
				bind:value={message}
				placeholder="Type a message..."
			/>
		</form>
	</div>
</div>

<style>
	.chat-view {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 10px;
		user-select: text !important;
		-webkit-user-select: text !important;
		display: relative;
	}
	.chat-view__models {
		text-align: end;
	}
	.messages {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		margin-bottom: 10px;
	}
	.message__wrapper {
		display: flex;
		width: 100%;
	}

	.message.user {
		color: white;
		margin-bottom: 4px;
	}

	.message.model {
		margin-bottom: 4px;
	}

	.message__input {
		width: 100%;
		border: 1px solid #ddd;
		border-radius: 4px;
		background-color: transparent;
		padding: 8px;
	}

	input {
		margin-bottom: 10px;
	}
</style>
