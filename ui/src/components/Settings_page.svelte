<script>
  import { Link } from "svelte-routing";
</script>

<div class="container mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg">
  <h3 class="text-2xl font-bold mb-4">Settings</h3>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="bg-gray-800 rounded-lg shadow-md p-4">
      <h4 class="text-lg font-semibold mb-2">Profile</h4>
      <p class="mb-2">Name: John Doe</p>
      <p class="mb-2">Email: johndoe@example.com</p>
      <p class="mb-2">
        Bio: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
      <Link
        to="/settings/profile"
        class="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition duration-300"
        >Edit Profile</Link
      >
    </div>
    <div class="bg-gray-800 rounded-lg shadow-md p-4">
      <h4 class="text-lg font-semibold mb-2">Account</h4>
      <p class="mb-2">Username: johndoe</p>
      <p class="mb-2">Password: ********</p>
      <Link
        to="/settings/account"
        class="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition duration-300"
        >Change Password</Link
      >
    </div>
  </div>
</div>

<style scoped>
  .container {
    padding: 2rem;
  }
</style>
