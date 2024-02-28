<script>
  import { Link } from "svelte-routing";
</script>

<div class="container mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg">
  <h3 class="text-2xl font-bold mb-4">Welcome to Academix</h3>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <Link
      to="/login"
      class="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition duration-300"
    >
      Login
    </Link>
    <Link
      to="/register"
      class="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition duration-300"
    >
      Register
    </Link>
    
    <Link
      to="/settings_page"
      class="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition duration-300"
    >
      Settings
    </Link>


    <Link
    to="/page_principal"
    class="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition duration-300"
   >
   Page_principal
   </Link>
   
  </div>
  
</div>

<style scoped>
  .container {
    padding: 2rem;
  }
</style>
