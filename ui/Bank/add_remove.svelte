<script>
    let name = "Academix";
    let API_URL = "http://localhost:5038/";
    let notes = [];
    let newNotes = "";
  
  
    function refreshList() {
      fetch(API_URL + "api/todoapp/GetNotes")
        .then((response) => response.json())
        .then(data => {
          notes = data;
        });
    }
  
  
  
    import { onMount } from 'svelte';
    onMount(async () => {
      refreshList();
    });
  
    function addNotes() {
      const data=new FormData();
      data.append("newNotes",newNotes);
      fetch(API_URL + "api/todoapp/AddNotes", {
      method: "POST",
      body: data
     })
      .then((response) => response.json())
      .then(data => {
        alert(data);
        refreshList();
      });
  }
  
    function deleteNotes(id) {
      fetch(API_URL + "api/todoapp/DeleteNotes?id=" + id, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data);
          refreshList();
        });
    }
  </script>
  
  <main>
    <h2>{name}</h2>
  
    <input bind:value={newNotes} />
    <button on:click={addNotes}>Add Notes</button>
  
    {#each notes as note}
      <p>
        <b>*{note.description}</b>
        <button on:click={deleteNotes(note.id)}>Delete Notes</button>
      </p>
    {/each}
  </main>
  