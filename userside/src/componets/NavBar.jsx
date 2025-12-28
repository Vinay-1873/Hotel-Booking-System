import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { useClerk,UserButton } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";


const BookIcon= ()=>(
    <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
    </svg>
)

const NavBar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/rooms' },
        { name: 'Experience', path: '/' },
        { name: 'About', path: '/' },
    ];

    const ref = React.useRef(null)

    const [isScrolled, setIsScrolled] =useState(false);
    const [isMenuOpen, setIsMenuOpen] =useState(false);

    const {openSignIn}=useClerk()
    const lacation=useLocation()

    const {user,navigate,isOwner,setShowHotelReg}=useAppContext();
    const actionBtnClass = isOwner
        ? `inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${isScrolled ? 'bg-indigo-600 text-white border border-indigo-600' : 'bg-white/30 text-indigo-700 border border-white/20 backdrop-blur-sm'}`
        : `inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-light transition-colors ${isScrolled ? 'bg-white/60 text-gray-800 border border-gray-200' : 'bg-white/30 text-gray-800 border border-white/20 backdrop-blur-sm'}`;

    const DashboardIcon = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className="opacity-90">
            <path d="M3 13h8V3H3v10zM13 21h8V11h-8v10zM13 3v6h8V3h-8zM3 21h8v-6H3v6z" fill="currentColor" />
        </svg>
    );
    React.useEffect(()=>{
        console.log("NavBar: isOwner ->", isOwner);
    },[isOwner])
    // const user = useAuthContext()?.user;

    React.useEffect(() => {
        if(lacation.pathname !=='/'){
            setIsScrolled(true);
            return;
        }else{
            setIsScrolled(false);
        }
        setIsScrolled(prev => lacation.pathname!=='/'? true:prev);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lacation.pathname]);

    return (
            <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>

                {/* Logo */}
                <Link to='/'>
                    <img src={assets.logo} alt ="logo" className={`h-12 rounded-full $
                        {isScrolled && "invert opacity-100"}`}/>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-4 lg:gap-8">
                    {navLinks.map((link, i) => (
                        <a key={i} href={link.path} className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}>
                            {link.name}
                            <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                        </a>
                    ))}
                      { user &&(
                          <button className={`${actionBtnClass} cursor-pointer`} onClick={()=>isOwner ? navigate('/owner'):setShowHotelReg(true)} aria-label={isOwner ? 'Go to Dashboard' : 'List Your Hotel'} title={isOwner ? 'Dashboard' : 'List Your Hotel'}>
                              {isOwner && <DashboardIcon />}
                              <span>{isOwner ? 'Dashboard' : 'List Your Hotel'}</span>
                          </button>
                          )
                      }
                </div>

                {/* Desktop Right */}
                <div className="hidden md:flex items-center gap-4">
                    <img src={assets.searchIcon} alt="search" className={`${isScrolled && 'invert'} h-7 transition-all duration-500`} />

                    {user ? (
                    <UserButton>
                      <UserButton.MenuItems>
                        <UserButton.Action
                          label="My Booking"
                          labelIcon={<BookIcon />}
                          onClick={() => navigate('/my-bookings')}
                        />
                      </UserButton.MenuItems>
                    </UserButton>
                    ) : (
                      <button
                        onClick={openSignIn}
                        className="bg-black text-white px-8 py-2.5 rounded-full ml-4 transition-all duration-500"
                      >
                        Login
                      </button>
                     )}
                </div>
                 
                {/* Mobile Menu Button */}
                
                <div className="flex items-center gap-3 md:hidden">
                    {user && 
                    <UserButton>
                      <UserButton.MenuItems>
                        <UserButton.Action
                          label="My Booking"
                          labelIcon={<BookIcon />}
                          onClick={() => navigate('/my-bookings')}
                        />
                      </UserButton.MenuItems>
                    </UserButton>}
                    <img onClick={()=> setIsMenuOpen(!isMenuOpen)} src={assets.menuIcon} alt="" className={`${isScrolled &&'invert'} h-4`} />
                </div>

                {/* Mobile Menu */}
                <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                        <img src={assets.closeIcon} alt="closemenu" className="h-6.5" />
                    </button>

                    {navLinks.map((link, i) => (
                        <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
                            {link.name}
                        </a>
                    ))}

                          { user && <button className={`${actionBtnClass} cursor-pointer`} onClick={()=>isOwner ? navigate('/owner'):setShowHotelReg(true)} aria-label={isOwner ? 'Go to Dashboard' : 'List Your Hotel'}>
                              {isOwner && <DashboardIcon />}
                              <span>{isOwner ? 'Dashboard' : 'List Your Hotel'}</span>
                          </button>}
                    
                    {!user &&<button onClick={openSignIn} className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500">
                        Login
                    </button>}
                </div>
            </nav> 
    );
}

export default NavBar