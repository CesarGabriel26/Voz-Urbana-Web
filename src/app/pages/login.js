import React, { useState, useEffect } from 'react';
import { Form, ButtonToolbar, Button, Loader } from 'rsuite';

import logo from '../assets/LogoOutile.png';

import { FaFacebook, FaGoogle } from "react-icons/fa";

import { loginUser } from '../utils/Api';

import { Link, useNavigate, useLocation} from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    let interval;

    const [Email, setEmail] = useState("");
    const [Senha, setSenha] = useState("");

    const [Erro, setErro] = useState("");
    const [Loading, setLoading] = useState(false);

    const [User, setLocalUser] = useState({});

    const checkUser = async () => {
        let user = localStorage.getItem('usuario') || null;
        if (user != null) {
            setLocalUser(user)
            navigate("/");
        }
    };

    const checkUserDataRecivedFromSingUp = () => {
        const user = location.state?.user;
        if (user && user.email && user.senha) {
            setEmail(user.email);
            setSenha(user.senha);
        }
    }

    useEffect(checkUserDataRecivedFromSingUp, [location.state?.user])
    useEffect(()=>{checkUser()});

    const Confirmar = async () => {
        clearInterval(interval);
        interval  = setInterval(() => {
            setErro("");
            clearInterval(interval);
        }, 1500);

        if (Email !== "" && Senha !== "") {
            setLoading(true)
            let resp = await loginUser(Email, Senha);

            setLoading(false)

            if (!resp.error) {
                localStorage.setItem('usuario', resp.content);
                console.log(User);
                navigate("/");
            } else {
                setErro(resp.error);
            }

        } else {
            if (Email === "") {
                setErro("Preencha o Email");
                return;
            }

            if (Senha === "") {
                setErro("Preencha a Senha");
                return;
            }
        }
    };

    return (
        <div style={{
            display: 'flex',
            width: '100%',
            height: '100vh',
        }} >

            <div className='primary-bg' style={{
                display: 'flex',
                flexDirection: 'column',
                width: '50%',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: 50
            }} >

                <img src={logo} alt='logo Voz Urbana' style={{ width: 140, height: 140 }} />

                <h1>Seja bem vindo!</h1>
                <h5>
                    Acesse sua conta de modo fácil
                    para poder aproveitar dos nossos
                    serviços!
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
            }} >
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
                    <Form fluid={true}>
                        <Form.Group controlId="email">
                            <Form.ControlLabel className='primary-text bold' >Email</Form.ControlLabel>
                            <Form.Control className='primary-border' name="email" type="email" value={Email} onChange={setEmail} />
                            <Form.HelpText>Email is required</Form.HelpText>
                        </Form.Group>
                        <Form.Group controlId="Senha">
                            <Form.ControlLabel className='primary-text bold' >Senha</Form.ControlLabel>
                            <Form.Control className='primary-border' name="Senha" type="password" value={Senha} onChange={setSenha} />
                            <Form.HelpText>Password is required</Form.HelpText>
                        </Form.Group>
                        <Form.Group style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }} >
                            <ButtonToolbar>
                                <Button className='primary-border light-bg bold' style={{ borderWidth: 2 }} ><p className='primary-text' >Login com <FaGoogle /></p></Button>
                                <Button className='primary-border light-bg bold' style={{ borderWidth: 2 }} ><p className='primary-text' >Login com <FaFacebook /></p></Button>
                            </ButtonToolbar>
                        </Form.Group>
                        <Form.Group style={{ display: 'flex', width: '100%', justifyContent: 'center' }} >
                            <ButtonToolbar>
                                <Form.ControlLabel className='dark-text sub' >Não possui uma conta?</Form.ControlLabel>
                                <Form.ControlLabel className='dark-text sub' ><Link to="/SignUp">Registre-se</Link></Form.ControlLabel>
                            </ButtonToolbar>
                        </Form.Group>
                        <Form.Group style={{ display: 'flex', width: '100%', justifyContent: 'center' }} >
                            <ButtonToolbar>
                                <Form.ControlLabel className='dark-text sub' >
                                    {Erro? Erro : (
                                            Loading? (<Loader size="sm" content="Small" />) : null
                                        )
                                    }
                                </Form.ControlLabel>
                            </ButtonToolbar>
                        </Form.Group>
                        <Form.Group style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }} >
                            <Button className='primary-bg light-text bold' style={{ borderWidth: 2 }} onClick={Confirmar} >Entrar</Button>
                            <Button onClick={() => navigate(-1)} className='primary-bg light-text bold' style={{ borderWidth: 2 }} >Voltar</Button>
                        </Form.Group>
                    </Form>
                </div>
            </div>

        </div>
    );
}
