import SideBar from "../components/SideBar"
import info from "../assets/info.png"
import send from "../assets/send.png"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Chat, ChatReq, ChatRoomRes } from "../components/models";

export default function Home(){
    const chatkey: number = useLocation().state;
    const [error, setError] = useState<string>("");
    const [chats, setChats] = useState<Chat[]>([]);
    const [chatRoom, setChatRoom] = useState<ChatRoomRes>();
    const token = localStorage.getItem("token");
    const [User, setUser] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const navigate = useNavigate();
    const [input, setInput] = useState<string>("");
    const messageEndRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats])
    
    useEffect(()=>{
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

        const interval = setInterval(()=>{
            axios.post("http://localhost:8000/get_chats", {chatid : chatkey})
            .then((res)=>{
                if (res.data.error){
                    setError(res.data.error);
                }
                if (chats.length !== res.data.length){
                    setChats(res.data);
                }
            })
        }, 1000)

        axios.post("http://localhost:8000/get_chatroom_details", {chatid: chatkey})
        .then(async (res)=>{
            if (res.data.error){
                setError(res.data.error);
            }
            const temp: ChatRoomRes = {
                id: res.data.id,
                user1: await getNameFromEmail(res.data.user1),
                user2: await getNameFromEmail(res.data.user2),
                email1: res.data.user1,
                email2: res.data.user2,
            }
            setChatRoom(temp);
        })

        return () => clearInterval(interval);
    }, [chatkey])

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

    const handleKeyPress = (e: any) => {
        if(e.key === "Enter"){
            const message = (document.getElementById("message") as HTMLInputElement).value;
            const temp: ChatReq = {
                sender: User,
                receiver: (chatRoom?.email1 === User) ? (chatRoom.email2) : (chatRoom?.email1),
                message: message,
                roomid: chatkey
            }
            axios.post("http://localhost:8000/message", temp)
            .then((res)=>{
                if (res.data.error){
                    setError(res.data.error);
                    return;
                }
                console.log(res.data.message);
            })

            axios.post("http://localhost:8000/get_chats", {chatid : chatkey})
            .then((res)=>{
                if (res.data.error){
                    setError(res.data.error);
                }

                setChats(res.data);
            })
            setInput("");
            e.preventDefault();
        }
    }

    const handleClick = (e: any) => {
        e.preventDefault();
        if(e.target.name === "send" || e.target.alt === "send"){
            console.log("Send button clicked");
        }
    }

    const handleChange = (e: any) => {
        setInput(e.target.value);
    }

    return (
        <div className="flex h-screen w-screen">
            <div className="w-1/5">
                <SideBar />
            </div>
            <div className="w-screen pl-1">
                {
                    <div className="relative w-full h-full border-l-2 border-gray-500">
                        <div className="flex w-full h-20 border-b-2 border-gray-500">
                            <div className="flex items-center w-full">
                                <h1 className="text-4xl h-full font-bold text-gray-500 p-4">{(userName == chatRoom?.user1) ? (chatRoom.user2) : (chatRoom?.user1)}</h1>
                            </div>
                            <div className="flex justify-center items-center p-3">
                                <img className="h-7 w-7" src={info} alt="info" />
                            </div>
                        </div>
                        <div className="absolute flex incet-x-0 bottom-0 h-auto w-full border-t-2 border-gray-500 p-2 bg-white">
                            <div className="w-full">
                                <input value={input} onKeyDown={(e)=>handleKeyPress(e)} onChange={(e)=>handleChange(e)} id="message" type="text" placeholder="Type a message..." className="p-2 border-2 border-gray-500 rounded-md w-full h-full" />
                            </div>
                            <button
                            onClick={(e)=>handleClick(e)}
                            name="send"
                            className="flex justify-center items-center p-4 hover:bg-gray-200">
                                <img onClick={(e)=>handleClick(e)} src={send} alt="send" className="w-8"/>
                            </button>
                        </div>
                        <ul className="h-5/6 overflow-y-scroll">
                            {/* <div className=" flex h-full m-4">
                                <div className="w-full"> */}
                            <div className="p-4">
                                { chats.map((chat: Chat)=>{
                                    return (
                                            <>
                                                { chat.sender === User ? (
                                                    <li key={chat.chatid} className="flex justify-end my-2">
                                                        <div className="text-right">
                                                            <p className="text-sm m-1 text-gray-500">{userName}</p>
                                                            <div className="max-w-sm border-2 border-gray-600 p-2 rounded-md shadow-md">
                                                                <p className="text-lg text-gray-600">{chat.message}</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ) : (
                                                    <li key={chat.chatid} className="flex justify-start my-2">
                                                        <div className="text-left">
                                                            <p className="text-sm m-1 text-gray-500">{ (chatRoom?.email1 === User) ? (chatRoom.user2) : (chatRoom?.user1) }</p>
                                                            <div className="max-w-sm bg-gray-600 p-2 rounded-md shadow-md">
                                                                <p className="text=lg text-white">{chat.message}</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )}
                                                <div ref={messageEndRef} />
                                            </>
                                    )
                                    })
                                }
                            </div>
                                {/* </div>
                            </div> */}
                        </ul>
                    </div>
                }
            </div>
        </div>
    )
}