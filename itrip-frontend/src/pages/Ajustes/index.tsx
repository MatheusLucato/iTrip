import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../api/api";
import WarningIcon from '@material-ui/icons/Warning';
import eyeClosed from '../../img/Olho Fechado.svg'
import eyeOpen from '../../img/Olho.svg'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export function Ajustes() {
    const navigate = useNavigate();
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
    const [editPassword, setEditPassword] = useState(false);
    const [error, setError] = useState("");
    const [notificacoes, setNotificacoes] = useState(true);
    const [nome, setNome] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("fakePassword");
    const [showSenhaAtual, setShowSenhaAtual] = useState(false);
    const [showNovaSenha, setShowNovaSenha] = useState(false);

    useEffect(() => {
        const nomeStorage = localStorage.getItem('username');
        if (nomeStorage) {
            setNome(nomeStorage);
        }

        const notifPrefs = localStorage.getItem('notificacoes');
        setNotificacoes(notifPrefs === null ? true : notifPrefs === 'true');
    }, []);

    const handleChangePassword = async (e: any) => {
        e.preventDefault();
        if (!editPassword) {
            setEditPassword(true);
            setSenhaAtual('');
            return;
        }
        if (novaSenha !== '' && confirmarNovaSenha !== '' && senhaAtual) {
            if (novaSenha !== confirmarNovaSenha) {
                setError("As senhas não coincidem.");
                return;
            }
            try {
                const token = localStorage.getItem('token')
                const response = await api.put("/api/changePassword", { novaSenha, senhaAtual, token })

                if (response.status === 200) {
                    setError("Senha alterada com sucesso.");
                    localStorage.setItem('token',response.data.token.token)
                } else {
                    setError(response.data?.message || "Erro desconhecido ao mudar a senha.");
                }

                setSenhaAtual('fakePassword');
                setNovaSenha('');
                setConfirmarNovaSenha('');
                setEditPassword(false);
            } catch (error) {
                setError("Erro ao mudar a senha.");
                setSenhaAtual('fakePassword');
                setNovaSenha('');
                setConfirmarNovaSenha('');
                setEditPassword(false);
            }
        }
        else {
            setError("Preencha todos os campos!")
        }

    };

    const handleNotificationChange = (e: any) => {
        const newNotifValue = e.target.checked;
        setNotificacoes(newNotifValue);
    };

    const handleGoHome = () => {
        navigate('/home');
    };

    const handleAccountDeletion = async () => {
        const token = localStorage.getItem('token')
        const response = await api.put("/api/deleteAccount", { token })

        if (response.status === 200) {
            setError("Conta deletada com sucesso.");
            localStorage.removeItem('username')
            localStorage.removeItem('token')
            navigate('login')
        } else {
            setError(response.data?.message || "Erro desconhecido ao mudar a senha.");
        }
    };

    return (
        <div className='container mx-auto p-1 max-w-4xl'>
            <h1 className="text-2xl font-bold text-center mb-6">Ajustes</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}

            <div>
                <h2 className="text-xl font-semibold mb-4">Usuário</h2>
                <label className="block">
                    Nome:
                    <input type="text" value={nome} disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </label>
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Mudança de Senha</h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block">
                            Senha Atual:
                            <div className="password-input-container relative mb-4">
                            <input disabled={!editPassword} value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" type={showSenhaAtual && editPassword ? 'text' : 'password'} />
                            <img src={showSenhaAtual ? eyeOpen : eyeClosed} alt="toggle visibility" className="absolute right-3 top-3 cursor-pointer" onClick={() => setShowSenhaAtual(!showSenhaAtual)} />
                            </div>
                            </label>
                    </div>
                    <div>
                        <label className="block">
                            Nova Senha:
                            <div className="password-input-container relative mb-4">
                                <input disabled={!editPassword} value={novaSenha} onChange={e => setNovaSenha(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" type={showNovaSenha ? 'text' : 'password'} />
                                <img src={showNovaSenha ? eyeOpen : eyeClosed} alt="toggle visibility" className="absolute right-3 top-3 cursor-pointer" onClick={() => setShowNovaSenha(!showNovaSenha)} />
                            </div>
                            </label>
                    </div>
                    <div>
                        <label className="block">
                            Confirmar Nova Senha:
                            <div className="password-input-container relative mb-4">
                            <input disabled={!editPassword} value={confirmarNovaSenha} onChange={e => setConfirmarNovaSenha(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" type={showNovaSenha ? 'text' : 'password'} />
                            <img src={showNovaSenha ? eyeOpen : eyeClosed} alt="toggle visibility" className="absolute right-3 top-3 cursor-pointer" onClick={() => setShowNovaSenha(!showNovaSenha)} />
                            </div>
                        </label>
                    </div>
                    <button type="submit" className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200">{editPassword ? "Salvar Nova Senha" : "Mudar Senha"}</button>
                </form>
                {editPassword &&
                <div className="bg-yellow-200 border-l-4 border-yellow-600 text-yellow-700 p-4 mt-4" role="alert">
                    <p className="font-bold flex items-center"><WarningIcon /> Atenção</p>
                    <p>Cuidado, preste muita atenção ao alterar sua senha!</p>
                </div>
                }
                {editPassword &&
                    <button onClick={() => {
                        setEditPassword(false);
                        setNovaSenha('');
                        setConfirmarNovaSenha('');
                        setSenhaAtual('fakePassword')
                    }} className="w-full py-2 mt-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200">{"Cancelar"}</button>
                }
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Exclusão da Conta</h2> 
                <button onClick={handleAccountDeletion} className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200">
                    Solicitar Exclusão da Conta <DeleteForeverIcon></DeleteForeverIcon></button>
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Preferências de Notificação</h2>
                <label className="block">
                    <input type="checkbox" checked={notificacoes} onChange={handleNotificationChange} className="mr-2 leading-tight" />
                    Receber Notificações
                </label>
            </div>
            <button onClick={handleGoHome} className="mt-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:border-green-700 focus:ring focus:ring-green-200">Voltar para Home</button>
        </div>
    );
}
