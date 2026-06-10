<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";
import { useAuthSession } from "~/composables/core/useAuthSession";
import Logo from "~/components/Logo.vue";
const $as = useAuthSession();
const $rc = useRuntimeConfig();

const navigationItems = ref<NavigationMenuItem[]>([
	{
		label: "About",
		to: "/about",
	},
]);

const userDropdownMenuItems: DropdownMenuItem[][] = [
	[
		{
			label: "Dashboard",
			icon: "i-lucide-layout-dashboard",
			to: "/dashboard",
		},
	],
	[
		{
			label: "Sign Out",
			icon: "i-lucide-log-out",
			async onSelect() {
				await $as.clear();
			},
			color: "error",
		},
	],
];
</script>

<template>
	<UHeader>
		<template #left>
			<NuxtLink to="/" class="flex items-center justify-center gap-1.5 select-none">
				<Logo class="h-8 w-auto shrink-0"/>
				<span class="text-xl font-brand text-highlighted">{{$rc.public.siteName}}</span>
			</NuxtLink>
		</template>
		<UNavigationMenu
			:items="navigationItems"
			arrow
			content-orientation="vertical"
			orientation="horizontal"
		/>
		<template #right>
			<UColorModeButton class="text-muted hover:text-highlighted" aria-label="Toggle Color Mode" />
			<UtilityAuthState v-slot="{ loggedIn, user }">
				<UButton v-if="!loggedIn" label="Sign In" to="/signin" />
				<template v-else>
					<UDropdownMenu
						:items="[
							[
								{
									label: 'Dashboard',
									to: '/dashboard',
									icon: 'i-lucide-layout-dashboard',
								},
							],
							[
								{
									label: 'Sign Out',
									icon: 'i-lucide-log-out',
									async onSelect() {
										await $as.clear();
									},
									color: 'error',
								},
							],
						]"
					>
						<UButton
							:avatar="{
								src: user?.image || undefined,
								icon: 'i-lucide-user',
							}"
							variant="ghost"
							square
						/>
					</UDropdownMenu>
				</template>
			</UtilityAuthState>
		</template>
	</UHeader>
</template>

<style scoped></style>
