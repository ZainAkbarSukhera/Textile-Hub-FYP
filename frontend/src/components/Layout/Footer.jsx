import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";

const Footer = () => {
  // return (
  //   <div className="bg-[#004E5d] text-white">
  //     <div className="grid grid-cols-1 sm:gird-cols-3 lg:grid-cols-4 gap-6 sm:px-8 px-5 py-16 sm:text-center">
  //       <ul className="px-5 text-center sm:text-start flex sm:block flex-col items-center">
  //         <img
  //           src="../../../Logo.png"
  //           alt=""
  //           style={{ filter: "brightness(0) invert(1)" }}
  //         />
  //         <br />
  //         <p>Redefining Pakistan's Textile Industry</p>
  //         <div className="flex items-center mt-[15px]">
  //           <AiFillFacebook size={25} className="cursor-pointer" />
  //           <AiOutlineTwitter
  //             size={25}
  //             style={{ marginLeft: "15px", cursor: "pointer" }}
  //           />
  //           <AiFillInstagram
  //             size={25}
  //             style={{ marginLeft: "15px", cursor: "pointer" }}
  //           />
  //           <AiFillYoutube
  //             size={25}
  //             style={{ marginLeft: "15px", cursor: "pointer" }}
  //           />
  //         </div>
  //       </ul>

  //       <ul className="text-center sm:text-start">
  //         <h1 className="mb-1 font-semibold">Company</h1>
  //         {footerProductLinks.map((link,index) => (
  //           <li key={index}>
  //             <Link
  //               className="text-gray-400 hover:text-teal-400 duration-300
  //                  text-sm cursor-pointer leading-6"
  //               to={link.link}
  //             >
  //               {link.name}
  //             </Link>
  //           </li>
  //         ))}
  //       </ul>

  //       <ul className="text-center sm:text-start">
  //         <h1 className="mb-1 font-semibold">Shop</h1>
  //         {footercompanyLinks.map((link,index) => (
  //           <li key={index}>
  //             <Link
  //               className="text-gray-400 hover:text-teal-400 duration-300
  //                  text-sm cursor-pointer leading-6"
  //               to={link.link}
  //             >
  //               {link.name}
  //             </Link>
  //           </li>
  //         ))}
  //       </ul>

  //       <ul className="text-center sm:text-start">
  //         <h1 className="mb-1 font-semibold">Support</h1>
  //         {footerSupportLinks.map((link,index) => (
  //           <li key={index}>
  //             <Link
  //               className="text-gray-400 hover:text-teal-400 duration-300
  //                  text-sm cursor-pointer leading-6"
  //               to={link.link}
  //             >
  //               {link.name}
  //             </Link>
  //           </li>
  //         ))}
  //       </ul>
  //     </div>

  //     <div
  //       className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10
  //        text-center pt-2 text-gray-400 text-sm pb-8"
  //     >
  //       <span>© 2025 TextileHub </span>
  //       <span>Terms · Privacy Policy</span>
  //       {/* <div className="sm:block flex items-center justify-center w-full">
  //         <img
  //           src="https://hamart-shop.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter-payment.a37c49ac.png&w=640&q=75"
  //           alt=""
  //         />
  //       </div> */}
  //     </div>
  //   </div>
  // );

  return (
    <footer className="bg-[#004E5d] text-white">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20 px-4 py-12">
        {/* Brand Column */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <img
            src="https://i.ibb.co/8KNKx97/Logo.png"
            alt="Logo"
            className="w-40 mb-4 ml-8 filter brightness-0 invert"
          />
          <p className="text-sm">Redefining Pakistan's Textile Industry</p>
          <div className="flex gap-4 mt-4 ml-10">
            <AiFillFacebook size={22} className="hover:text-teal-400 cursor-pointer" />
            <AiOutlineTwitter size={22} className="hover:text-teal-400 cursor-pointer" />
            <AiFillInstagram size={22} className="hover:text-teal-400 cursor-pointer" />
            <AiFillYoutube size={22} className="hover:text-teal-400 cursor-pointer" />
          </div>
        </div>
  
        {/* Links Column 1 */}
        <div>
          <h3 className="text-base font-semibold mb-3">Company</h3>
          <ul className="space-y-2">
            {footerProductLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.link}
                  className="text-gray-300 hover:text-teal-400 text-sm transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
  
        {/* Links Column 2 */}
        <div>
          <h3 className="text-base font-semibold mb-3">Shop</h3>
          <ul className="space-y-2">
            {footercompanyLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.link}
                  className="text-gray-300 hover:text-teal-400 text-sm transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
  
        {/* Links Column 3 */}
        <div>
          <h3 className="text-base font-semibold mb-3">Support</h3>
          <ul className="space-y-2">
            {footerSupportLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.link}
                  className="text-gray-300 hover:text-teal-400 text-sm transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
  
      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-300">
          <span>© 2025 TextileHub</span>
          <span className="mt-2 sm:mt-0">Terms · Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
  
};

export default Footer;
