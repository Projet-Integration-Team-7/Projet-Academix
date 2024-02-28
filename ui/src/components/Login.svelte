<!-- Login.svelte -->
<script>
  import { post } from "../lib/api";
  import { navigate } from "svelte-routing";

  let email = "";
  let password = "";

  async function handleSubmit() {
    const response = await post("/user/login", { email, password });

    if (response.ok) {
      navigate("/user/account");
      console.log("Login successful");
    } else {
      console.log("Login not working");
      // Handle error
    }
  }
</script>
<!-- flex m-auto mt-5 bg-[#f3f1f1] rounded-lg border-[#dcdcdc] text-center h-80 w-96 -->
<div class="flex h-auto w-3/12 m-auto pb-20 bg-neutral-500 rounded-md shadow-2xl align-middle">
  <form
    on:submit|preventDefault={handleSubmit}
    class="w-full max-w-sm mx-auto mt-20"
  >
    <div class="mb-4">
      <label for="email" class="block text-gray-500 text-sm font-bold mb-2"
        >Email</label
      >
      <input
        type="email"
        id="email"
        bind:value={email}
        required
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <p class="text-gray-600 text-xs italic">Enter your email address.</p>
    </div>
    <div class="mb-6">
      <label for="password" class="block text-gray-700 text-sm font-bold mb-2"
        >Password</label
      >
      <input
        type="password"
        id="password"
        bind:value={password}
        required
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
      />
      <p class="text-gray-600 text-xs italic">Enter your password.</p>
    </div>
    <button
      type="submit"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >Login</button
    >
  </form>
</div>
