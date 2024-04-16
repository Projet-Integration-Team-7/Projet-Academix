import { createChatUserSecret } from '@/lib/utils';
var axios = require("axios");

interface Params {
  username: string;
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export async function createChatUser({
    id,
    username,
    email,
    first_name,
    last_name
}: Params): Promise<void> {
    var data = {
        username,
        secret: createChatUserSecret(id),
        email,
        first_name,
        last_name,
      };
  try {
    var config = {
      method: "post",
      url: "https://api.chatengine.io/users/",
      headers: {
        "PRIVATE-KEY": `${process.env.NEXT_CHAT_ENGINE_PRIVATE_KEY}`,
      },
      data: data,
    };


    return await axios(config).then(res => {
      console.log(res);
      return res;
    });
  } catch (error: any) {
    throw new Error(`Impossible de creer chat user:${error.message}`);
  }
}