import React, { useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Steps, Loader, Input, Panel, FlexboxGrid, Avatar, Divider } from 'rsuite';
import BaseContainer from '../../components/BaseContainer';
import { getUserById, getPetitionsByUser, updatePetition, deletePetition } from '../../utils/Api';
import PetitionCard from '../../components/PetitionCard';
import { FaCaretRight } from "react-icons/fa6";
import { formatDate } from '../../utils/Parser';
import DecodeToken from '../../utils/JWT';
import { ADMIN_USER_TYPE } from '../../utils/consts';
import { deletePetitionControl, updatePetitionStatus } from '../../controllers/petitionController';
import ActionButtons from '../../components/ActionButtons';

export default function AbaixoAssinadosDoUsuario() {
  const [petitions, setPetitions] = useState([]);
  const [petition, setPetition] = useState(null);
  const [filteredPetitions, setFilteredPetitions] = useState([]);
  const [loaded, setLoaded] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  const loadList = async () => {
    try {
      setLoaded(false);
      const userToken = localStorage.getItem('usuario');
      const user = DecodeToken(userToken);
      setCurrentUser(user);
      const rest = await getPetitionsByUser(user.id);
      if (!rest.error) {
        setPetitions(rest.content);
        setFilteredPetitions(rest.content || []);
      }
      setLoaded(true);
    } catch (error) {
      console.error(error);
      setLoaded(true);
    }
  };

  const handleSearch = (value) => {
    const term = value?.toLowerCase() || '';
    setSearchTerm(value);
    const filtered = petitions.filter((petition) => {
      const title = petition.titulo?.toLowerCase() || '';
      const content = petition.content?.toLowerCase() || '';
      return title.includes(term) || content.includes(term);
    });
    setFilteredPetitions(filtered);
  };

  const loadPetition = async (pet) => {
    setLoaded(false);
    const userResp = await getUserById(pet.user_id);
    setPetition(pet);
    setUser(userResp.content);
    setLoaded(true);
  };





  useEffect(() => {
    loadList();
  }, []);

  return (
    <BaseContainer flex={true} footer={false}>
      <section style={{ padding: 15, flex: 1, display: 'flex', flexDirection: 'column', borderRightWidth: 2, borderRightStyle: 'solid' }}
        className='border-primary'
      >
        <h3 className='text-primary-emphasis mb-3'>Reclamações Recentes</h3>

        <Input
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Pesquisar reclamações..."
          style={{ marginBottom: 15 }}
        />

        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 25, overflowY: 'scroll' }}>
          {loaded ? (
            filteredPetitions.length > 0 ? (
              filteredPetitions.map((petition, index) => (
                <PetitionCard
                  key={index}
                  abaixoAssinado={petition}
                  searchTerm={searchTerm}
                  buttons={[{
                    text: <>Ver main <FaCaretRight /></>,
                    onclick: () => { loadPetition(petition); }
                  }]}
                />
              ))
            ) : <p className='text-dark-emphasis'>Nenhuma Petição encontrada.</p>
          ) : <Loader size="md" />}
        </div>
      </section>

      <section style={{ padding: 15, flex: 1, display: 'flex', flexDirection: 'column' }}
        className='d-none d-md-flex border-primary'
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} >
          {loaded ? (
            petition ? (
              <Panel bordered shaded style={{ padding: 20, flex: 1 }}>
                <section style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <Avatar
                    src={user.pfp}
                    size="lg"
                    circle
                    alt='User Profile'
                    style={{ marginRight: 20 }}
                  />
                  <div>
                    <p className='dark-text m-0'>Petição criada por: <strong>{user.nome}</strong></p>
                    <p className='dark-text m-0'>Em: {formatDate(petition.data, true)}</p>
                  </div>
                </section>

                <Divider />

                <section style={{ marginBottom: 20 }}>
                  <h2>{petition.titulo || 'Título da Petição'}</h2>
                  <FlexboxGrid justify="start" align="top">
                    <FlexboxGrid.Item style={{ paddingLeft: 20, minHeight: 150, flex: 1 }}>
                      <p className='dark-text' style={{ textAlign: 'justify' }}>{petition.content || 'Descrição da causa.'}</p>
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                </section>

                <Divider />

                <section>
                  <h3>Status da Petição</h3>

                  <p>{petition.signatures} de {petition.required_signatures} assinaturas</p>

                  <ProgressBar
                    style={{ marginBottom: 20, marginTop: 20 }}
                    now={(petition.signatures / petition.required_signatures) * 100}
                    label={`${((petition.signatures / petition.required_signatures) * 100).toFixed(1)}%`}
                  />

                  <p>Data limite: {formatDate(petition.data_limite, true) || 'Não disponível'}</p>
                </section>

                <Divider />

                <section style={{ display: 'flex', justifyContent: 'space-evenly' }} >
                  <ActionButtons petition={petition} reloadFunction={() => { loadPetition(petition) }} currentUser={currentUser} />
                </section>

              </Panel>
            ) : (
              <h4 className='text-dark-emphasis'>Selecione uma petição para visualizar os detalhes.</h4>
            )
          ) : <Loader size="md" />}
        </div>
      </section>
    </BaseContainer>
  );
}
