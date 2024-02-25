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
      console.log('Login successful');
    } else {
        console.log('Login not working');
      // Handle error
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div>
    <label for="email">Email</label>
    <input type="email" id="email" bind:value={email} required />
    <p>Enter your email address.</p>
  </div>
  <div>
    <label for="password">Password</label>
    <input type="password" id="password" bind:value={password} required />
    <p>Enter your password.</p>
  </div>
  <button type="submit">Login</button>
</form>
