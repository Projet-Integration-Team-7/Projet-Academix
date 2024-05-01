import "@/app/globals.css";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import User from "@/lib/models/user.model";

async function RightSidebar() {
  const user = await currentUser();

  if(!user) return null;

  const userInfo = await fetchUser(user.id);


  return (
    <section className="custom-scrollbar rightsidebar bg-[#0f0f20]">
      <div className="absolute inset-y-0 left-0 transform -rotate-90">
        <div className="animation-container">
          <div className="lightning-container">
            <div className="lightning white"></div>
            <div className="lightning red"></div>
          </div>
          <div className="boom-container">
            <div className="shape circle big white"></div>
            <div className="shape circle white"></div>
            <div className="shape triangle big yellow"></div>
            <div className="shape disc white"></div>
            <div className="shape triangle blue"></div>
          </div>
          <div className="boom-container second">
            <div className="shape circle big white"></div>
            <div className="shape circle white"></div>
            <div className="shape disc white"></div>
            <div className="shape triangle blue"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-yellow-100 underline underline-offset-4">
          Friends
        </h3>
        <ul className="custom-scrollbar flex flex-col overflow-y-auto ">
            {userInfo.friends.map( (friend: any) => (
            <li key={friend._id} className="flex items-center justify-between  my-3 border-2 rounded-md p-2">
              <div className=" flex-auto items-center gap-2">
                <Image
                  src={friend.image}
                  alt="profile"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className=" text-light-1">{friend.name}</span>
              </div>
              <button className="text-yellow-100">Follow</button>
            </li>
              
            ))}
        </ul>
      </div>
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-yellow-100">
          Suggested Users
        </h3>
      </div>
      <div className="w-full max-w-4xl relative z-10"></div>
    </section>
  );
}

export default RightSidebar;
