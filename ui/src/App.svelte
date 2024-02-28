<script>
  import Router from "./routes/index.svelte";
</script>

<main class="bg-gray-900 text-white font-sans h-screen">
  <img src="./ui/public/img/logo_blanc.png" alt="Academix Logo en blanc" />
  <h1 class="text-4xl font-bold mb-8">Academix</h1>
  <Router />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
</style>
