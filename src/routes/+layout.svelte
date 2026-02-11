<script>
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <meta name="robots" content="index,follow" />
  <meta name="author" content="Divine Detail" />
</svelte:head>

<div class="min-h-dvh flex flex-col">
  <header class="border-b bg-background/80 backdrop-blur">
    <div class="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
      <a href="/" class="font-semibold tracking-tight">Divine Detail</a>

      <nav class="flex items-center gap-4 text-sm">
        <a class="hover:underline underline-offset-4" href="/services">Services & Pricing</a>
        <a class="hover:underline underline-offset-4" href="/contact">Contact</a>
      </nav>
    </div>
  </header>

  <main class="flex-1">
    {@render children()}
  </main>

  <footer class="border-t">
    <div class="mx-auto max-w-5xl px-4 py-6 text-sm text-muted-foreground">
      <p>© {new Date().getFullYear()} Divine Detail • Pretoria & surrounds</p>
    </div>
  </footer>
</div>
