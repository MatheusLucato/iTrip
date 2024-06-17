import { Box, IconButton, useTheme } from "@mui/material";

import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { LogoutOutlined } from "@mui/icons-material";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate()

  async function logout() {
    try {
        deleteTokenLog();
        await api.post("/api/logout");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("motorista");
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

const handleSettingsClick = () => {
  navigate("/settings");
};


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
          <IconButton onClick={handleSettingsClick}>
            <SettingsOutlinedIcon />
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