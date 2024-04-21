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

const ProfileHeader =({
    accountId,
    authUserId,
    name,
    username,imgUrl,bio,type
}: Props) => {
    const animatedAvatarJSX = (
        <div className="avatar-animation-container">
          <img src={imgUrl} alt="Animated Avatar" className="avatar-image" />
        </div>
      );
   //structure de l'affiche du profil 
    return (
    
        <div className="flex w-full flex-col justify-start">
            {/* Animated Avatar JSX */}
           <div className="flex items-center justify-betwen">
            <div className="flex items-center gap-3">
                
                 {animatedAvatarJSX}
                 <div className="flex-1">
                    <h2 className="text-left text-heading3-bold text-light-1 ">{name}</h2>
                    <p className="text-base-medium text-gray-1">@{username}</p>


                 </div>
            </div>
            </div>
            {/* TODO: Commuinity  */}
            <p className="mt-6 max-w-lg text-base-regular text-light-2">
              {bio}  
            </p>
            <div className="mt-12 h-0.5 w-full bg-dark-3" />
           
        </div>
    )
}
export default ProfileHeader;