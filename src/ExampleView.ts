import { ItemView, WorkspaceLeaf } from 'obsidian';

// Import the Counter Svelte component and the `mount` and `unmount` methods.
import Chat from './Chat.svelte';
import { mount } from 'svelte';

export const VIEW_TYPE_EXAMPLE = 'example-view';

export class ChatView extends ItemView {

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_EXAMPLE;
	}

	getDisplayText() {
		return 'Example view';
	}

	async onOpen() {
		mount(Chat, {
			target: this.contentEl,
		});

	}
}
