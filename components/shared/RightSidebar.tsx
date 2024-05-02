import "@/app/globals.css";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import User from "@/lib/models/user.model";
import UserCard from "../cards/UserCard";

async function RightSidebar() {
  const cUser = await currentUser();

  if(!cUser) return null;

  let userInfo = null;
  if (cUser !== null) {
   userInfo = await fetchUser(cUser.id);
  }
  


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
        <h3 className="text-heading4-medium text-light-1 underline underline-offset-4">
          Friends
        </h3>
        {userInfo!== null && (
        <ul className="custom-scrollbar flex flex-col overflow-y-auto ">
          {userInfo.friends.map(async (user: any) => {
            const friend = await User.findById(user);
            return (
              <li
                key={friend._id}
                className="flex items-center justify-between  my-3 border-2 rounded-md p-2"
              >
                <UserCard
                  key={friend.id}
                  id={friend.id}
                  name={friend.name}
                  username={friend.username}
                  imgUrl={friend.image}
                  personType="User"
                  usage="amis"
                />
              </li>
            );
          })}
        </ul>)
        }
      </div>
      {/* <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-yellow-100">
          Suggested Users
        </h3>
      </div> */}
      <div className="w-full max-w-4xl relative z-10"></div>
    </section>
  );
}

export default RightSidebar;
