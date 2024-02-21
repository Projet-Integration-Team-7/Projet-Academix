<script>
  import { Router, Route } from "svelte-routing";
  import Home from "../components/Home.svelte";
  import About from "../components/About.svelte";
  import Blog from "../components/Blog.svelte";
  import SettingsPage from "../components/Settingspage.svelte";

  export let url = "";
</script>

<Router {url}>
  <div>
    <Route path="blog" component={Blog} />
    <Route path="about" component={About} />
    <Route path="/" component={Home} />
  </div>
</Router>
