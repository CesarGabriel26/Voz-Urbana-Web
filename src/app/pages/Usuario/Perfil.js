import React, { useState, useEffect } from 'react';
import { Panel, Avatar, Divider, SelectPicker, Toggle, Message, Input, Button, Modal } from 'rsuite';
import BaseContainer from '../../components/BaseContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import DecodeToken from '../../utils/JWT';
import { updateUser, verifyPassword } from '../../utils/Api';

export default function Perfil() {
    const [userData, setUserData] = useState({
        id: '',
        nome: '',
        email: '',
        pfp: '',
        cpf: '',
        type: '',
        last_update: '',
        created_at: ''
    });

    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('pt-BR');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const [editing, setEditing] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        pfp: '',
        cpf: '',
        senha: '',
        senhaAtual: '' // Campo para a senha atual
    });

    useEffect(() => {
        const tk = localStorage.getItem('usuario') || null;
        if (tk) {
            const user = DecodeToken(tk);
            setUserData(user);
            setFormData({
                nome: user.nome,
                email: user.email,
                pfp: user.pfp,
                senha: '',
                cpf: user.cpf,
                senhaAtual: ''
            });
        }
    }, []);

    useEffect(() => {
        document.body.setAttribute("data-bs-theme", theme);
    }, [theme]);

    const handleChangeTheme = (value) => {
        setTheme(value);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 2000);
    };

    const handleEditToggle = () => {
        setEditing(!editing);
    };

    const handleInputChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };


    const handleSubmit = async () => {
        if (canEdit) {
            delete formData.senhaAtual;

            if (formData.senha === "") {
                formData.senha = null
            }

            let resp = await updateUser(userData.id, formData)
            let tk = resp.content
            if (tk) {
                localStorage.setItem('usuario', tk)
                const user = DecodeToken(tk);
                setUserData(user);
                setFormData({
                    nome: user.nome,
                    email: user.email,
                    pfp: user.pfp,
                    senha: '',
                    cpf: user.cpf,
                    senhaAtual: ''
                });
            }


            setEditing(false);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 2000);
        } else {
            const isPasswordValid = await verifyPassword(userData.id, formData.senhaAtual);

            setCanEdit(isPasswordValid)

            if (!isPasswordValid) {
                Message.error("Senha atual incorreta.");
                return;
            }
        }
    };

    return (
        <BaseContainer>
            <div style={{ padding: 25 }}>
                <Panel shaded bordered className="p-4">
                    {/* Seção de Perfil */}
                    <div className="d-flex align-items-center mb-4">
                        <Avatar size="lg" src={userData.pfp} alt="Foto de Perfil" />
                        <div className="ms-3">
                            <h4 className='text-dark-emphasis'>{userData.nome}</h4>
                            <p className="text-muted">{userData.email}</p>
                        </div>
                    </div>

                    <Divider className='text-dark-emphasis'>Informações do Usuário</Divider>

                    <div className="row mb-4">
                        <div className="col-md-6">
                            <p className='text-dark-emphasis'><strong>CPF:</strong> {userData.cpf}</p>
                        </div>
                        <div className="col-md-6">
                            <p className='text-dark-emphasis'><strong>Tipo:</strong> {userData.type === 1 ? "Admin" : "User"}</p>
                        </div>
                        <div className="col-md-6">
                            <p className='text-dark-emphasis'><strong>Última Atualização:</strong> {new Date(userData.last_update).toLocaleDateString()}</p>
                        </div>
                        <div className="col-md-6">
                            <p className='text-dark-emphasis'><strong>Data de Criação:</strong> {new Date(userData.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Seção de Configurações */}
                    <Divider className='text-dark-emphasis'>Configurações</Divider>

                    <div className="row">
                        {/* Tema */}
                        <div className="col-md-4">
                            <p className='text-dark-emphasis'><strong>Tema:</strong></p>
                            <SelectPicker
                                data={[
                                    { label: 'Claro', value: 'light' },
                                    { label: 'Escuro', value: 'dark' }
                                ]}
                                value={theme}
                                onChange={handleChangeTheme}
                                style={{ width: '100%' }}
                            />
                        </div>

                        {/* Idioma */}
                        <div className="col-md-4">
                            <p className='text-dark-emphasis'><strong>Idioma:</strong></p>
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
                            <p className='text-dark-emphasis'><strong>Perfil Anônimo:</strong></p>
                            <Toggle
                                checked={isAnonymous}
                                onChange={setIsAnonymous}
                                checkedChildren="Sim"
                                unCheckedChildren="Não"
                            />
                        </div>
                    </div>

                    <Divider></Divider>
                   
                    {/* Botão para editar perfil */}
                    <Button appearance="primary" onClick={handleEditToggle}>
                        {editing ? 'Cancelar' : 'Editar Perfil'}
                    </Button>

                    {/* Modal de Edição */}
                    <Modal open={editing} onClose={handleEditToggle}>
                        <Modal.Header>
                            <Modal.Title>Editar Perfil</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {
                                canEdit ? <>
                                    <Input
                                        placeholder="Nome"
                                        value={formData.nome}
                                        onChange={(value) => handleInputChange('nome', value)}
                                        style={{ marginBottom: 10 }}
                                    />
                                    <Input
                                        placeholder="Email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(value) => handleInputChange('email', value)}
                                        style={{ marginBottom: 10 }}
                                    />
                                    <Input
                                        placeholder="Foto de Perfil (URL)"
                                        value={formData.pfp}
                                        onChange={(value) => handleInputChange('pfp', value)}
                                        style={{ marginBottom: 10 }}
                                    />
                                    <Input
                                        placeholder="Nova Senha"
                                        type="password"
                                        value={formData.senha}
                                        onChange={(value) => handleInputChange('senha', value)}
                                    />
                                </> : <>
                                    <Input
                                        placeholder="Senha Atual"
                                        type="password"
                                        value={formData.senhaAtual}
                                        onChange={(value) => handleInputChange('senhaAtual', value)}
                                        style={{ marginBottom: 10 }}
                                    />
                                </>
                            }

                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={handleSubmit} appearance="primary">Salvar</Button>
                            <Button onClick={handleEditToggle} appearance="subtle">Cancelar</Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Mensagem de Feedback */}
                    {showMessage && <Message type="info" showIcon>Configurações atualizadas!</Message>}
                </Panel>
            </div>
        </BaseContainer>
    );
}
