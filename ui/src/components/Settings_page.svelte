<script>
  import { Link } from "svelte-routing";
  let isEditing = false;
  let formData = {
    nom: 'Benzo',
    motDePasse: '********',
    adresseCouriel: 'xxxxx.gmail',
    genre: 'M'
  };

  function toggleEditing() {
    isEditing = !isEditing;
  }

  async function saveData(event) {
    event.preventDefault();
    console.log(formData);
    try {
      const response = await fetch('URL_DU_SERVEUR', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  function handleImageUpload(event) {
    formData.image = event.target.files[0];
  }
</script>

<body class="container mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg ">
  <h3 class="text-2xl font-bold mb-4 ">Parametres/Settings</h3>
  

  <div class="container mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg ">
    <div
  class="bg-gray-800 rounded-lg shadow-md p-4 flex items-center space-y-4"
>
    
      <div
        class="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mr-4 animate-bounce"
      >
        <img
          src="img/avatar_benzo.png"
          alt="Avatar"
          class="w-20 h-20 rounded-full"
        />
      </div>

      <div class="text-container" style="margin-left: 20px;">
        <h4 class="text-lg font-semibold mb-2">Profile</h4>
        <p class="mb-2"> Benzo BG</p>
        <p class="mb-2">ssssss@gmail.com</p>
  
        
      </div>
    </div>
  </div>



  <div class="container mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg">
    <h3 class="text-2xl font-bold mb-4 ">Informations</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="bg-gray-800 rounded-lg shadow-md p-16 flex items-center">
        {#if isEditing}
          <form class="text-container" style="margin-left: 20px;" on:submit={saveData}>
            <h4 class="text-lg font-semibold mb-2">Modifier Compte</h4>
            <input type="text" placeholder="Nom" class="mb-2 bg-gray-700 text-white rounded-lg p-2" bind:value={formData.nom} />
            <input type="password" placeholder="Mot de Passe" class="mb-2 bg-gray-700 text-white rounded-lg p-2" bind:value={formData.motDePasse} />
            <input type="email" placeholder="Adresse couriel" class="mb-2 bg-gray-700 text-white rounded-lg p-2" bind:value={formData.adresseCouriel} />
            <select class="mb-2 bg-gray-700 text-white rounded-lg p-2" bind:value={formData.genre}>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
            <input type="file" accept="image/*" class="mb-2 bg-gray-700 text-white rounded-lg p-2" on:change={handleImageUpload} />
            <button type="submit" class="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition duration-300">Sauvegarder</button>
            <button type="button" class="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition duration-300" on:click={toggleEditing}>Annuler</button>
          </form>
        {:else}
          <div class="text-container" style="margin-left: 20px;">
            <h4 class="text-lg font-semibold mb-2">Compte</h4>
            <div class="flex items-center mb-2 space-x-4">
              
                <img src="img/avatar_benzo.png" alt="Avatar" class="w-20 h-20 rounded-full " />
              
              <button class="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition duration-300" on:click={toggleEditing}>Modifier</button>
            </div>
            <p class="mb-2">Nom: {formData.nom}</p>
            <p class="mb-2">Mot de Passe: {formData.motDePasse}</p>
            <p class="mb-2">Adresse couriel: {formData.adresseCouriel}</p>
            <p class="mb-2">Genre: {formData.genre}</p>
          </div>
        {/if}
      </div>
    </div>
  </div>



  
  <div class="container mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg">

  <div
    class="bg-gray-800 rounded-lg shadow-md p-4 flex items-center"
  >
    
    
    <div class="text-container" style="margin-left: 20px;">
      <h4 class="text-lg font-semibold mb-2">Nouveau Bloc</h4>
      <p class="mb-2">Informations supplémentaires</p>
      <p class="mb-2">Autres détails</p>
      <Link
        to="/settings/new"
        class="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition duration-300"
        >Lien vers le nouveau bloc</Link
      >
      
    </div>
  </div>
</div>



</body>

  





<style scoped>
  .container {
    padding: 2rem;
  }
</style>
