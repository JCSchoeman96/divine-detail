<script lang="ts">
  import './layout.css';
  import { page } from '$app/state';
  import Menu from '@lucide/svelte/icons/menu';
  import Instagram from '@lucide/svelte/icons/instagram';
  import MessageCircle from '@lucide/svelte/icons/message-circle';
  import { Button } from '$lib/components/ui/button/index.js';
  import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
    SheetDescription,
  } from '$lib/components/ui/sheet/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import ThemeToggle from '$lib/components/theme-toggle.svelte';

  let { children } = $props();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ] as const;

  let mobileOpen = $state(false);
</script>

<svelte:head>
  <meta name="robots" content="index,follow" />
  <meta name="author" content="Divine Detail" />
</svelte:head>

<div class="min-h-dvh flex flex-col">
  <!-- Header -->
  <header class="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
    <div class="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
      <!-- Brand -->
      <a href="/" class="text-lg font-semibold tracking-tight">Divine Detail</a>

      <!-- Desktop nav -->
      <nav aria-label="Primary" class="hidden items-center gap-6 text-sm font-medium md:flex">
        {#each navLinks as link}
          <a
            href={link.href}
            class="transition-colors hover:text-foreground/80 {page.url.pathname === link.href ? 'text-foreground' : 'text-muted-foreground'}"
          >
            {link.label}
          </a>
        {/each}
      </nav>

      <!-- Desktop right side -->
      <div class="hidden items-center gap-2 md:flex">
        <ThemeToggle />
        <Button href="https://wa.me/" size="sm">Book on WhatsApp</Button>
      </div>

      <!-- Mobile right side -->
      <div class="flex items-center gap-2 md:hidden">
        <ThemeToggle />
        <Sheet bind:open={mobileOpen}>
          <SheetTrigger>
            {#snippet child({ props })}
              <Button variant="ghost" size="icon-sm" aria-label="Open menu" {...props}>
                <Menu class="size-5" />
              </Button>
            {/snippet}
          </SheetTrigger>
          <SheetContent side="right" class="w-72">
            <SheetHeader>
              <SheetTitle>Divine Detail</SheetTitle>
              <SheetDescription class="sr-only">Navigation menu</SheetDescription>
            </SheetHeader>
            <nav aria-label="Mobile" class="mt-6 flex flex-col gap-4">
              {#each navLinks as link}
                <SheetClose>
                  {#snippet child({ props })}
                    <a
                      href={link.href}
                      class="text-sm font-medium transition-colors hover:text-foreground/80 {page.url.pathname === link.href ? 'text-foreground' : 'text-muted-foreground'}"
                      {...props}
                    >
                      {link.label}
                    </a>
                  {/snippet}
                </SheetClose>
              {/each}
              <Separator />
              <Button href="https://wa.me/" size="sm" class="w-full">Book on WhatsApp</Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>

  <!-- Main content -->
  <main class="flex-1">
    {@render children()}
  </main>

  <!-- Footer -->
  <footer class="border-t">
    <div class="mx-auto max-w-5xl px-4 py-8">
      <div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <!-- Brand + location -->
        <div>
          <p class="font-semibold tracking-tight">Divine Detail</p>
          <p class="mt-1 text-sm text-muted-foreground">Pretoria, Gauteng</p>
        </div>

        <!-- Secondary nav -->
        <nav aria-label="Footer" class="flex gap-6 text-sm text-muted-foreground">
          {#each navLinks.filter((l) => l.href !== '/') as link}
            <a href={link.href} class="transition-colors hover:text-foreground">{link.label}</a>
          {/each}
        </nav>

        <!-- Socials -->
        <div class="flex items-center gap-3">
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            class="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Instagram class="size-5" />
          </a>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            class="text-muted-foreground transition-colors hover:text-foreground"
          >
            <MessageCircle class="size-5" />
          </a>
        </div>
      </div>

      <Separator class="my-6" />

      <p class="text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Divine Detail. All rights reserved.
      </p>
    </div>
  </footer>
</div>
