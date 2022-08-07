<script lang="ts">
	import ArrowBackIcon from './icons/ArrowBack.svg';
	import SettingsIcon from './icons/Settings.svg';
	import StopIcon from './icons/Stop.svg';
	import AutoScrollIcon from './icons/Unfold.svg';
	import Button from './lib/Button.svelte';

	let open = false;
	function toggleMenu() {
		open = !open;
	}

	const scroll = () =>
		window.scroll({
			top: document.body.scrollHeight,
			left: 0,
			behavior: 'smooth',
		});

	const resizeObserver = new ResizeObserver(() => scroll());
	let intervalId;

	type ScrollType = 'resize' | 'interval';
	let scrolling: ScrollType | false = false;

	const startScroll = (type: ScrollType, interval: number = 1000) => {
		if (type === 'resize') resizeObserver.observe(document.body);
		else if (type === 'interval') intervalId = setInterval(scroll, interval);
		scrolling = type;
		open = !open;
	};
	const cancelScroll = (type: ScrollType) => {
		if (type === 'resize') resizeObserver.unobserve(document.body);
		else if (type === 'interval') clearInterval(intervalId);
		scrolling = false;
	};
	const cancelCurrentScroll = () => {
		if (scrolling) cancelScroll(scrolling);
	};
	const toggleScroll =
		(type: ScrollType, intervalSecond: number = 1000) =>
		() => {
			if (scrolling) {
				cancelScroll(type);
			} else {
				startScroll(type, intervalSecond);
			}
		};
</script>

<div
	style="position: fixed; bottom: 16px; left: 0; z-index: 99999999; background: #333333aa; backdrop-filter: blur(10px); display: flex; border-radius: 0 20px 20px 0"
>
	{#if open}
		<!-- <Button onClick={() => null}>
			<img src={SettingsIcon} alt="Settings" />
		</Button> -->
		<Button onClick={toggleScroll('resize')}>Auto</Button>
		<Button onClick={toggleScroll('interval', 500)}>500ms</Button>
		<Button onClick={toggleScroll('interval', 1500)}>1.5s</Button>
	{/if}
	<Button onClick={scrolling ? cancelCurrentScroll : toggleMenu}>
		<img src={scrolling ? StopIcon : open ? ArrowBackIcon : AutoScrollIcon} alt="Logo" />
	</Button>
</div>
