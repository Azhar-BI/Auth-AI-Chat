<script lang="ts">
	import { enhance } from "$app/forms";

	let { data, form } = $props();
	let sending = $state(false);
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
	<!-- Navbar -->
	<nav class="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
		<div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
			<a href="/" class="text-xl font-bold tracking-tight">
				<span class="text-black">Auth</span><span class="text-gray-500">Flow</span>
			</a>
			<a href="/logout" class="text-sm text-gray-700 hover:text-black transition font-medium">
				Logout
			</a>
		</div>
	</nav>

	<!-- Content -->
	<div class="flex items-center justify-center min-h-screen pt-20 px-4">
		<div class="w-full max-w-md animate-[fadeInUp_0.5s_ease-out]">
			<div class="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-200 text-center">
				<div
					class="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-8 h-8 text-amber-600"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
						/>
					</svg>
				</div>

				<div class="mb-5 p-3 bg-green-50 border border-green-200 rounded-xl">
					<p class="text-green-700 text-sm font-medium">Account created successfully!</p>
				</div>

				<h1 class="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
				<p class="text-gray-500 mb-2">
					We sent a verification link to
				</p>
				<p class="font-medium text-gray-900 mb-6">{data.email}</p>
				<p class="text-gray-500 text-sm mb-8">
					Please check your inbox and click the link to verify your email before accessing the
					dashboard.
				</p>

				{#if form?.sent}
					<div class="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl">
						<p class="text-green-700 text-sm font-medium">Verification email sent! Check your inbox.</p>
					</div>
				{/if}

				<form
					method="POST"
					action="?/resend"
					use:enhance={() => {
						sending = true;
						return async ({ update }) => {
							sending = false;
							await update();
						};
					}}
				>
					<button
						type="submit"
						disabled={sending}
						class="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium text-sm disabled:opacity-50"
					>
						{sending ? "Sending..." : "Resend Verification Email"}
					</button>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
