"use client"
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
interface Props {
    id : string ; 
    name: string;
    username : string ; 
    imgUrl: string; 
    personType : string ;
    usage: string;
}
/**
 * Composant de carte utilisateur.
 * 
 * @component
 * @param {Object} props - Les propriétés du composant.
 * @param {number} props.id - L'identifiant de l'utilisateur.
 * @param {string} props.name - Le nom de l'utilisateur.
 * @param {string} props.username - Le nom d'utilisateur de l'utilisateur.
 * @param {string} props.imgUrl - L'URL de l'image de l'utilisateur.
 * @param {string} props.personType - Le type de personne.
 * @param {string} props.usage - L'utilisation de la carte utilisateur.
 * @returns {JSX.Element} Le composant de carte utilisateur.
 */
const UserCard = ({ id, name, username, imgUrl, personType, usage }: Props) => {
  const router = useRouter();

  return (
    <article className="user-card">
      <div
        className={`user-card_avatar ${usage === "amis" && "hover:cursor-pointer"}`}
        onClick={() => usage === "amis" && router.push(`/profile/${id}`)}
      >
        <Image src={imgUrl} alt="logo" width={48} height={48} className="rounded-full" />
        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1 text-wrap">{name}</h4>
          <p className="text-small-medium text-gray-1 text-wrap">@{username}</p>
        </div>
      </div>
      {usage === "search" && (
        <Button className="user-card_btn" onClick={() => router.push(`/profile/${id}`)}>
          Voir
        </Button>
      )}
    </article>
  );
}
export default UserCard