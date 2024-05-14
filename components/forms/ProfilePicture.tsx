import Image from "next/image";

interface Props {
    imgUrl: string;
}

const ProfilePicture = ({
    imgUrl
}: Props) => {
    // Contenu de l'image sans l'animation
    const avatarJSX = (
        <div className="avatar-image-container w-1/2  overflow-hidden">
            <Image src={imgUrl} alt="Profile Avatar" width={50} height={100} />
        </div>
    );

    // Structure de l'affichage du profil
    return (
        <div className="flex flex-col justify-start">
            {/* Avatar JSX */}
            <div className="flex items-center gap-3">
                {avatarJSX}
                <div className="flex-1"></div>
            </div>
            <div className="mt-12 h-0.5 w-full bg-dark-3" />
        </div>
    );
}

export default ProfilePicture;
