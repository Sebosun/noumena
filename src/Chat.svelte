<script lang="ts">
	import ollama, { type Message } from "ollama"; // Import the Ollama library
	import { Remarkable } from "remarkable";

	interface ChatMessage {
		sender: "user" | "model";
		text: string | Message;
	}

	const md = new Remarkable();

	let message = $state("");
	let messages = $state<ChatMessage[]>([]);

	async function sendMessage(event: SubmitEvent) {
		event.preventDefault();

		if (message.trim()) {
			// Add the user's message to the chat
			messages.push({ sender: "user", text: message });
			const userMessage = message;
			message = "";

			// Send the message to Ollama and get a response
			try {
				const response = await ollama.chat({
					model: "deepseek-r1:14b",
					messages: [{ role: "user", content: userMessage }],
				});

				let chatMsg = md.render(response.message.content);

				messages.push({
					sender: "model",
					text: chatMsg,
				});
			} catch (error) {
				console.error("Error communicating with Ollama:", error);
				messages = [
					...messages,
					{ sender: "model", text: "Failed to get a response." },
				];
			}
		}
	}
</script>

<div class="chat-view">
	<div class="messages">
		{#each messages as msg}
			{#if msg.sender === "user"}
				<div class="message {msg.sender}">
					<strong>{msg.sender}:</strong>
					{msg.text}
				</div>
			{:else}
				<div class="message {msg.sender}">
					<strong>{msg.sender}:</strong>
					{@html msg.text}
				</div>
			{/if}
		{/each}
	</div>
	<form class="message__wrapper" onsubmit={sendMessage}>
		<input
			class="message"
			bind:value={message}
			placeholder="Type a message..."
		/>
		<button type="submit">Send</button>
	</form>
</div>

<style>
	.chat-view {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 10px;
		user-select: text !important;
		-webkit-user-select: text !important;
	}
	.messages {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		margin-bottom: 10px;
	}
	.message__wrapper {
		display: grid;
		grid-template-columns: 80% 20%;
		gap: 10px;
	}
	.message.user {
		color: white;
	}
	input {
		margin-bottom: 10px;
	}
</style>
