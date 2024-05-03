import React, { useState } from 'react';
import { TextField, Button } from "@mui/material";
import api from "../../api/api";
import './styles.css';

const User = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    cnh: '', // Adicionando o campo CNH para motoristas
  });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState('');

  const handleUpdateUserData = async () => {
    try {
      await api.put("/api/user/update", userData);
      setEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
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
    // Reset userData when role changes to clear previous role-specific data
    setUserData({
      username: '',
      password: '',
      cnh: '',
    });
  };

  return (
    <div className="container">
      <div className="role-buttons">
        <Button onClick={() => handleRoleChange('cliente')}>Cliente</Button>
        <Button onClick={() => handleRoleChange('motorista')}>Motorista</Button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="field">
        <label>Username</label>
        <TextField
          name="username"
          value={userData.username}
          onChange={handleChange}
          disabled={!editing}
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
        />
      </div>
      {/* Render CNH field only if role is 'motorista' */}
      {role === 'motorista' && (
        <div className="field">
          <label>CNH</label>
          <TextField
            name="cnh"
            value={userData.cnh}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>
      )}
      <div className="buttons">
        {!editing ? (
          <Button onClick={toggleEditing}>Editar</Button>
        ) : (
          <>
            <Button onClick={handleUpdateUserData}>Salvar</Button>
            <Button onClick={toggleEditing}>Cancelar</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default User;
