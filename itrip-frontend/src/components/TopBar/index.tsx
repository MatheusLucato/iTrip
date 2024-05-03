import { Avatar, Box, IconButton, useTheme } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import userLogo from "../../img/userLogo.png";
import { LogOutIcon } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogoutOutlined } from "@mui/icons-material";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const theme = useTheme();
  const navigate = useNavigate()
  

  async function logout() {
    try {
        deleteTokenLog();
        await api.post("/api/logout");
        localStorage.removeItem("token");
        navigate("/login");
    } catch (error: any) {
        console.log("Não foi possivel realizar o logout!");
    }
}

async function deleteTokenLog() {
    try {
        const token = localStorage.getItem('token')
        const idUser = (await api.post('/api/findUserIdByToken', { token })).data.user_id
        const response = await api.post('/api/deleteTokenLog', { idUser });
    } catch (error: any) {

    }
}

async function user() {
  try {
        navigate("/user");
  } catch (error: any) {
  }
}

  return (
    <div>

      <Box
        display="flex"
        justifyContent="space-between"
        p={2}
        style={{ backgroundColor: "#F3F4F6", borderLeft: "1px", maxHeight: "60px" }}
      >
        <Box
          sx={{ display: "flex", borderRadius: "3px", backgroundColor: "#D1D5DB" }}
        >

        </Box>
        <a href="/home">

          <h1 className="text-gray-700 origin-left font-medium text-2xl duration-300">iTrip</h1>
        </a>

        <Box display="flex">
          <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>
          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>
          <IconButton onClick={user}>
            <Avatar
              style={{ width: "30px", height: "30px" }}
              src={userLogo}
            />
          </IconButton>
          <IconButton onClick={logout}>
            <LogoutOutlined />
          </IconButton>
        </Box>
      </Box>
    </div>
  );
};

export default Topbar;