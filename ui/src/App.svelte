<script>
  import Router from "./routes/index.svelte";
  let dark
</script>

<main class="bg-gray-900 text-white font-sans ">
  <div>
 <img src="img/academixLogo.png" alt="Academix Logo" class="w-20 h-20  mr-4" />
  <h1 class="text-4xl font-bold mb-8">Academix</h1>
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

