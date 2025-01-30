<script lang="ts">
	import ollama, { type ModelResponse } from "ollama"; // Import the Ollama library
	import { onMount } from "svelte";
	import { type PluginSettings } from "../PluginSettings";

	let {
		saveSettings,
		userSettings,
	}: {
		saveSettings: (setting: string) => void;
		userSettings: Partial<PluginSettings>;
	} = $props();

	let models = $state<ModelResponse[]>([]);
	let modelSelected = $state<string>("");

	onMount(async () => {
		const listResponse = await ollama.list();
		models = listResponse.models;

		if (userSettings.model) {
			modelSelected = userSettings.model;
		}
	});

	function triggerSave() {
		saveSettings(modelSelected);
	}
</script>

<div class="settings_view">
	<h1>Noumena Settings</h1>
	<div class="flex-between">
		<label for="model">Change default model</label>
		<select bind:value={modelSelected} name="model" id="model">
			{#each models as mod}
				<option value={mod.name}>{mod.name}</option>
			{/each}
		</select>
	</div>
	<div class="flex-between">
		<button class="settings__button" onclick={triggerSave}>Save</button>
	</div>
</div>

<style>
	.settings_view {
		display: flex;
		flex-direction: column;
		align-items: space-between;
	}
	.flex-between {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}
	.settings__button {
		margin-left: auto;
		width: min-content;
	}
</style>
