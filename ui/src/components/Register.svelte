<!-- Register.svelte -->
<script>
    import { post } from '../lib/api';
    import { navigate } from 'svelte-routing';
  
    let username = '';
    let email = '';
    let password = '';
  
    async function handleSubmit() {
      const response = await post('/user/register', { username, email, password });
  
      if (response.ok) {
        navigate('/user/login');
      } else {
        // Handle error
      }
    }
  </script>
  
  <form on:submit|preventDefault="{handleSubmit}">
    <div>
      <label for="username">Username</label>
      <input type="text" id="username" bind:value="{username}" required>
      <p>Enter your desired username.</p>
    </div>
    <div>
      <label for="email">Email</label>
      <input type="email" id="email" bind:value="{email}" required>
      <p>Enter your email address.</p>
    </div>
    <div>
      <label for="password">Password</label>
      <input type="password" id="password" bind:value="{password}" required>
      <p>Enter a password.</p>
    </div>
    <button type="submit">Register</button>
  </form>
  