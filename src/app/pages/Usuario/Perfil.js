import React, { useState, useEffect } from 'react';
import { Panel, Avatar, Divider, SelectPicker, Toggle } from 'rsuite';
import BaseContainer from '../../components/BaseContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import DecodeToken from '../../utils/JWT';

export default function Perfil() {
    const [userData, setUserData] = useState({
        id: '',
        nome: '',
        email: '',
        pfp: '',
        cpf: '',
        type: '',
        last_update: ''
    });

    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('pt-BR');
    const [isAnonymous, setIsAnonymous] = useState(false);

    useEffect(() => {
        let tk = localStorage.getItem('usuario') || null
        if (tk) {
            let user = DecodeToken(tk)
            setUserData(user);
        }
    }, []);

    useEffect(() => {
        document.body.setAttribute("data-bs-theme", theme)
    }, [theme])

    return (
        <BaseContainer>
            <div style={{ padding: 25 }} >
                <Panel shaded bordered className="p-4">
                    {/* Seção de Perfil */}
                    <div className="d-flex align-items-center">
                        <Avatar size="lg" src={userData.pfp} alt="Foto de Perfil" />
                        <div className="ms-3">
                            <h4>{userData.nome}</h4>
                            <p className="text-muted">{userData.email}</p>
                        </div>
                    </div>

                    <Divider>Informações do Usuário</Divider>

                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>CPF:</strong> {userData.cpf}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Tipo:</strong> {userData.type === 1 ? "Admin" : "User"}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Última Atualização:</strong> {new Date(userData.last_update).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Seção de Configurações */}
                    <Divider>Configurações</Divider>

                    <div className="row">
                        {/* Tema */}
                        <div className="col-md-4">
                            <p><strong>Tema:</strong></p>
                            <SelectPicker
                                data={[
                                    { label: 'Claro', value: 'light' },
                                    { label: 'Escuro', value: 'dark' }
                                ]}
                                value={theme}
                                onChange={setTheme}
                                style={{ width: '100%' }}
                            />
                        </div>

                        {/* Idioma */}
                        <div className="col-md-4">
                            <p><strong>Idioma:</strong></p>
                            <SelectPicker
                                data={[
                                    { label: 'Português', value: 'pt-BR' },
                                    { label: 'Inglês', value: 'en' },
                                    { label: 'Espanhol', value: 'es' }
                                ]}
                                value={language}
                                onChange={setLanguage}
                                style={{ width: '100%' }}
                            />
                        </div>

                        {/* Anonimato */}
                        <div className="col-md-4">
                            <p><strong>Perfil Anônimo:</strong></p>
                            <Toggle
                                checked={isAnonymous}
                                onChange={setIsAnonymous}
                                checkedChildren="Sim"
                                unCheckedChildren="Não"
                            />
                        </div>
                    </div>
                </Panel>
            </div>
        </BaseContainer>
    );
}
