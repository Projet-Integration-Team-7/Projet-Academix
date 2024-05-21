import Image from "next/image";

interface Props{
    accountId: string;
    authUserId: string;
    name: string;
    username: string;
    imgUrl: string;
    bio : string ;
    type? :'User' | 'Community';  //type of user (art
}

/**
 * Composant d'en-tête de profil.
 *
 * @component
 * @param {Object} props - Les propriétés du composant.
 * @param {string} props.accountId - L'identifiant du compte.
 * @param {string} props.authUserId - L'identifiant de l'utilisateur authentifié.
 * @param {string} props.name - Le nom du profil.
 * @param {string} props.username - Le nom d'utilisateur du profil.
 * @param {string} props.imgUrl - L'URL de l'image du profil.
 * @param {string} props.bio - La biographie du profil.
 * @param {string} props.type - Le type de profil.
 * @returns {JSX.Element} Le composant d'en-tête de profil.
 */
const ProfileHeader = ({
    accountId,
    authUserId,
    name,
    username,
    imgUrl,
    bio,
    type,
}: Props): JSX.Element => {
    const animatedAvatarJSX = (
        <div className="avatar-animation-container">
            <img src={imgUrl} alt="Animated Avatar" className="avatar-image" />
        </div>
    );

    return (
        <div className="flex w-full flex-col justify-start">
            {/* Animated Avatar JSX */}
            <div className="flex items-center justify-betwen">
                <div className="flex items-center gap-3">
                    {animatedAvatarJSX}
                    <div className="flex-1">
                        <h2 className="text-left text-heading3-bold text-light-1">{name}</h2>
                        <p className="text-base-medium text-gray-1">@{username}</p>
                    </div>
                </div>
            </div>
            {/* TODO: Commuinity  */}
            <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
            <div className="mt-12 h-0.5 w-full bg-dark-3" />
        </div>
    );
};
export default ProfileHeader;