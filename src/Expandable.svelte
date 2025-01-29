<script lang="ts">
	let isExpanded = $state(false);

	const onHeaderClick = () => {
		isExpanded = !isExpanded;
	};

	let { children, title } = $props();
</script>

<div class="expandable" role="none" onclick={onHeaderClick}>
	<div class="expandable__header">
		{title}

		<div>
			{#if isExpanded}
				-
			{:else}
				+
			{/if}
		</div>
	</div>
	{#if isExpanded}
		<hr />
		{@render children?.()}
		<hr />
	{/if}
</div>

<style>
	.expandable {
		margin-top: 4px;
		margin-left: 10px;
		padding: 4px 10px;
		border-radius: 10px;
		color: var(--fg);
		background-color: var(--bg-dim);
	}

	.expandable__header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 4px;
	}
</style>
