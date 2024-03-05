<script>
  import axios from "axios"
  import Transaction from "./components/Transaction.svelte";
  
  import { onMount } from "svelte";

  let input = 0;
  let typeOfTransaction = "+";
  let transactions = [];
  $: disabled = !input;

  onMount(async () => {
    const { data } = await axios.get("/api/transactions"); // recuperer/get les donnees depuis l'api. Prepare un endroit pour stocker les informations appele transaction , demande de l information au serveur quand la page web est prepare une fois que le serveur repond les infos sont stockes dans transactions
    transactions = data;
  });

  async function addTransaction() {
    const transaction = {
      date: new Date().getTime,
      value: typeOfTransaction === "+" ? input : input * -1,
    };
    const response = await axios.post("/api/transactions", transaction);
    transactions = [response.data, ...transactions];
    input = 0;
  }

  async function removeTransaction(id) {
    const response = await axios.delete("/api/transactions/" + id);
    if (response.data.id === id) {
      transactions = transactions.filter((t) => t._id !== id);
    }
  }
</script>

<div class="app container">
  <div class="field has-addons">
    <p class="control">
      <span class="select">
        <select bind:value={typeOfTransaction}>
          <option value="+">+</option>
          <option value="-">-</option>
        </select>
      </span>
    </p>
    <p class="control is-expanded">
      <input
        class="input"
        type="number"
        bind:value={input}
        placeholder="Amount of money"
      />
      <!-- a chaque fois que le input va changer la valeur va changer aussi -->
    </p>
    <p class="control">
      <button class="button" on:click={addTransaction} {disabled}>Save</button>
    </p>
  </div>
  <hr />
  {#each transactions as transaction}
    <div class="notification">
      {transaction.value}
      <button
        class="delete"
        on
        click={() => removeTransaction(transaction._id)}
      >
      </button>
    </div>
  {/each}
  {JSON.stringify(transactions)}
</div>

<style>
  .app {
    margin: 90px auto;
    max-width: 500px;
  }
</style>
