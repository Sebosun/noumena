import { Plugin, WorkspaceLeaf, MarkdownView } from 'obsidian';
import { ChatView, VIEW_TYPE_EXAMPLE } from './src/NoumenaView';
import { SummarizeModal } from './SummarizeModal';

export default class NoumenaPlugin extends Plugin {
	// TODO: Type state

	public state = {
		action: "",
		documentToSummarize: ""
	}

	async onload() {
		this.registerView(
			VIEW_TYPE_EXAMPLE,
			(leaf) => new ChatView(leaf, this)
		);

		this.addRibbonIcon('origami', 'Open Ollama', () => {
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

				const dupa = this.app.workspace.getActiveViewOfType(MarkdownView);
				const doc = dupa?.editor.getDoc()
				const viewText = doc?.getValue();
				const message = "You are a good teacher. Help the student to understand the concept of the topic. Explain the topic in a simple way.";
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

		const leaves = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE);
		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for it
			leaf = workspace.getRightLeaf(false);
			await leaf?.setViewState({ type: VIEW_TYPE_EXAMPLE, active: true });
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}
}
