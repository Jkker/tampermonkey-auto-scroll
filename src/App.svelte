<script lang="ts">
	import ArrowBackIcon from './icons/ArrowBack.svg';
	import SettingsIcon from './icons/Settings.svg';
	import StopIcon from './icons/Stop.svg';
	import AutoScrollIcon from './icons/Unfold.svg';
	import ClearIcon from './icons/Clear.svg';
	import CheckIcon from './icons/Check.svg';
	import CloseIcon from './icons/Close.svg';

	const getLastElementByText = (text: string) => {
		const iter = document.evaluate(
			`//*[contains(text(),"${text}")]`,
			document,
			null,
			XPathResult.ORDERED_NODE_ITERATOR_TYPE,
			null
		);
		let curr, prev;
		try {
			curr = iter.iterateNext();
			while (curr) {
				prev = curr;
				curr = iter.iterateNext();
			}
		} catch (e) {
			console.error(`Auto Scroll Button Error: Document tree modified during iteration ${e}`);
		}
		return prev;
	};

	let menuOpen = false;
	const toggleMenu = () => (menuOpen = !menuOpen);

	let settingsOpen = false;
	const toggleSettings = () => (settingsOpen = !settingsOpen);

	let inputValue = '';
	let untilTarget;
	const clearScrollUntilCondition = () => (untilTarget = undefined);
	const activateScrollUntilCondition = () => {
		untilTarget = inputValue;
		toggleSettings();
	};
	const onInput = () => {
		untilTarget = undefined;
	};

	let lastFound = null;

	function checkStopCondition() {
		if (!untilTarget) return false;
		const last = getLastElementByText(untilTarget);
		if (!last) return false;
		if (last !== lastFound) {
			lastFound = last;
			(last as HTMLElement).scrollIntoView();
			return true;
		} else {
			return false;
		}
	}

	const scroll = () => {
		if (checkStopCondition()) {
			cancelCurrentScroll();
			return;
		}
		window.scroll({
			top: document.body.scrollHeight,
			left: 0,
			behavior: 'smooth',
		});
	};

	const resizeObserver = new ResizeObserver(() => setTimeout(scroll, 100));
	let intervalId;

	type ScrollType = 'resize' | 'interval';
	let scrolling: ScrollType | false = false;

	const startScroll = (type: ScrollType, interval: number = 1000) => {
		if (type === 'resize') resizeObserver.observe(document.body);
		else if (type === 'interval') intervalId = setInterval(scroll, interval);
		scrolling = type;
		menuOpen = !menuOpen;
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

	const styles = {
		button:
			'height: 40px; padding: 8px; display: flex; justify-content: center; align-items: center; border: none; outline: none; background: transparent; cursor: pointer; color: white',
		menu: 'position: fixed; bottom: 62px; left: 6px; background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); padding: 8px; border-radius: 8px; padding-bottom: 12px;',
		inputLabel: 'color: white; font-size: 15px',
		inputContainer: 'display: flex; position: relative; margin-top: 8px',
		input:
			'height: 24px; border: 1px solid white; outline: none; background: transparent; border-radius: 4px; padding-left: 4px; padding-right: 32px; color: white',
		inputButton:
			'height: 100%; width: 28px; padding: 8px; display: flex; justify-content: center; align-items: center; border: none; outline: none; cursor: pointer; position: absolute; top: 0; right: 0; border-left: 1px solid white; background: transparent',
		container:
			'position: fixed; bottom: 16px;  z-index: 99999999; background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); display: flex; border-radius: 0 20px 20px 0;',
	};
</script>

<div>
	<div style={styles.container + `left: ${menuOpen ? '0' : '-8px'};`}>
		{#if menuOpen}
			<button on:click={toggleSettings} style={styles.button}>
				<img src={settingsOpen ? CloseIcon : SettingsIcon} alt="Settings" />
			</button>
			<button on:click={toggleScroll('resize')} style={styles.button}>Auto</button>
			<button on:click={toggleScroll('interval', 500)} style={styles.button}>500ms</button>
			<button on:click={toggleScroll('interval', 1500)} style={styles.button}>1.5s</button>
		{/if}
		<button on:click={scrolling ? cancelCurrentScroll : toggleMenu} style={styles.button}>
			<img src={scrolling ? StopIcon : menuOpen ? ArrowBackIcon : AutoScrollIcon} alt="Logo" />
		</button>
	</div>
	{#if menuOpen && settingsOpen}
		<div style={styles.menu}>
			<label style={styles.inputLabel} for="auto-scroll-wait-until-element-input"
				>Stop scrolling if</label
			>
			<div style={styles.inputContainer}>
				<!-- svelte-ignore a11y-autofocus -->
				<input
					id="auto-scroll-wait-until-element-input"
					bind:value={inputValue}
					on:change={activateScrollUntilCondition}
					on:input={onInput}
					on:keypress={(e) => {
						if (e.key === 'Enter') activateScrollUntilCondition();
					}}
					style={styles.input}
					autofocus
					placeholder="text appears"
				/>
				<button
					on:click={untilTarget ? clearScrollUntilCondition : activateScrollUntilCondition}
					style={styles.inputButton}
				>
					<img src={untilTarget ? ClearIcon : CheckIcon} alt="Clear input" />
				</button>
				<!-- prettier-ignore -->
				<style>
				#auto-scroll-wait-until-element-input::placeholder{color:rgba(255, 255, 255, 0.8);}
				</style>
			</div>
		</div>
	{/if}
</div>
