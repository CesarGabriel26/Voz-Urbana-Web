import React, { useEffect, useState } from 'react';
import { Form, ButtonToolbar, Button, Panel, Input } from 'rsuite';

import BaseContainer from '../../components/BaseContainer';
import DecodeToken from '../../utils/JWT';
import { createPetition } from '../../utils/Api';
import { useNavigate } from 'react-router-dom';

const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

export default function NovoAbaixoAssinado() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    'title': "",
    'content': "",
    'required_signatures': 100000,
  });
  const [User, setUser] = useState(null);

  const Load = () => {
    let tk = localStorage.getItem('usuario')
    let user = DecodeToken(tk)
    setUser(user)

  }

  const handleSubmit = async () => {
    try {
      const formToSend = {
        'user_id': User.id,
        'causa': formData.title,
        'content': formData.content,
        'required_signatures': formData.required_signatures,
        'status': 0,
      }

      let resp = await createPetition(formToSend)
      if (resp.error) {
        console.log(resp.error);
      } else {
        alert("Abaixo Assinado Registrado")
        navigate(-1)
      }

    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  useEffect(() => {
    Load()
  }, [])

  return (
    <BaseContainer flex={true} footer={false}>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }} >
        <Panel bordered shaded style={{ padding: 20 }}>
          <Form
            onSubmit={handleSubmit}
          >
            <Form.Group controlId="Causa">
              <Form.ControlLabel>Causa / Titulo</Form.ControlLabel>
              <Form.Control
                name="Causa"
                onChange={(value) => handleChange('title', value)}
              />
              <Form.HelpText>required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="Assinatiras">
              <Form.ControlLabel>Assinatiras</Form.ControlLabel>
              <Form.Control
                name="Assinatiras" type='number' min={100000} value={formData.required_signatures}
                onChange={(value) => handleChange('required_signatures', value)}
              />
              <Form.HelpText>required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="Motivo">
              <Form.ControlLabel>Explique o motivo detalhadamente</Form.ControlLabel>
              <Form.Control
                style={{ resize: 'none' }} rows={10} name="Motivo" accepter={Textarea}
                onChange={(value) => handleChange('content', value)}
              />
              <Form.HelpText >required</Form.HelpText>
            </Form.Group>
            <Form.Group>
              <ButtonToolbar>
                <Button className='btn btn-primary' type='submit' >Submit</Button>
                <Button className="btn btn-danger" onClick={() => navigate(-1)} >Cancel</Button>
              </ButtonToolbar>
            </Form.Group>
          </Form>
        </Panel>
      </div>
    </BaseContainer >
  );
}
