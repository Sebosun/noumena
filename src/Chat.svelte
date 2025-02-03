<script lang="ts">
	import Loader from "./Loader.svelte";
	import type { ActionTypes } from "./ActionTypes";
	import ollama, { type ModelResponse } from "ollama"; // Import the Ollama library
	import ParseMessage from "./ParseMessage.svelte";
	import { type PluginSettings } from "../PluginSettings";
	import { onMount } from "svelte";

	let isLoading = $state(false);

	interface Props {
		action: ActionTypes;
		summaryDoc: string;
		settings: PluginSettings;
	}

	interface MessagesDisplay {
		role: "user" | "model" | "system" | "assistant";
		content: string;
		hide?: boolean;
	}

	let message = $state("");
	let messagesState = $state<MessagesDisplay[]>([]);
	let models = $state<ModelResponse[]>([]);
	let modelSelected = $state<string>("");

	let { action, summaryDoc, settings }: Props = $props();

	const sendMessage = async () => {
		try {
			isLoading = true
			const response = await ollama.chat({
				model: modelSelected,
				messages: messagesState,
				stream: true,
			});

			messagesState.push({ role: "model", content: "" });
			const lastMsg = messagesState.length - 1;

			// doing this to avoid the flickering of the loader
			for await (const part of response) {
			isLoading = false
				messagesState[lastMsg].content += part.message.content;
			}
		} catch (e) {
			console.error("Error communicating with Ollama:", e);
			messagesState = [
				...messagesState,
				{ role: "assistant", content: "Failed to get a response." },
			];
		} finally {
			isLoading = false
		}
	};

	const runSummarize = async () => {
		messagesState.push({
			role: "system",
			hide: true,
			content:
				"You are a good teacher. Help the student to understand the concept of this topic. Explain the topic in a simple way.",
		});
		messagesState.push({ role: "user", content: summaryDoc, hide: true });
		await sendMessage();

		action = "chat";
	};

	onMount(async () => {
		const listResponse = await ollama.list();
		models = listResponse.models;
		modelSelected = models[0].name;

		if (action === "summarize") {
			runSummarize();
		}

		if (settings.model) {
			modelSelected = settings.model;
		}
	});

	async function onKill() {
		ollama.abort();
	}

	async function submit(event: SubmitEvent | KeyboardEvent) {
		event.preventDefault();

		if (message.trim()) {
			messagesState.push({ role: "user", content: message });
			message = "";
			sendMessage();
		}
	}
</script>

<div class="chat-view">
	<div class="chat-view__models">
		<label for="model"> Change your model </label>
		<select bind:value={modelSelected} name="model" id="model">
			{#each models as mod}
				<option value={mod.name}>{mod.name}</option>
			{/each}
		</select>

		<button onclick={() => (messagesState = [])}>Reset</button>
		<button onclick={onKill}>Kill</button>
	</div>
	<div class="messages">
		{#each messagesState as msg}
			{#if msg.role === "user" && msg.hide != true}
				<div class="message {msg.role}">
					<strong>You</strong>
					{msg.content}
				</div>
			{:else if msg.role === "model" && msg.hide != true}
				<div class="message {msg.role}">
					<strong>Chat</strong>
					<ParseMessage content={msg.content} />
				</div>
			{/if}
		{/each}
		<Loader isLoading={isLoading} />
	</div>
	<div>
		<form class="message__wrapper" onsubmit={submit}>
			<textarea
				disabled={isLoading}
				class="message__input"
				bind:value={message}
				placeholder="Type a message..."
				onkeydown={(e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						submit(e);
					}
				}}
			></textarea>
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
</style>
