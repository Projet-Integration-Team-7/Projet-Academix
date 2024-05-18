import React, { useState } from 'react';
import axios from 'axios';
import { FaThumbtack } from 'react-icons/fa'; // Importation de l'icône de pouce
import './FileUpload.css'; // Importation des styles CSS du composant

const FileUpload = () => {
  // État local pour stocker les fichiers sélectionnés par l'utilisateur
  const [files, setFiles] = useState([]);

  // Fonction appelée lorsqu'un utilisateur sélectionne un fichier
  const handleFileChange = (event) => {
    setFiles(event.target.files); // Met à jour l'état avec les fichiers sélectionnés
  };

  // Fonction appelée lors de la soumission du formulaire de téléchargement
  const handleFileSubmit = async (event) => {
    event.preventDefault(); // Empêche le comportement par défaut de soumission du formulaire

    // Création d'un objet FormData pour envoyer les fichiers au serveur
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]); // Ajoute chaque fichier sélectionné à l'objet FormData
    }

    try {
      // Envoi de la requête POST au serveur avec les fichiers en tant que données multipart/form-data
      const response = await axios.post('https://academixbackend-b7d3e8ece074.herokuapp.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Définit le type de contenu de la requête comme multipart/form-data
        }
      });
      console.log(response.data); // Affiche la réponse du serveur dans la console
    } catch (error) {
      console.error(error); // Gestion des erreurs en cas d'échec de la requête
    }
  };
      
  return (
    // Conteneur du composant de téléchargement de fichier
    <div className="file-upload-container">
      {/* Formulaire pour télécharger les fichiers */}
      <form onSubmit={handleFileSubmit}>
        {/* Label personnalisé pour le champ de téléchargement de fichier */}
        <label htmlFor="file-upload-input" className="file-upload-label">
          {/* Icône de pouce pour indiquer l'action de téléchargement de fichier */}
          <FaThumbtack />
        </label>
        {/* Champ de téléchargement de fichier caché pour l'interaction utilisateur */}
        <input id="file-upload-input" type="file" className="file-upload-input" onChange={handleFileChange} multiple />
        {/* Bouton de soumission du formulaire, caché visuellement */}
        <button type="submit"></button>
      </form>
    </div>
  );
};

export default FileUpload;

