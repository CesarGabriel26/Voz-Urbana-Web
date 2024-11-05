import React, { useState, useEffect } from 'react';
import { Form, ButtonToolbar, Loader } from 'rsuite';

import logo from '../../assets/LogoOutile.png';

import { FaFacebook, FaGoogle } from "react-icons/fa";

import { loginUser } from '../../utils/Api';

import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    let interval;

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);

    const checkUserDataRecivedFromSignUp = () => {
        const user = location.state?.user;
        if (user && user.email && user.senha) {
            setEmail(user.email);
            setSenha(user.senha);
        }
    }

    useEffect(checkUserDataRecivedFromSignUp, [location.state?.user])

    const confirmar = async () => {
        clearInterval(interval);
        interval = setInterval(() => {
            setErro("");
            clearInterval(interval);
        }, 1500);

        if (email !== "" && senha !== "") {
            setLoading(true);
            let resp = await loginUser(email, senha);

            setLoading(false);

            if (!resp.error) {
                localStorage.setItem('usuario', resp.content);
                navigate("/");
            } else {
                setErro(resp.error);
            }

        } else {
            if (email === "") {
                setErro("Preencha o Email");
                return;
            }

            if (senha === "") {
                setErro("Preencha a Senha");
                return;
            }
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '100vh',
        }} >

            <div className='bg-primary d-none d-md-flex' style={{
                flexDirection: 'column',
                flex: 1,
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: 50
            }} >

                <img src={logo} alt='logo Voz Urbana' style={{ width: 140, height: 140 }} />

                <h1 className='text-light'>Seja bem-vindo!</h1>
                <h5 className='text-light'>
                    Acesse sua conta de modo fácil
                    para poder aproveitar dos nossos
                    serviços!
                </h5>

            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 50,
                flex: 1
            }} >
                <div
                    className='border-primary'
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
                        borderWidth: 2,
                        borderStyle: 'solid'
                    }}
                >
                    <Form fluid={true}>
                        <Form.Group controlId="email">
                            <Form.ControlLabel className='text-primary bold'>Email</Form.ControlLabel>
                            <Form.Control className='border-primary' name="email" type="email" value={email} onChange={setEmail} />
                            <Form.HelpText>Email é obrigatório</Form.HelpText> {/* Atualizado para mensagem em português */}
                        </Form.Group>
                        <Form.Group controlId="senha">
                            <Form.ControlLabel className='text-primary bold'>Senha</Form.ControlLabel>
                            <Form.Control className='border-primary' name="senha" type="password" value={senha} onChange={setSenha} />
                            <Form.HelpText>Senha é obrigatória</Form.HelpText> {/* Atualizado para mensagem em português */}
                        </Form.Group>
                        <Form.Group style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }} >
                            <ButtonToolbar>
                                <button className='btn btn-primary' ><p className='m-0' >Login com <FaGoogle /></p></button>
                                <button className='btn btn-primary' ><p className='m-0' >Login com <FaFacebook /></p></button>
                            </ButtonToolbar>
                        </Form.Group>
                        <Form.Group style={{ display: 'flex', width: '100%', justifyContent: 'center' }} >
                            <ButtonToolbar>
                                <Form.ControlLabel className='text-dark sub'>Não possui uma conta?</Form.ControlLabel>
                                <Form.ControlLabel className='text-dark sub'><Link to="/SignUp">Registre-se</Link></Form.ControlLabel>
                            </ButtonToolbar>
                        </Form.Group>
                        <Form.Group style={{ display: 'flex', width: '100%', justifyContent: 'center' }} >
                            <ButtonToolbar>
                                <Form.ControlLabel className='text-dark sub' >
                                    {erro ? erro : (
                                        loading ? (<Loader size="sm" content="Verificando informações" />) : null
                                    )}
                                </Form.ControlLabel>
                            </ButtonToolbar>
                        </Form.Group>
                        <Form.Group style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }} >
                            <button className='btn btn-primary' onClick={confirmar} >Entrar</button>
                            <button className='btn btn-primary' onClick={() => navigate(-1)} >Voltar</button>
                        </Form.Group>
                    </Form>
                </div>
            </div>

        </div>
    );
}
