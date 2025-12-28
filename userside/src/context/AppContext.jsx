import axios from "axios";
import { useContext } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import {useUser,useAuth} from "@clerk/clerk-react";
import { useState } from "react";
import {toast} from "react-hot-toast";
import { useEffect } from "react";


axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL


const AppContext = createContext();

export const AppProvider = ({children}) => {
     
    const currency = import.meta.env.VITE_CURRENCY || "INR";
    const navigate = useNavigate();
    const {user} = useUser();
    const {getToken} = useAuth();

    const[isOwner,setIsOwner] = useState(false);
    const [showHotelReg,setShowHotelReg] = useState(false);
    const [searchedCities,setSearchedCities]= useState([]);
    const [rooms,setRooms]=useState([]);

    const fetchRooms = async () => {
      try {
        const { data } = await axios.get('/api/rooms');
        if (data.success) {
                    // Normalize server response: some rooms may use `Image` (server) while client expects `images`.
                    const normalized = (data.rooms || []).map((r) => {
                        // normalize room fields used by the client
                        const rawRoomType = (r.roomType || r.roomtype || '').toString();
                        const rtKey = rawRoomType.trim().toLowerCase();
                        const roomTypeMap = {
                            'signle bed': 'Single Bed',
                            'single bed': 'Single Bed',
                            'double bed': 'Double Bed',
                            'luxury room': 'Luxury Room',
                            'family suite': 'Family Suite'
                        };
                        const normalizedRoomType = roomTypeMap[rtKey] || rawRoomType;

                        return {
                            ...r,
                            images: r.images || r.Image || [],
                            pricePerNight: r.pricePerNight ?? r.priceperNight ?? r.price ?? 0,
                            roomType: normalizedRoomType,
                        };
                    });
                    setRooms(normalized);
        } else {
          toast.error(data.message);
        }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // fetch user details from server
    
    const fetchUser = async () => {
        try {
            const token = await getToken();
            console.log("fetchUser: token ->", token);
            const {data} = await axios.get('/api/user', { headers: { Authorization: `Bearer ${token}` } })
            if(data.success){
                const ownerFlag = data.role === "hotelOwner";
                console.log("fetchUser: role from server ->", data.role, "setting isOwner ->", ownerFlag);
                setIsOwner(ownerFlag);
                // server returns `recentSearchedCities`
                setSearchedCities(data.recentSearchedCities || []);
            }else{
                // Retry Fetching User Details after 5 seconds
                setTimeout(()=>{
                    fetchUser()
                },5000);
            }
        } catch (error) {
           console.log("fetchUser: error ->", error.response ? error.response.status : error.message, error.response ? error.response.data : "no response");
           toast.error(error.message);
        }
    }
    
    useEffect(()=>{
        if(user){
            fetchUser();
        }
    },[user])

    useEffect(()=>{
        fetchRooms();
    },[])

    const value = {
        currency,navigate,user,getToken,isOwner,setIsOwner,
        axios,showHotelReg,setShowHotelReg,searchedCities,setSearchedCities,
        fetchUser,rooms,setRooms
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}


export const useAppContext = () => useContext(AppContext);