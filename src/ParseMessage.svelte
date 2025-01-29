<script lang="ts">
	import { Remarkable } from "remarkable";
	import Expandable from "./Expandable.svelte";

	const md = new Remarkable();

	const parseContent = (text: string) => {
		return md.render(text);
	};

	let { content }: { content: string } = $props();

	let prasedMsg = $derived.by(() => {
		let splitContent = content.split("\n");
		let accumulate = false;
		let thoughtsAcc = [];
		let i = 0;
		for (i; i < splitContent.length; i++) {
			const element = splitContent[i];
			if (element.includes("<think>")) {
				accumulate = true;
			}

			if (accumulate) {
				thoughtsAcc.push(element);
			}

			if (element.includes("</think>")) {
				accumulate = false;
				i++;
				break;
			}
		}

		let rest = [];
		for (i; i < splitContent.length; i++) {
			const element = splitContent[i];
			rest.push(element);
		}
		console.log(thoughtsAcc);
		console.log(rest);
		return {
			thoughts: thoughtsAcc
				.join("\n")
				.replace("<think>", "")
				.replace("</think>", ""),
			rest: rest.join("\n"),
		};
	});
</script>

<div>
	<Expandable title="Thought process">
		{prasedMsg.thoughts}
	</Expandable>

	{@html parseContent(prasedMsg.rest)}
</div>
