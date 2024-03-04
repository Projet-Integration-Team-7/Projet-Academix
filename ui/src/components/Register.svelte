<script>
  import { post } from "../lib/api";
  import { navigate } from "svelte-routing";

  let username = "";
  let email = "";
  let password = "";

  async function handleSubmit() {
    const response = await post("/user/register", {
      username,
      email,
      password,
    });

    if (response.ok) {
      navigate("/user/login");
    } else {
      // Handle error
    }
  }
</script>

<div class="container mx-auto p-4 bg-white rounded shadow-lg">
  <h2 class="text-2xl font-bold text-center mb-4">Create an account</h2>
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="username" class="block font-semibold text-gray-700"
        >Username</label
      >
      <input
        id="username"
        name="username"
        type="text"
        autocomplete="username"
        required
        placeholder="Username"
        class="input-field"
        bind:value={username}
      />
    </div>
    <div>
      <label for="email" class="block font-semibold text-gray-700"
        >Email address</label
      >
      <input
        id="email"
        name="email"
        type="email"
        autocomplete="email"
        required
        placeholder="Email address"
        class="input-field"
        bind:value={email}
      />
    </div>
    <div>
      <label for="password" class="block font-semibold text-gray-700"
        >Password</label
      >
      <input
        id="password"
        name="password"
        type="password"
        autocomplete="current-password"
        required
        placeholder="Password"
        class="input-field"
        bind:value={password}
      />
    </div>
    <div>
      <button type="submit" class="submit-button text-gray-700"
        >Create an account</button
      >
    </div>
  </form>
</div>
