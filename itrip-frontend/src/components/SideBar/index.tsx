import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBars, faMagnifyingGlass, faChartLine, faMoneyBillTrendUp, faStore, faChartSimple, faGear, faArrowRightFromBracket, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Topbar from '../TopBar';
import api from '../../api/api';

const Sidebar = ({ children }: any) => {
    const [subMenuOpen, setSubMenuOpen] = useState(false)
    const navigate = useNavigate()
    const [hovering, setHovering] = useState(false);

    const menuOptions = [
        
        { title: "Analytics", icon: <FontAwesomeIcon icon={faChartSimple} />, spacing: true, action: "analytics" }
    ]


    const handleMenuClick = (action: string) => {

        switch (action) {
            // TODO
        }
    }

    return (
        <div className="flex h-screen">
            
            <div className={`bg-gray-100 h-screen p-5 pt-5 ${hovering ? "w-60" : "w-20"} duration-300 relative`}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}>
                

                <ul className="pt-2">
                    {menuOptions.map((menu, index) => (
                        <>
                            <li key={index} className={`text-gray-700 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md ${menu.spacing ? "mt-6" : "mt-2"}`} onClick={() => handleMenuClick(menu.action)}>
                                <span className="text-2xl block float-left">
                                    {menu.icon ? menu.icon : <FontAwesomeIcon icon={faChartLine} />}
                                </span>
                                <span className={`text-base font-medium flex-1 duration-200 ${!hovering && "hidden"}`}>{menu.title}</span>
                                
                            </li>

                        </>
                    ))}
                </ul>
            </div>
            <div className="flex-1 flex flex-col">
                <Topbar />
                {children}
            </div>


        </div>
    );
};

export default Sidebar;