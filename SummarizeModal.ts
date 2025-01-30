import { Modal, App, MarkdownView } from 'obsidian';
import ollama, { type Message, type ModelResponse } from "ollama"; // Import the Ollama library
import { Remarkable } from "remarkable";

export class SummarizeModal extends Modal {
	public text: string = "";

	constructor(app: App) {
		super(app);
	}


	async onOpen() {
		const { contentEl } = this;
		this.app.workspace.getActiveViewOfType(MarkdownView);
		const dupa = this.app.workspace.getActiveViewOfType(MarkdownView);
		const doc = dupa?.editor.getDoc()

		const viewText = doc?.getValue();
		const message = "You are a good teacher. Help the student to understand the concept of the topic. Explain the topic in a simple way.";

		if (!viewText) {
			this.close()
			return;
		}

		const response = await ollama.chat({
			model: "deepseek-r1:7b",
			messages: [{
				role: "system",
				content: 'You are a good teacher. Help the student to understand the concept of the topic. Explain the topic in a simple way.'
			},
			{
				role: "user",
				content: viewText
			}
			],
			stream: true
		});


		for await (const part of response) {
			this.text += part.message.content
			contentEl.setText(this.text);
		}
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
