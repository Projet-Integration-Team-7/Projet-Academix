<!-- index.svelte -->
<script>
  import { Router, Route } from "svelte-routing";
  import Home from "../components/Home.svelte";
  import Settings_page from "../components/Settings_page.svelte";
  import Login from "../components/Login.svelte";
  import Register from "../components/Register.svelte";
</script>

<Router>
  <div>
    <Route path="/" component={Home} />
    <Route path="/login" component={Login} />
    
    <Route path="/register" component={Register} />
    <Route path="/settings_page" component={Settings_page} />
  </div>
</Router>
