"use client"
import { useRouter } from "next/navigation";
import {Button} from "../ui/button" 
const router=useRouter();
interface Props{
}
const ModifyCard=({} :Props) =>{
    return(
  <Button className="user-card_btn" onClick={() => router.push(`/modifyProfile`) }>
                Modify Profile
            </Button>
    )
};
export default ModifyCard