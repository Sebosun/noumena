import { ItemView, WorkspaceLeaf } from 'obsidian';

// Import the Counter Svelte component and the `mount` and `unmount` methods.
import Chat from './Chat.svelte';
import { mount } from 'svelte';
import type NoumenaPlugin from 'main';
import { unmount } from 'svelte';

export const VIEW_TYPE_EXAMPLE = 'noumena';

export class ChatView extends ItemView {
	public chat: ReturnType<typeof mount>;
	constructor(leaf: WorkspaceLeaf, private plugin: NoumenaPlugin) {
		super(leaf);
		this.plugin = plugin
		this.icon = 'origami'
	}


	getViewType() {
		return VIEW_TYPE_EXAMPLE;
	}

	getDisplayText() {
		return 'Noumena';
	}


	async onOpen() {
		const action = this.plugin.state.action
		const summaryArticle = this.plugin.state.documentToSummarize

		this.chat = mount(Chat, {
			target: this.contentEl,
			props: {
				action: action,
				summaryDoc: summaryArticle,
				settings: this.plugin.settings
			}
		});
		this.plugin.state.action = ''
		this.plugin.state.documentToSummarize = ''
	}

	async onClose() {
		if (this.chat) {
			unmount(this.chat)
		}
	}
}
