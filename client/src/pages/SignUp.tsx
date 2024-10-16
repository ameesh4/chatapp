import { useState } from "react";
import { UserRegister } from "../components/models";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";


export default function SignUp(){
    const [userRegister, setUserRegister] = useState<UserRegister>({
        name: "",
        age: 0,
        email: "",
        password: ""
    })

    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const navigate = useNavigate();

    const handleClick = (e: any) => {
        console.log(userRegister);
        e.preventDefault();
        if (userRegister.email === "" || userRegister.password === "" || userRegister.name === "" || userRegister.age === 0){
            toast({
                title: "Error",
                description: "Please fill all the fields",
                variant: "destructive"
            })
            return;
        }

        axios.post("http://localhost:8000/signup", userRegister)
        .then((res: any)=> {
            if(res.data.error){
                toast({
                    title: "Error",
                    description: res.data.error,
                    variant: "destructive"
                })
                return;
            }
            toast({
                title: "Success",
                description: "User Registered",
                variant: "success"
            })
            navigate("/signin");
        })
    }

    const handleChange = (e: any) => {
        if(e.target.name === "name"){
            setUserRegister({
                ...userRegister,
                name: e.target.value
            })
        }
        if (e.target.name === "age"){
            setUserRegister({
                ...userRegister,
                age: e.target.value
            })
        }
        if(e.target.name === "email"){
            setUserRegister({
                ...userRegister,
                email: e.target.value
            })
        }
        if(e.target.name === "password"){
            setUserRegister({
                ...userRegister,
                password: e.target.value
            })
        }
    }


    return(
        <div>
            <div className="flex justify-center items-center min-h-screen">
                <div className="main w-80 bg-white h-full p-10 rounded-md shadow-lg">
                    <h1 className="text-3xl font-bold text-center m-4 text-gray-500">Sign In</h1>
                    <form className="flex flex-col space-y-4" action='' method='POST'>
                        <input type="text" placeholder="Name" name="name" onChange={(e)=>handleChange(e)} className="p-2 border border-gray-400 rounded-md" />
                        <input type="number" placeholder="Age" name="age" onChange={(e)=>handleChange(e)} className="p-2 border border-gray-400 rounded-md" />
                        <input type="email" placeholder="Email" name="email" onChange={(e)=>handleChange(e)} className="p-2 border border-gray-400 rounded-md" />
                        <input type="password" placeholder="Password" name="password" onChange={(e)=>handleChange(e)} className="p-2 border border-gray-400 rounded-md" />
                        <button type="button" onClick={(e)=>handleClick(e)} className="border-2 border-gray-400 font-bold text-xl p-2 rounded-xl bg-white text-gray-400 hover:text-white hover:bg-gray-400">Sign In</button>
                        <p className="text-red-500 text-center">{error}</p>
                        <a className="text-center underline" href="/signin">Already have an account?</a>
                    </form>
                </div>
            </div>
        </div>
    )
}