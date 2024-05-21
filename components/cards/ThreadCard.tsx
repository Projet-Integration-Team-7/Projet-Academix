import Image from "next/image";
import Link from "next/link";
const imgPlacebot =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB4AAAAQ4AQMAAADSHVMAAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAGUExURQAAAAAAAKVnuc8AAAABdFJOU/4a4wd9AAAED0lEQVR42u3PQQ0AAAgEIDf7V1ZfpjhoQG2WKWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYeHccIj+8AGdU9s1O0HsQgAAAABJRU5ErkJggg==";
import LikeBtn from "../forms/LikeBtn";
import ShareBtn from "../forms/ShareBtn";
import ThreadMenu from "../forms/ThreadMenu";
import { formatDateString } from "@/lib/utils";

interface Props {
  id: string;
  currentUserId: string;
  currentUser: {
    id: string;
    name: string;
  } | null;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };

  community: {
    id: string;
    name: string;
    image: string;
    members: {
      id: string;
      name: string;
    }[];
  } | null;
  imgUrl?: string;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];

  likes: Map<string, Date>;
  isComment?: boolean;
  isConnected?: boolean;
  threadType: string;
}

/**
 * Composant ThreadCard
 * 
 * @component
 * @param {Object} Props - Les propriétés du composant
 * @param {string} Props.id - L'identifiant du thread
 * @param {string} Props.currentUserId - L'identifiant de l'utilisateur actuel
 * @param {Object} Props.currentUser - Les informations de l'utilisateur actuel
 * @param {string} Props.parentId - L'identifiant du parent du thread
 * @param {string} Props.content - Le contenu du thread
 * @param {Object} Props.author - Les informations de l'auteur du thread
 * @param {Object} Props.community - Les informations de la communauté du thread
 * @param {string} Props.imgUrl - L'URL de l'image du thread
 * @param {string} Props.createdAt - La date de création du thread
 * @param {Array} Props.comments - Les commentaires du thread
 * @param {Array} Props.likes - Les likes du thread
 * @param {boolean} Props.isComment - Indique si le thread est un commentaire
 * @param {boolean} Props.isConnected - Indique si l'utilisateur est connecté
 * @param {string} Props.threadType - Le type de thread
 * @returns {JSX.Element} Le composant ThreadCard
 */

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
  isConnected,
  threadType,
}: // Access the list of members of the community

Props) => {
  // Your component logic here
  // console.log(threadType)
  return (
    <article
      className={`card-hover-effect flex w-full flex-col rounded-xl bg-emerald-50 p-7 ${
        isComment ? "px-0 xs:px-7 border-2 border-yellow-300" : ""
      }`}
    >
      {" "}
      <div className="static flex items-start justify-between ">
        <div className="flex w-full flex-1 flex-row gap-4 ">
          <div className="flex flex-col items-center">
            {author && (
              <Link
                href={`/profile/${author.id}`}
                className="relative h-11 w-11"
              >
                <Image
                  src={author.image}
                  alt="Profile image"
                  fill
                  className="cursor-pointer rounded-full"
                />
              </Link>
            )}
            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <div className=" inline-flex justify-between">
              {author && (
                <div className=" inline-flex justify-between">
                  <Link href={`/profile/${author.id}`} className="w-fit">
                    <h4 className="cursor-pointer text-base-semibold text-black">
                      {author.name}
                    </h4>
                  </Link>
                </div>
              )}
              {author && (
                <ThreadMenu
                  threadId={id}
                  currentUserId={currentUserId}
                  authorId={author.id}
                />
              )}
            </div>
            {imgUrl && imgUrl !== "" && imgUrl !== imgPlacebot && (
              <div className="image-hover-container">
                <button className="hover-button">Attention spoil</button>
                <div className="image-hover">
                  <Image
                    src={imgUrl}
                    alt="Thread Image"
                    width={600}
                    height={600}
                  />
                </div>
              </div>
            )}

            <p className="mt-2 text-small-mono text-black">{content}</p>

            <div className=" flex mb-10 mt-5 flex-col gap-3 align-middle">
              <div className=" flex gap-3.5 align-middle">
                <LikeBtn
                    threadId={JSON.parse(JSON.stringify(id))}
                    currentUserId={currentUserId}
                    mapLikes={likes}
                    likesCount={likes.size}
                    isConnected={isConnected || false}
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>
                {/* <Image src="/assets/repost.svg" alt="repost" width={24} height={24} className="cursor-pointer object-contain" /> FONCTION REPOST FACULTATIF +- */}
                <ShareBtn threadId={JSON.parse(JSON.stringify(id))} />
              </div>

              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length} commentaires
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <p className="text-subtle-medium text-gray-1">
        {threadType === "exercise" && "Exercise"}
        {threadType === "course_note" && "Note de cours"}
        {threadType === "evaluation" && "Evaluations"}
      </p>
      {formatDateString(createdAt)}
      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className="mt-5 flex items-center"
        >
          <p className="text-subtle-medium text-gray-1">
            {" "}
            {community && ` - ${community.name} `}
          </p>

          <Image
            src={community.image}
            alt={community.name}
            width={14}
            height={14}
            className="ml-1 rounded-full object-cover"
          />
        </Link>
      )}
    </article>
  );
};

export default ThreadCard;
