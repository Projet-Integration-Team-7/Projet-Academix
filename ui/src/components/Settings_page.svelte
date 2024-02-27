<script>
  import { Link } from "svelte-routing";
</script>

<div class="container mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg">
  <h3 class="text-2xl font-bold mb-4">Settings</h3>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div
      class="bg-gray-800 rounded-lg shadow-md p-4 transition-opacity duration-500 opacity-0 hover:opacity-100 flex items-center"
    >
      <div
        class="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mr-4 animate-bounce"
      >
        <img
          src="img/avatar_benzo.png"
          alt="Avatar"
          class="w-20 h-20 rounded-full"
        />
      </div>
      <div class="text-container" style="margin-left: 20px;">
        <h4 class="text-lg font-semibold mb-2">Profile</h4>
        <p class="mb-2">Name: Benzo BG</p>
        <p class="mb-2">Email: jesuisgros@gmail.com</p>
        <p class="mb-2">
          Bio: Membre et fondateur du regrouppement des celibataires endurcies.
        </p>
        <Link
          to="/settings/profile"
          class="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition duration-300"
          >Edit Profile</Link
        >
      </div>
    </div>
    <div
      class="bg-gray-800 rounded-lg shadow-md p-4 transition-opacity duration-500 opacity-0 hover:opacity-100 flex items-center"
    >
      <div
        class="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mr-4 animate-bounce"
      >
        <img
          src="img/avatar_benzo.png"
          alt="Avatar"
          class="w-20 h-20 rounded-full"
        />
      </div>
      <div class="text-container" style="margin-left: 20px;">
        <h4 class="text-lg font-semibold mb-2">Compte</h4>
        <p class="mb-2">Username: Benzo</p>
        <p class="mb-2">Password: ********</p>
        <Link
          to="/settings/account"
          class="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition duration-300"
          >Change Password</Link
        >
      </div>
    </div>
  </div>
</div>

<style scoped>
  .container {
    padding: 2rem;
  }
</style>
