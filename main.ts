import { Plugin, WorkspaceLeaf, MarkdownView, App, PluginSettingTab, Setting } from 'obsidian';
import { ChatView, VIEW_TYPE_EXAMPLE } from './src/NoumenaView';
import Settings from './src/Settings.svelte';
import { mount } from 'svelte';
import { type PluginSettings, DEFAULT_SETTINGS } from './PluginSettings';


export default class NoumenaPlugin extends Plugin {

	settings: PluginSettings;

	public state = {
		action: "",
		documentToSummarize: ""
	}

	async onload() {
		this.loadSettings();
		this.addSettingTab(new NoumenaSettingsTab(this.app, this));

		this.registerView(
			VIEW_TYPE_EXAMPLE,
			(leaf) => new ChatView(leaf, this)
		);

		this.addRibbonIcon('origami', 'Open Noumena', () => {
			this.activateView();
		});


		this.addCommand({
			id: 'open-noumena',
			name: 'Open Noumena',
			callback: () => {
				this.activateView();
			}
		})

		this.addCommand({
			id: 'noumena-summarize-doc',
			name: 'Summarize current document',
			callback: () => {
				this.state.action = "summarize";

				const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
				const doc = activeView?.editor.getDoc()
				const viewText = doc?.getValue();
				if (!viewText) return

				this.state.documentToSummarize = viewText;
				this.activateView();
			}
		})

		this.addCommand({
			id: 'noumena-summarize-text',
			name: 'Summarize higlighted text',
			callback: () => {

				const dupa = this.app.workspace.getActiveViewOfType(MarkdownView);
				const doc = dupa?.editor.getSelection()
				const viewText = doc
				if (!viewText) return

				this.state.action = "summarize";
				this.state.documentToSummarize = viewText;
				this.activateView();
			}
		})

	}

	async onunload() {

	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;

		leaf = workspace.getRightLeaf(false);
		await leaf?.setViewState({ type: VIEW_TYPE_EXAMPLE, active: true });

		/* const leaves = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE); */
		/* if (leaves.length > 0) { */
		/* 	// A leaf with our view already exists, use that */
		/* 	leaf = leaves[0]; */
		/* } else { */
		/* 	// Our view could not be found in the workspace, create a new leaf */
		/* 	// in the right sidebar for it */
		/* 	leaf = workspace.getRightLeaf(false); */
		/* 	await leaf?.setViewState({ type: VIEW_TYPE_EXAMPLE, active: true }); */
		/* } */
		/**/
		/* // "Reveal" the leaf in case it is in a collapsed sidebar */
		/* if (leaf) { */
		/* 	workspace.revealLeaf(leaf); */
		/* } */
	}


	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


export class NoumenaSettingsTab extends PluginSettingTab {
	plugin: NoumenaPlugin;
	public chat: ReturnType<typeof mount>;

	constructor(app: App, plugin: NoumenaPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		const onSaveSettings = async (setting: string) => {
			this.plugin.settings.model = setting;
			await this.plugin.saveSettings();
		}

		this.chat = mount(Settings, {
			target: this.containerEl,
			props: {
				saveSettings: onSaveSettings,
				userSettings: this.plugin.settings
			}
		});
	}
}
