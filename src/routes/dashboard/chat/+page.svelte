<script lang="ts">
	import ChatMessage from '$lib/components/chat/ChatMessage.svelte';

	let messages: Array<{ role: 'user' | 'assistant'; content: string }> = $state([]);
	let input = $state('');
	let loading = $state(false);
	let error = $state('');
	let messagesContainer: HTMLDivElement;

	function scrollToBottom() {
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	}

	async function sendMessage() {
		const trimmed = input.trim();
		if (!trimmed || loading) return;

		error = '';
		const userMessage = { role: 'user' as const, content: trimmed };
		messages = [...messages, userMessage];
		input = '';
		loading = true;

		messages = [...messages, { role: 'assistant' as const, content: '' }];

		setTimeout(scrollToBottom, 0);

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: messages.slice(0, -1) })
			});

			if (!res.ok) {
				const text = await res.text();
				throw new Error(text || `Error: ${res.status}`);
			}

			const reader = res.body?.getReader();
			const decoder = new TextDecoder();

			if (!reader) throw new Error('No response stream');

			let assistantContent = '';

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value, { stream: true });
				assistantContent += chunk;

				messages = [
					...messages.slice(0, -1),
					{ role: 'assistant', content: assistantContent }
				];
				setTimeout(scrollToBottom, 0);
			}
		} catch (err: any) {
			error = err.message || 'Something went wrong. Please try again.';
			if (messages.at(-1)?.content === '') {
				messages = messages.slice(0, -1);
			}
		} finally {
			loading = false;
			setTimeout(scrollToBottom, 0);
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}
</script>

<svelte:head>
	<title>AI Chat — AuthFlow</title>
</svelte:head>

<div class="flex flex-col h-[calc(100vh-6rem)]">
	<!-- Header -->
	<div class="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
		<div class="flex items-center gap-4">
			<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
				</svg>
			</div>
			<div>
				<h1 class="text-xl font-bold text-gray-900">AI Assistant</h1>
				<div class="flex items-center gap-2 mt-0.5">
					<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
					<p class="text-gray-500 text-xs">Powered by Google Gemini — Online</p>
				</div>
			</div>
		</div>
		{#if messages.length > 0}
			<button
				onclick={() => { messages = []; error = ''; }}
				class="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 px-4 py-2 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition"
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
					<path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
				</svg>
				Clear
			</button>
		{/if}
	</div>

	<!-- Messages area -->
	<div
		bind:this={messagesContainer}
		class="flex-1 overflow-y-auto rounded-2xl p-5 space-y-5 mb-4 bg-white border-2 border-gray-200 shadow-inner"
	>
		{#if messages.length === 0}
			<div class="flex flex-col items-center justify-center h-full text-center px-4">
				<div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-blue-500">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">How can I help you?</h2>
				<p class="text-gray-400 text-sm max-w-sm mb-8">Ask me anything — from coding questions to creative writing. I'm powered by Google Gemini and ready to assist.</p>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
					<button
						onclick={() => { input = 'Explain how authentication works in web apps'; sendMessage(); }}
						class="text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition group"
					>
						<div class="flex items-center gap-3 mb-1.5">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-blue-500">
								<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
							</svg>
							<span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Learn</span>
						</div>
						<p class="text-sm text-gray-700 group-hover:text-black transition">Explain how authentication works in web apps</p>
					</button>
					<button
						onclick={() => { input = 'Write a JavaScript function to validate an email address'; sendMessage(); }}
						class="text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition group"
					>
						<div class="flex items-center gap-3 mb-1.5">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-purple-500">
								<path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
							</svg>
							<span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Code</span>
						</div>
						<p class="text-sm text-gray-700 group-hover:text-black transition">Write a JS function to validate email addresses</p>
					</button>
					<button
						onclick={() => { input = 'What are the best practices for database security?'; sendMessage(); }}
						class="text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition group"
					>
						<div class="flex items-center gap-3 mb-1.5">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-green-500">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
							</svg>
							<span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Security</span>
						</div>
						<p class="text-sm text-gray-700 group-hover:text-black transition">Best practices for database security</p>
					</button>
					<button
						onclick={() => { input = 'Help me write a professional bio for my portfolio'; sendMessage(); }}
						class="text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition group"
					>
						<div class="flex items-center gap-3 mb-1.5">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-amber-500">
								<path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
							</svg>
							<span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Write</span>
						</div>
						<p class="text-sm text-gray-700 group-hover:text-black transition">Help me write a professional portfolio bio</p>
					</button>
				</div>
			</div>
		{:else}
			{#each messages as message, i}
				<ChatMessage role={message.role} content={message.content} loading={loading && i === messages.length - 1} />
			{/each}
		{/if}
	</div>

	<!-- Error display -->
	{#if error}
		<div class="mb-3 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-red-600">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
					</svg>
				</div>
				<p class="text-red-700 text-sm">{error}</p>
			</div>
			<button onclick={() => error = ''} class="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-100 transition" aria-label="Dismiss error">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
	{/if}

	<!-- Input area -->
	<div class="bg-white border border-gray-200 rounded-2xl shadow-lg p-2 flex items-end gap-2">
		<textarea
			bind:value={input}
			onkeydown={handleKeydown}
			placeholder="Message AI Assistant..."
			rows="1"
			class="flex-1 border border-gray-300 bg-white rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-400"
			aria-label="Chat message input"
		></textarea>
		<button
			onclick={sendMessage}
			disabled={loading || !input.trim()}
			class="bg-black text-white p-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
			aria-label="Send message"
		>
			{#if loading}
				<svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
				</svg>
			{/if}
		</button>
	</div>
</div>
