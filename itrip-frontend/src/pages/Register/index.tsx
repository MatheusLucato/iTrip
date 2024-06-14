import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../api/api";
import eyeClosed from '../../img/Olho Fechado.svg';
import eyeOpen from '../../img/Olho.svg';
import InputMask from 'react-input-mask';

export function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("");
    const [cpf, setCpf] = useState("");
    const [cep, setCep] = useState("");
    const [cnh, setCnh] = useState("");

    const handleRegister = async (e: any) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
            setError("CPF inválido.");
            return;
        }
        if (!/^\d{5}-\d{3}$/.test(cep)) {
            setError("CEP inválido.");
            return;
        }
        if (role === 'motorista' && !(/^\d{11}$/.test(cnh))) {
            setError("CNH inválida. A CNH deve conter exatamente 11 dígitos.");
            return;
        }

        try {
            const isMotorista = role === 'motorista';
            const registerData = { username, cpf, cep, password, isMotorista, cnh: isMotorista ? cnh : null };
            const response = await api.post("/api/register", registerData);
            const { token } = response.data;

            if (token && token.token) {
                localStorage.setItem("token", token.token);
                navigate("/home");
            } else {
                setError("Credenciais inválidas. Verifique seu e-mail e senha.");
            }
        } catch {
            setError('Ocorreu um erro ao registrar. Por favor, tente novamente mais tarde.');
        }
    };

    const handleBack = () => {
        setError("");
        setRole("");
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className='body bg-gray-100 flex justify-center items-center h-screen'>
            <div className="container bg-white p-8 rounded-lg shadow-md w-96">
                {role ? (
                    <form onSubmit={handleRegister}>
                        <h1 className="text-xl font-bold mb-4 text-center">{role === 'motorista' ? 'Cadastro Motorista' : 'Cadastro Passageiro'}</h1>
                        <input type="text" placeholder="Nome" className="input border border-gray-300 p-2 w-full mb-4" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        <InputMask mask="999.999.999-99" placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} className="input border border-gray-300 p-2 w-full mb-4" required />
                        <InputMask mask="99999-999" placeholder="CEP" value={cep} onChange={(e) => setCep(e.target.value)} className="input border border-gray-300 p-2 w-full mb-4" required />
                        {role === 'motorista' && (
                            <InputMask mask="99999999999" placeholder="CNH" value={cnh} onChange={(e) => setCnh(e.target.value)} className="input border border-gray-300 p-2 w-full mb-4" required />
                        )}
                        <div className="password-input-container relative mb-4">
                            <input className="input border border-gray-300 p-2 w-full" type={showPassword ? "text" : "password"} placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <img className="password-icon absolute inset-y-0 right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" src={showPassword ? eyeOpen : eyeClosed} onClick={togglePasswordVisibility} alt="Toggle password visibility" />
                        </div>
                        <div className="relative mb-4">
                            <input className="input border border-gray-300 p-2 w-full" type={showPassword ? "text" : "password"} placeholder="Confirma senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                        <div className="flex justify-between items-center mt-4">
                            <button className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={handleBack}>Voltar</button>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Cadastrar</button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <h1 className="text-xl font-bold mb-4 text-center">Selecione o tipo de usuário</h1>
                        <button className="btn bg-blue-500 hover:bg-blue-700 text-white w-full p-2 mb-4" onClick={() => setRole('motorista')}>Motorista</button>
                        <button className="btn bg-green-500 hover:bg-green-700 text-white w-full p-2" onClick={() => setRole('passageiro')}>Passageiro</button>
                    </div>
                )}
            </div>
        </div>
    );
}
