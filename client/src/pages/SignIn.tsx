import { useState } from 'react';
import { UserLogin } from '../components/models';
import axios from 'axios';

export default function SignIn(){
    const [userLogin, setUserLogin] = useState<UserLogin>({
        email: "",
        password: ""
    });
    const [error, setError] = useState<string>("");
    

    const handleClick = (e: any) => {
        e.preventDefault();
        if(userLogin.email === "" || userLogin.password === ""){
            setError("Please fill all the fields");
        }

        axios.post("http://localhost:8000/signin", userLogin)
        .then((res) => {
            if(res.data.error){
                setError(res.data.error);
                return;
            }
            localStorage.setItem("token", res.data.token);
            window.location.href = "/chats";
        })
    }

    const handleChange = (e: any) => {
        if(e.target.name === "email"){
            setUserLogin({
                ...userLogin,
                email: e.target.value
            })
        }

        if (e.target.name === "password") {
            setUserLogin({
                ...userLogin,
                password: e.target.value
            })
        }
    }

    return (
        <div>
            <div className="flex justify-center items-center min-h-screen">
                <div className="main w-1/5 bg-white h-full p-10 rounded-md shadow-lg">
                    <h1 className="text-3xl font-bold text-center m-4 text-gray-500">Sign In</h1>
                    <form className="flex flex-col space-y-4" action='' method='POST'>
                        <input type="email" placeholder="Email" name="email" onChange={(e)=>handleChange(e)} className="p-2 border border-gray-400 rounded-md" />
                        <input type="password" placeholder="Password" name="password" onChange={(e)=>handleChange(e)} className="p-2 border border-gray-400 rounded-md" />
                        <div className='flex' >
                            <div className='w-full'/>
                            <div className='w-full text-right text-sm'>
                                <a href="">Forgot Password</a>
                            </div>
                        </div>
                        <button type="button" onClick={(e)=>handleClick(e)} className="border-2 border-gray-400 font-bold text-xl p-2 rounded-xl bg-white text-gray-400 hover:text-white hover:bg-gray-400">Sign In</button>
                        <p className="text-red-500 text-center">{error}</p>
                        <a className="text-center underline" href="/signup">Don't have an account?</a>
                    </form>
                </div>
            </div>
        </div>
    )
}