<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { signIn } from '@auth/sveltekit/client';

	let { data, form } = $props();

	let registered = $derived($page.url.searchParams.get('registered') === 'true');
	let reset = $derived($page.url.searchParams.get('reset') === 'true');
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
	<!-- Navbar -->
	<nav class="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
		<div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
			<a href="/" class="text-xl font-bold tracking-tight">
				<span class="text-black">Auth</span><span class="text-gray-500">Flow</span>
			</a>
			<div class="flex items-center gap-3">
				<span class="text-sm text-gray-500 hidden sm:inline">Don't have an account?</span>
				<a
					href="/register"
					class="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition font-medium"
				>
					Register
				</a>
			</div>
		</div>
	</nav>

	<!-- Two-column layout -->
	<div class="flex min-h-screen pt-16">
		<!-- Left brand panel (hidden on mobile) -->
		<div class="hidden md:flex md:w-[45%] lg:w-[42%] bg-gradient-to-br from-gray-900 to-black relative overflow-hidden items-center justify-center sticky top-0 h-screen">
			<div class="absolute inset-0 opacity-5">
				<div class="absolute top-20 left-10 w-40 h-40 border border-white rounded-full"></div>
				<div class="absolute bottom-32 right-8 w-64 h-64 border border-white rounded-full"></div>
				<div class="absolute top-1/2 left-1/3 w-20 h-20 border border-white rounded-full"></div>
			</div>
			<div class="absolute inset-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;1&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>

			<div class="relative z-10 px-12 lg:px-16 text-center">
				<div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/10">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-8 h-8">
						<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
					</svg>
				</div>
				<h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">Welcome Back</h2>
				<p class="text-gray-400 text-base lg:text-lg leading-relaxed max-w-sm mx-auto">
					Sign in to access your dashboard, manage your projects, and stay connected.
				</p>
				<div class="flex justify-center gap-2 mt-10">
					<span class="w-8 h-1 bg-white rounded-full"></span>
					<span class="w-8 h-1 bg-white/30 rounded-full"></span>
					<span class="w-8 h-1 bg-white/30 rounded-full"></span>
				</div>
			</div>
		</div>

		<!-- Right form panel -->
		<div class="w-full md:w-[55%] lg:w-[58%] flex items-center justify-center px-4 py-12 md:px-8 lg:px-16">
			<div class="w-full max-w-md">
				<div class="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-200">
					<div class="text-center mb-8">
						<div class="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mx-auto mb-5">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-7 h-7">
								<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
							</svg>
						</div>
						<h1 class="text-3xl font-bold text-gray-900">Welcome Back</h1>
						<p class="text-gray-500 text-sm mt-2">Login to your AuthFlow account.</p>
					</div>

					{#if registered}
						<div class="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-sm text-center mb-5">
							Account created! Please check your email to verify, then login.
						</div>
					{/if}

					{#if reset}
						<div class="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-sm text-center mb-5">
							Password reset successful! You can now login with your new password.
						</div>
					{/if}

					{#if data.hasUnverifiedSession}
						<div class="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
							<p class="text-amber-800 text-sm font-medium mb-1">You have an unverified account</p>
							<p class="text-amber-700 text-xs mb-3">Please verify your email or log out to use a different account.</p>
							<div class="flex gap-2">
								<a href="/verify-email-required" class="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-700 transition font-medium">Verify Email</a>
								<form method="POST" action="/logout" class="inline">
									<button type="submit" class="text-xs border border-amber-300 text-amber-800 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition font-medium">Log Out</button>
								</form>
							</div>
						</div>
					{:else}
						<!-- OAuth Buttons -->
						<div class="flex flex-col gap-3 mb-6">
							<button onclick={() => signIn('google', { redirectTo: '/dashboard' })} type="button"
								class="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-2.5 px-4 hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700">
								<svg class="w-5 h-5" viewBox="0 0 24 24">
									<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
									<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
									<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
									<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
								</svg>
								Sign in with Google
							</button>
							<button onclick={() => signIn('github', { redirectTo: '/dashboard' })} type="button"
								class="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-2.5 px-4 hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700">
								<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
								</svg>
								Sign in with GitHub
							</button>
						</div>
					{/if}

					<!-- Divider -->
					<div class="relative mb-6">
						<div class="absolute inset-0 flex items-center">
							<div class="w-full border-t border-gray-200"></div>
						</div>
						<div class="relative flex justify-center text-sm">
							<span class="bg-white px-4 text-gray-400">or continue with email</span>
						</div>
					</div>

				<form method="POST" action="?/credentials" class="flex flex-col gap-5" use:enhance>
						<div>
							<label for="email" class="block mb-1.5 text-sm font-medium text-gray-700">Email</label>
							<input id="email" name="email" type="email" required
								class="w-full border border-gray-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
								placeholder="you@example.com" />
						</div>

						<div>
							<label for="password" class="block mb-1.5 text-sm font-medium text-gray-700">Password</label>
							<input id="password" name="password" type="password" required
								class="w-full border border-gray-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
								placeholder="Enter your password" />
						</div>

						{#if form?.error}
							<div class="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm text-center">
								{form.error}
							</div>
						{/if}

						<button type="submit"
							class="bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium">
							Login
						</button>

						<div class="text-sm text-center text-gray-500">
							<a href="/forgot-password" class="text-black font-medium hover:underline">Forgot Password?</a>
						</div>

						<p class="text-sm text-center text-gray-500">
							Don't have an account?
							<a href="/register" class="text-black font-medium hover:underline">Register</a>
						</p>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
