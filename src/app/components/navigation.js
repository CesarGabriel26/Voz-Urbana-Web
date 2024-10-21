import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AbaixoAssinados from '../pages/Peticoes/AbaixoAssinados';

import Login from '../pages/Usuario/login';
import Home from '../pages/Usuario/Home';
import SignUp from '../pages/Usuario/SignUp';

import Reclamacoes from '../pages/Reclamacoes/Reclamacoes';
import DetalhesReclamacao from '../pages/Reclamacoes/Detalhes';
import ReclamacoesDoUsuario from '../pages/Reclamacoes/DoUsuario';
import NovaReclamação from '../pages/Reclamacoes/NovaReclamação';

export default function NavigationRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Complaints" element={<Reclamacoes />} />
        <Route path="/Complaint-Details" element={<DetalhesReclamacao />} />
        <Route path="/User-Complaint" element={<ReclamacoesDoUsuario />} />
        <Route path="/New-Complaint" element={<NovaReclamação />} />

        <Route path="/Abaixo-Assinados" element={<AbaixoAssinados />} />

        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

