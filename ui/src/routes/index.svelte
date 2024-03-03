<!-- index.svelte -->
<script>
  import { Router, Route } from "svelte-routing";
  import Home from "../components/Home.svelte";
  import Settings_page from "../components/Settings_page.svelte";
  import Login from "../components/Login.svelte";
  import Register from "../components/Register.svelte";
  import Page_principal from "../components/Page_principal.svelte";
</script>

<Router>
  <div>
    <Route path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/page_principal" component={Page_principal} />
    <Route path="/register" component={Register} />
    <Route path="/settings_page" component={Settings_page} />
  </div>
</Router>
