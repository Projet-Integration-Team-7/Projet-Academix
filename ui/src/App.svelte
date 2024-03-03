<script>
  import Router from "./routes/index.svelte";
  let dark;
</script>

<main class="bg-gray-900 text-white mb-50">
  <div>
    <img
      src="img/academixLogo.png"
      alt="Academix Logo"
      class="w-500 h-1000 mr-4"
    />
    <h1 class="text-4xl font-bold mb-8">Academix</h1>
  </div>
  <Router />

  
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 300;
    
    margin: 0 auto;
  }
</style>
