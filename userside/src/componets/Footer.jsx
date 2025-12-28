import React from 'react'
import { assets } from '../assets/assets'
const Footer = () => {
   
    return (
        <footer className="px-6 pt-8 md:px-16  bg-black lg:px-36 w-full text-white">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-10">
                <div className="md:max-w-96">
                    {/* <img alt="" class="h-12 w-12 rounded-full" src={assets.logo}/> */}
                    <div className='flex justify-items-center gap-3'>
                        <img alt="" className="h-12 w-12 rounded-full" src={assets.logo}/>
                        <p className='mt-2.5 text-2xl font-bold'> BookYour-Comfort</p></div>
                    <p className="mt-4 text-sm">
                    Book Your Comfort is your trusted platform for discovering premium hotels, seamless booking experiences, and personalized stays. We bring comfort, convenience, and quality together so you can relax and enjoy unforgettable travel moments.
                    </p>
                    <div className="flex items-center gap-2 mt-6">
                        <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/googlePlayBtnBlack.svg" alt="google play" className="h-10 w-auto border border-white rounded" />
                        <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/appleStoreBtnBlack.svg" alt="app store" className="h-10 w-auto border border-white rounded" />
                    </div>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
                    <div>
                        <h2 className="font-semibold mb-5">Company</h2>
                        <ul className="text-sm space-y-2">
                            <li><a href="#">Home</a></li>
                            <li><a href="#">About us</a></li>
                            <li><a href="#">Contact us</a></li>
                            <li><a href="#">Privacy policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5">Get in touch</h2>
                        <div className="text-sm space-y-2">
                            <p>+1-234-567-890</p>
                            <p>BYC6614@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center text-sm">
                Copyright {new Date().getFullYear()} © <a href="/home">Book Your-Comfort</a>. All Right Reserved.
            </p>
        </footer>
    )
}

export default Footer