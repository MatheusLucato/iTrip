import React, { useState, useEffect } from 'react';
import { TextField, Button, Switch, FormControlLabel, Box } from "@mui/material";
import api from "../../api/api";
import './styles.css';

const Settings: React.FC = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    cnh: '',
  });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const handleUpdateUserData = async () => {
    try {
      await api.put("/api/user/update", userData);
      setEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      setError("Erro ao atualizar dados do usuário.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const toggleEditing = () => {
    setEditing(!editing);
  };

  const handleRoleChange = (selectedRole: string) => {
    setRole(selectedRole);
    setUserData({
      username: '',
      password: '',
      cnh: '',
    });
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="container">
      <h2 className="title"></h2>
      {error && <div className="error-message">{error}</div>}
      <div className="field">
        <label>Username</label>
        <TextField
          name="username"
          value={userData.username}
          onChange={handleChange}
          disabled={!editing}
          fullWidth
        />
      </div>
      <div className="field">
        <label>Password</label>
        <TextField
          name="password"
          type="password"
          value={userData.password}
          onChange={handleChange}
          disabled={!editing}
          fullWidth
        />
      </div>
      {role === 'motorista' && (
        <div className="field">
          <label>CNH</label>
          <TextField
            name="cnh"
            value={userData.cnh}
            onChange={handleChange}
            disabled={!editing}
            fullWidth
          />
        </div>
      )}
      <Box display="flex" justifyContent="space-between" mt={2}>
        {!editing ? (
          <Button variant="contained" color="primary" onClick={toggleEditing}>
            Editar
          </Button>
        ) : (
          <>
            <Button variant="contained" color="primary" onClick={handleUpdateUserData}>
              Salvar
            </Button>
            <Button variant="outlined" color="secondary" onClick={toggleEditing}>
              Cancelar
            </Button>
          </>
        )}
      </Box>
      <div className="role-selection">
        <label>Role</label>
      </div>
      <div className="theme-toggle">
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
            />
          }
          label="Tema Escuro"
        />
      </div>
    </div>
  );
};

export default Settings;
