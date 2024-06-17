import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHippo, faChartLine, faCar, faPaperPlane, faRoad } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Topbar from '../TopBar';
import api from '../../api/api';
import EditRoadIcon from '@mui/icons-material/EditRoad';

const Sidebar = ({ children }: any) => {
    const [subMenuOpen, setSubMenuOpen] = useState(false)
    const navigate = useNavigate()
    const [hovering, setHovering] = useState(false);
    const [motorista, setMotorista] = useState<boolean>(false);

    useEffect(() => {
        const isMotorista = localStorage.getItem('motorista') === '1';
        setMotorista(isMotorista);
    }, []);

    const menuOptions = [
        { title: "Solicitar viagem", icon: <FontAwesomeIcon icon={faPaperPlane} />, action: "/requestTravel" },
        { title: "Ver solicitaçoẽs", icon: <FontAwesomeIcon icon={faCar} />, action: "/viewRequest" },
        { title: "Minhas solicitaçoẽs", icon: <FontAwesomeIcon icon={faRoad} />, action: "/myTravels" }
    ]

    const handleMenuClick = (action: any) => {
        navigate(action);
    }

    return (
        <div className="flex h-screen">
            <div className={`bg-gray-100 h-screen p-5 pt-5 ${hovering ? "w-60" : "w-20"} duration-300 relative`}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}>

                <ul className="pt-8">
                    {menuOptions.map((menu, index) => {
                        
                        if (menu.action === "/viewRequest" && !motorista) {
                            return null; 
                        }

                        return (
                            <li key={index} className={`text-gray-700 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md mt-2`} onClick={() => handleMenuClick(menu.action)}>
                                <span className="text-2xl block float-left">
                                    {menu.icon}
                                </span>
                                <span className={`text-base font-medium flex-1 duration-200 ${!hovering && "hidden"}`}>{menu.title}</span>
                            </li>
                        );
                    })}
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