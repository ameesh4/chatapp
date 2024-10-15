import { createContext, useEffect, useState } from "react";
import plus from "../assets/plus.png";
import { ChatRoomReq, ChatRoomRes } from "./models";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SideBar() {
  const [chatRooms, setChatRooms] = useState<ChatRoomRes[]>([]);
  const [User, setUser] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const token = localStorage.getItem("token");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.post("http://localhost:8000/get_email_by_token", {token: token})
    .then(async (res: any) => {
      if (res.data.error) {
        if (res.data.error === "Invalid Token") {
          navigate("/signin");
        }
        return;
      }
      setUser(res.data.email);
      setUserName(await getNameFromEmail(res.data.email));
    })
  }, [token]);
  
  const handleClick = (e: any) => {
    e.preventDefault();
    if (e.target.id === "addChatRoom" || e.target.id === "chatroom"){
      document.getElementById("prompt")?.classList.remove("hidden");
    }
    if (e.target.name === "go") {
      document.getElementById("prompt")?.classList.add("hidden");
      let user1 = User;
      let user2 = (document.getElementsByName("user2")[0] as HTMLInputElement).value;
      const temp: ChatRoomReq = {
        user1: user1,
        user2: user2
      }
      console.log(temp);

      axios.post("http://localhost:8000/create_chat_room", temp)
      .then((res: any)=>{
        if(res.data.error){
          setError(res.data.error);
          console.log(res.data.error);
          return;
        }
        console.log(res.data.message);
      })
    }
  }
  
  const handleChatRoomClick = (id: number) => {
    navigate("/chats", {state: id});
  }

  useEffect(()=> {
    handleChatRoom();
  }, [User])

  const handleChatRoom = async ()=>{
    await axios.post("http://localhost:8000/get_chat_room", {email: User})
    .then((res: any) => {
      if (res.data.error) {
        setError(res.data.error);
        return;
      }
      res.data.map(async (chat: any)=>{
        const temp: ChatRoomRes = {
          id: chat[0],
          email1: chat[1],
          email2: chat[2],
          user1: await getNameFromEmail(chat[1]),
          user2: await getNameFromEmail(chat[2])
        }
        setChatRooms((prev: any) => [...prev, temp]);
      })
    })
    
  }


  const getNameFromEmail = async (email: string)=>{
    const name = await axios.post("http://localhost:8000/get_user_by_email", {email: email})
    .then((res: any)=>{
      if(res.data.error){
        setError(res.data.error);
        return;
      }
      return res.data.name;
    })
    return name;
  }


  return (
    <div>
      <div id="prompt" className="absolute flex w-screen h-screen bg-gray-950/20 justify-center items-center hidden">
        <div className="p-4 w-96 bg-white rounded-md">
          <h1 className="text-gray-600 text-lg mb-2">Enter email of the user you want to text:</h1>
          <div className="flex">
            <input
              name="user2"
              type="text"
              placeholder="Enter Email..."
              className="p-2 border-2 w-full border-gray-500 rounded-l-md"
            />
            <button 
            name="go"
            onClick={(e)=>handleClick(e)}
            className="px-4 border-y-2 border-r-2 border-gray-500 hover:bg-gray-200 rounded-r-md">Go</button>
          </div>
        </div>
      </div>
      <div className="sidebar w-full bg-white border-2 border-gray-500 h-screen overflow-scroll no-scrollbar">
        <div className="flex justify-end p-2 border-b-2 border-gray-500">
          <button
            id="addChatRoom"
            className="border-2 border-gray-500 p-2 rounded-md hover:bg-gray-200"
            onClick={(e)=>handleClick(e)}
          >
            <img src={plus} id="chatroom" onClick={(e)=>handleClick(e)} alt="plus" className="w-5 h-5" />
          </button>
        </div>
        <ul>
        {chatRooms.map((chat: any) => {
          return (
              <li key={chat.id} onClick={()=>handleChatRoomClick(chat.id)} className="listItems">
                <button className="p-4 border-b-2 text-left w-full hover:bg-gray-200">
                <p className="font-bold text-2xl">{chat.user2 == userName ? (chat.user1) : (chat.user2)}</p>
                <p className="opacity-80">User1: hello bro</p>
                </button>
              </li>
          );
        })}
        </ul>
      </div>
    </div>
  );
}
