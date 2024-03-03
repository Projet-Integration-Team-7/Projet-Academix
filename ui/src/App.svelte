<script>
  import Router from "./routes/index.svelte";
  let dark
</script>


<main class="bg-gray-900 text-white font-sans h-screen ">
  <div class="flex m-5 p-5 space-x-5 items-center align-middle">
    <img src="img/logo_blanc.png" alt="Academix Logo en blanc " class="w-20 h-auto ">
    <h1 class="text-4xl font-bold">Academix</h1>
  </div>

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

