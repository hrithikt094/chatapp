import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';

const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const {setAuthUser} = useAuthContext();

    const signup = async ({fullName, username, password, confirmPassword, gender}) => {
        const success = handleInputErrors({fullName, username, password, confirmPassword, gender});
        if(!success){
            return;
        }

        setLoading(true);
        try {
            const result = await fetch('http://localhost:5000/api/auth/signup', {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({fullName, username, password, confirmPassword, gender})
            })

            const data = await result.json();
            if(data.error){
                throw new Error(data.error);
            }
            
            // console.log(data);
            // set user in localstorage
            localStorage.setItem("chat-user", JSON.stringify(data));
            // context update
            setAuthUser(data);
        } catch (error) {
            toast.error(error.message);
        } finally{
            setLoading(false);
        }
    }

    return {loading, signup};
}

export default useSignup;

function handleInputErrors({fullName, username, password, confirmPassword, gender}){
    if(!fullName || !username || !password || !confirmPassword || !gender){
        toast.error("Please fill in all fields");
        return false;
    }

    if(password !== confirmPassword){
        toast.error("Passwords do not match");
        return false;
    }

    if(password.length < 8){
        toast.error("Password length must be at least 8 characters");
        return false;
    }

    return true;
}