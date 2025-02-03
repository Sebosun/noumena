<script lang="ts">
	let { children, isLoading }: { children?: any; isLoading: boolean } =
		$props();
</script>

<div class="wrapper">
	{#if isLoading}
		<div class="loader"></div>
	{:else}
		{@render children?.()}
	{/if}
</div>

<style>
	.wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60%;
	}
	/* https://css-loaders.com/hypnotic/ */
	.loader {
		width: 50px;
		aspect-ratio: 1.154;
		display: grid;
		color: var(--text-normal);
		background:
			linear-gradient(
					to bottom left,
					#0000 calc(50% - 1px),
					currentColor 0 calc(50% + 1px),
					#0000 0
				)
				right/50% 100%,
			linear-gradient(
					to bottom right,
					#0000 calc(50% - 1px),
					currentColor 0 calc(50% + 1px),
					#0000 0
				)
				left / 50% 100%,
			linear-gradient(currentColor 0 0) bottom/100% 2px;
		background-repeat: no-repeat;
		transform-origin: 50% 66%;
		animation: l5 4s infinite linear;
	}
	.loader::before,
	.loader::after {
		content: "";
		grid-area: 1/1;
		background: inherit;
		transform-origin: inherit;
		animation: inherit;
	}
	.loader::after {
		animation-duration: 2s;
	}
	@keyframes l5 {
		100% {
			transform: rotate(1turn);
		}
	}
</style>
