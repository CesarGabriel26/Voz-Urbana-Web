import React, { useState } from 'react';
import { Form, ButtonToolbar, Button, Loader } from 'rsuite';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/LogoOutile.png';
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { createUser } from '../utils/Api';

export default function SignUp() {
    const navigate = useNavigate();
    
    // Estados para os campos do formulário
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [Loading, setLoading] = useState(false);
    const [Erro, setErro] = useState("");

    const handleSubmit = async (data) => {
        setErro("");

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        setLoading(true);
        let user = {
            'nome': username,
            'email': email,
            'senha': senha,
            'pfp': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLMI5YxZE03Vnj-s-sth2_JxlPd30Zy7yEGg&s',
            'cpf': cpf,
        }
        const response = await createUser(user);
        setLoading(false);
        
        if (response.error) {
            setErro(response.error);
        } else {
            navigate("/login", {state: { user: response.content}});
        }
    };

    return (
        <div style={{
            display: 'flex',
            width: '100%',
            height: '100vh',
        }}>
            <div className='primary-bg' style={{
                display: 'flex',
                flexDirection: 'column',
                width: '50%',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: 50
            }}>
                <img src={logo} alt='logo Voz Urbana' style={{ width: 140, height: 140 }} />
                <h1>Seja bem vindo!</h1>
                <h5>
                    Somos uma nova forma de dar voz ao povo em relação aos problemas estruturais de nossas cidades. Buracos na rua, lâmpadas queimadas, terrenos baldios, entre outros problemas finalmente serão comunicados
                    publicamente às autoridades de forma rápida e fácil.
                </h5>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '50%',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 50
            }}>
                <div
                    className='primary-border'
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingLeft: 100,
                        paddingRight: 100,
                        paddingTop: 25,
                        paddingBottom: 25,
                        borderRadius: 10,
                        borderWidth: 2
                    }}
                >
                    <Form fluid={true} onSubmit={handleSubmit}>
                        <Form.Group controlId="name">
                            <Form.ControlLabel className='primary-text bold'>Username</Form.ControlLabel>
                            <Form.Control
                                className='primary-border'
                                name="name"
                                value={username}
                                onChange={(value) => setUsername(value)}
                                required
                            />
                            <Form.HelpText>Username is required</Form.HelpText>
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.ControlLabel className='primary-text bold'>Email</Form.ControlLabel>
                            <Form.Control
                                className='primary-border'
                                name="email"
                                type="email"
                                value={email}
                                onChange={(value) => setEmail(value)}
                                required
                            />
                            <Form.HelpText>Email is required</Form.HelpText>
                        </Form.Group>
                        <Form.Group controlId="CPF">
                            <Form.ControlLabel className='primary-text bold'>CPF</Form.ControlLabel>
                            <Form.Control
                                className='primary-border'
                                name="CPF"
                                value={cpf}
                                onChange={(value) => setCpf(value)}
                                required
                            />
                            <Form.HelpText>CPF is required</Form.HelpText>
                        </Form.Group>
                        <Form.Group controlId="Senha">
                            <Form.ControlLabel className='primary-text bold'>Senha</Form.ControlLabel>
                            <Form.Control
                                className='primary-border'
                                name="Senha"
                                type="password"
                                value={senha}
                                onChange={(value) => setSenha(value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="confirmarSenha">
                            <Form.ControlLabel className='primary-text bold'>Confirmar Senha</Form.ControlLabel>
                            <Form.Control
                                className='primary-border'
                                name="confirmarSenha"
                                type="password"
                                value={confirmarSenha}
                                onChange={(value) => setConfirmarSenha(value)}
                                required
                                autoComplete="off"
                            />
                        </Form.Group>
                        <Form.Group style={{ display: 'flex', width: '100%', justifyContent: 'center' }} >
                            <ButtonToolbar>
                                <Form.ControlLabel className='dark-text sub' >
                                    {Erro ? Erro : (
                                        Loading ? (<Loader size="sm" content="Small" />) : null
                                    )}
                                </Form.ControlLabel>
                            </ButtonToolbar>
                        </Form.Group>
                        <Form.Group style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }} >
                            <ButtonToolbar>
                                <Button className='primary-border light-bg bold' style={{ borderWidth: 2 }} ><p className='primary-text'>Login com <FaGoogle /></p></Button>
                                <Button className='primary-border light-bg bold' style={{ borderWidth: 2 }} ><p className='primary-text'>Login com <FaFacebook /></p></Button>
                            </ButtonToolbar>
                        </Form.Group>
                        <Form.Group style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }} >
                            <Button className='primary-bg light-text bold' style={{ borderWidth: 2 }} type="submit">Criar usuário</Button>
                            <Button onClick={() => navigate(-1)} className='primary-bg light-text bold' style={{ borderWidth: 2 }} >Voltar</Button>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        </div>
    );
}
