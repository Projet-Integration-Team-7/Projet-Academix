import Image from "next/image";



function LikeBtn() {
    let imgUrl : string ="";
    const grayHeartUrl = "/assets/heart-gray.svg";
    const filledHeartUrl = "/assets/heart-filled.svg"
    let liked = false;

    const getStatut = (a : boolean) => {
        if (a) {
            imgUrl = filledHeartUrl;
        }
        else {
            imgUrl = grayHeartUrl;
        }
    }

    return (
        {getStatut(liked)};
        <Image src={imgUrl} alt="heart" width={24} height={24} className="cursor-pointer object-contain" />

    )


    


}

export default LikeBtn;