import * as z from 'zod'

// Définition de la validation de l'utilisateur
export const UserValidation = z.object({
    profile_photo: z.string().url().nonempty(), // Photo de profil de l'utilisateur (doit être une URL non vide)
    name: z.string().min(3).max(30), // Nom de l'utilisateur (entre 3 et 30 caractères)
    username: z.string().min(3).max(30), // Nom d'utilisateur (entre 3 et 30 caractères)
    bio: z.string().min(3).max(1000), // Biographie de l'utilisateur (entre 3 et 1000 caractères)
})
