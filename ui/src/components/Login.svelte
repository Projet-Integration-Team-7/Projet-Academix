<!-- Login.svelte -->
<script>
  import { post } from "../lib/api";
  import { navigate } from "svelte-routing";
  import { Link } from "svelte-routing";

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
<div class="flex h-auto w-3/12 m-auto p-5 pt-8 rounded-xl shadow-2xl bg-gray-300">
  <div class="m-auto py-10 align-middle ">
    <form
      on:submit|preventDefault={handleSubmit}
      class="w-full max-w-sm mx-auto py-5 "
    >
      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2"
          >Email</label
        >
        <input
          type="email"
          id="email"
          bind:value={email}
          required
          class="shadow appearance-none border rounded w-full py-2 px-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <p class="text-gray-600 text-xs italic">Enter your email address.</p>
      </div>
      <div class="my-6">
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
        class=" mx-24 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 p-8 rounded focus:outline-none focus:shadow-outline "
        >Login</button
      >
    </form>
    <div class="m-auto mt-7 text-center font-bold text-gray-600">
      <span>No account ?</span>
      <br>
      <Link 
      to= "/register"
      class=" underline text-blue-700 hover:text-blue-900">
      Sign up here 
      </Link>
  </div>
  </div>
</div>
