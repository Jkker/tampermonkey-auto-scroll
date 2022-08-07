<script lang="ts">
	export let onClick;
</script>

<button
	on:click={onClick}
	style="height: 40px; padding: 8px; display: flex; justify-content: center; align-items: center; border: none; outline: none; background: transparent; cursor: pointer;"
>
	<slot />
</button>
