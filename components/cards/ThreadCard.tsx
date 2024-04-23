import Image from "next/image";
import Link from "next/link";
const imgPlacebot="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB4AAAAQ4AQMAAADSHVMAAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAGUExURQAAAAAAAKVnuc8AAAABdFJOU/4a4wd9AAAED0lEQVR42u3PQQ0AAAgEIDf7V1ZfpjhoQG2WKWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYeHccIj+8AGdU9s1O0HsQgAAAABJRU5ErkJggg=="
import LikeBtn from "../forms/LikeBtn";
import ShareBtn from "../forms/ShareBtn";
import ThreadMenu from "../forms/ThreadMenu";
import { formatDateString } from "@/lib/utils";
import { calculateTimePassed } from "@/lib/utils";


interface Props {
    id: string,
    currentUserId:string,
    currentUser:{
        id: string,
        name:string;
    }|null;
    parentId:  string | null,
    content: string,
    author: {
        name: string;
        image: string;
        id: string;
    }
    
    community: {
        id: string;
        name: string;
        image: string;
        members: {
            id: string;
            name: string;
        }[];
    }| null;
    imgUrl ?:string,
    createdAt: string;
    comments: {
        author: {
            image: string;
        }
    }[]
    
    likes : Map<string,Date>,
    isComment?: boolean;
    threadType:string,
    
}

const ThreadCard = ({
    id,
    currentUserId,
    currentUser,
    parentId,
    content,
    author,
    community,
    imgUrl,
    createdAt,
    comments,
    
    likes,
    isComment,
    threadType,
    // Access the list of members of the community
    
    
}: Props) => {
    

    
        // Your component logic here
        console.log(threadType)
        return (
        
<article className={`card-hover-effect flex w-full flex-col rounded-xl ${isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'}`}>
            <div className="static flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">
                    <div className="flex flex-col items-center">
                        
                    {author && (
    <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
        <Image src={author.image} alt="Profile image" fill className="cursor-pointer rounded-full" />
    </Link>
)}
                        <div className="thread-card_bar"/>
                    </div>

                    <div className="flex w-full flex-col">
                        <div className=" inline-flex justify-between">
                        {author && (
    <div className=" inline-flex justify-between">
        <Link href={`/profile/${author.id}`} className="w-fit">
            <h4 className="cursor-pointer text-base-semibold text-black">{author.name}</h4>
        </Link>
        <ThreadMenu threadId={id} currentUserId={currentUserId} authorId={author.id}/>     
    </div>
)}
                           {author && (
    <ThreadMenu threadId={id} currentUserId={currentUserId} authorId={author.id}/>     
)} 
                        </div>
                                              {imgUrl && imgUrl !== "" && imgUrl !== imgPlacebot && <Image src={imgUrl} alt="image-thread" width={100} height={100} />}


                        <p className="mt-2 text-small-regular text-light-2">{content}</p>

                        

                        <div className=" flex mb-10 mt-5 flex-col gap-3 align-middle">
                            <div className=" flex gap-3.5 align-middle">
                                <LikeBtn threadId={JSON.parse(JSON.stringify(id))} currentUserId={currentUserId} mapLikes={likes} likesCount={likes.size} />
                                <Link href={`/thread/${id}`}>
                                    <Image src="/assets/reply.svg" alt="reply" width={24} height={24} className="cursor-pointer object-contain" />
                                </Link>
                                {/* <Image src="/assets/repost.svg" alt="repost" width={24} height={24} className="cursor-pointer object-contain" /> FONCTION REPOST FACULTATIF +- */}
                                <ShareBtn threadId={JSON.parse(JSON.stringify(id))} />
                            </div>

                            {isComment && comments.length > 0 && (
                                <Link href={`/thread/${id}`}>
                                    <p className="mt-1 text-subtle-medium text-gray-1">
                                        {comments.length} replies
                                    </p>
                                </Link>
                            )}
                        </div>
                        
                    </div>
                </div>
                
               


                <ThreadMenu threadId={JSON.parse(JSON.stringify(id))} currentUserId={currentUserId} authorId={author.id}/>     
            </div>
            
            <p className='text-subtle-medium text-gray-1'>
                {threadType === "exercise" && "Exercise"}
                {threadType === "course_note" && "Note de cours"}
                {threadType === "evaluation" && "Evaluations"}
                    </p>

            {!isComment&& community&&(
                    <Link
                    href={`/communities/${community.id}`}
                    className='mt-5 flex items-center'
                  >
                    
                    <p className='text-subtle-medium text-gray-1'>
                      {formatDateString(createdAt)}
                      {" "}{community && ` - ${community.name} Communite`}
                    </p>
                    
                    <Image
                      src={community.image}
                      alt={community.name}
                      width={14}
                      height={14}
                      className='ml-1 rounded-full object-cover'
                    />
                  </Link>
                  
                )}
        </article>
            
          )
            

}

export default ThreadCard;