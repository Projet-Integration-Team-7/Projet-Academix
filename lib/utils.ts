import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

// généré par shadcn
/**
 * Fusionne les classes CSS en utilisant la bibliothèque clsx et tailwind-merge.
 * @param inputs Les classes CSS à fusionner.
 * @returns Les classes CSS fusionnées.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// récupérer l'image
/**
 * Vérifie si une chaîne de caractères représente une image en base64.
 * @param imageData La chaîne de caractères à vérifier.
 * @returns True si la chaîne de caractères représente une image en base64, sinon False.
 */
export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

// récupérer la date
/**
 * Formate une chaîne de caractères représentant une date en une chaîne de caractères formatée.
 * @param dateString La chaîne de caractères représentant la date.
 * @returns La date formatée.
 */
export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long", // Changed from "short" to "long" for full month name
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('fr-FR', options); // Added 'fr-FR'

  const time = date.toLocaleTimeString('fr-FR', { // Added 'fr-FR'
    hour: "numeric",
    minute: "2-digit",
  });

  return `${time} - ${formattedDate}`;
}

// formater le nombre de threads
/**
 * Formate le nombre de threads en une chaîne de caractères.
 * @param count Le nombre de threads.
 * @returns La chaîne de caractères formatée.
 */
export function formatThreadCount(count: number): string {
  if (count === 0) {
    return "Aucun thread";
  } else {
    const threadCount = count.toString().padStart(2, "0");
    const threadWord = count === 1 ? "Thread" : "Threads";
    return `${threadCount} ${threadWord}`;
  }
}

/**
 * Crée une clé secrète pour un utilisateur de chat en utilisant l'algorithme HMAC-SHA256.
 * @param userId L'identifiant de l'utilisateur.
 * @returns La clé secrète générée.
 */
export function createChatUserSecret(userId: string) {
  // Crée un HMAC en utilisant SHA-256 et la clé secrète fournie
  const hmac = crypto.createHmac(
    "sha256",
    `${process.env.NEXT_CHAT_USER_SECRET_KEY}`
  );

  // Met à jour le HMAC avec l'identifiant de l'utilisateur à hacher
  hmac.update(userId);

  // Finalise le HMAC et le renvoie sous forme de chaîne hexadécimale
  const hash = hmac.digest("hex");

  return hash;
}

/**
 * Calcule le temps écoulé depuis une date donnée.
 * @param date La date de référence.
 * @returns Le temps écoulé sous forme de chaîne de caractères simplifiée.
 */
export async function calculateTimePassed(date: Date) {
  const now = Date.now();
  const diff = now - date.getTime();

  // Calcule le temps en différentes unités
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));

  // Renvoie la chaîne de caractères simplifiée du temps écoulé
  if (months > 1) {
      const formattedDate = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
      return formattedDate;
  } else if (days > 0) {
    return `${days}j`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
}
