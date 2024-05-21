
import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  members: {
    image: string;
  }[];
}

/**
 * Composant de carte de communauté.
 *
 * @component
 * @param {Props} props - Les propriétés du composant.
 * @param {string} props.id - L'identifiant de la communauté.
 * @param {string} props.name - Le nom de la communauté.
 * @param {string} props.username - Le nom d'utilisateur de la communauté.
 * @param {string} props.imgUrl - L'URL de l'image de la communauté.
 * @param {string} props.bio - La biographie de la communauté.
 * @param {Array<{ image: string }>} props.members - Les membres de la communauté.
 * @returns {JSX.Element} Le composant de carte de communauté.
 */
function CommunityCard({ id, name, username, imgUrl, bio, members }: Props) {
  return (
    <article className='community-card'>
      <div className='flex flex-wrap items-center gap-3'>
        <Link href={`/communities/${id}`} className='relative h-12 w-12'>
          <Image
            src={imgUrl}
            alt='community_logo'
            fill
            className='rounded-full object-cover'
          />
        </Link>

        <div>
          <Link href={`/communities/${id}`}>
            <h4 className='text-base-semibold text-black'>{name}</h4>
          </Link>
          <p className='text-small-medium text-gray-1'>@{username}</p>
        </div>
      </div>

      <p className='mt-4 text-subtle-medium text-black'>{bio}</p>

      <div className='mt-5 flex flex-wrap items-center justify-between gap-3'>
        <Link href={`/communities/${id}`}>
          <Button size='sm' className='community-card_btn'>
            Voir
          </Button>
        </Link>

        {members.length > 0 && (
          <div className='flex items-center'>
            {members.map((member, index) => (
              <Image
                key={index}
                src={member.image}
                alt={`user_${index}`}
                width={28}
                height={28}
                className={`${
                  index !== 0 && "-ml-2"
                } rounded-full object-cover`}
              />
            ))}
            {members.length > 3 && (
              <p className='ml-1 text-subtle-medium text-gray-1'>
                {members.length}+ Utilisateurs
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default CommunityCard;
