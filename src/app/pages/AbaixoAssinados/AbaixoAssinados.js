import React, { useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Loader, Input, Panel, FlexboxGrid, Avatar, Divider } from 'rsuite';

import BaseContainer from '../../components/BaseContainer';
import { listPetitions, getUserById } from '../../utils/Api';
import PetitionCard from '../../components/PetitionCard';
import { formatDate } from '../../utils/Parser';
import { ADMIN_USER_TYPE } from '../../utils/consts';
import { loadCurrentUserData } from '../../controllers/userController';
import ActionButtons from '../../components/ActionButtons';

export default function AbaixoAssinados() {

  const [Petitions, setPetitions] = useState([]);
  const [petition, setPetition] = useState(null);
  const [FilteredPetitions, setFilteredPetitions] = useState([]);
  const [loaded, setLoaded] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);


  const loadList = async () => {
    try {
      setLoaded(false);
      let rest = await listPetitions();
      if (!rest.error) {
        setPetitions(rest.content);
        setFilteredPetitions(rest.content);
      } else {
        setError('Erro ao carregar petições. Tente novamente mais tarde.');
      }
    } catch (error) {
      setError('Erro ao carregar petições. Tente novamente mais tarde.');
    } finally {
      setLoaded(true);
    }
  };

  const handleSearch = (value) => {
    const term = value?.toLowerCase() || '';
    setSearchTerm(value);

    const filtered = Petitions.filter((Petition) => {
      const titulo = Petition.titulo?.toLowerCase() || '';
      const content = Petition.content?.toLowerCase() || '';
      return titulo.includes(term) || content.includes(term);
    });

    setFilteredPetitions(filtered);
  };

  const loadPetition = async (pet) => {
    setLoaded(false)

    let userResp = await getUserById(pet.user_id);
    setPetition(pet)
    setUser(userResp.content)

    setLoaded(true)
  }

  useEffect(() => {
    loadList()

    const [user, ok] = loadCurrentUserData();
    if (ok) {
      setCurrentUser(user)
    } else {
      setCurrentUser(null)
    }
  }, [])

  return (
    <BaseContainer flex={true} footer={false}>
      
      <section
        style={{ padding: 15, flexGrow: 1, flex: 1, display: 'flex', flexDirection: 'column'}}
      >
        <h3 className='text-primary-emphasis mb-3'>Abaixo-Assinados Recentes</h3>

        {/* Barra de pesquisa */}
        <Input
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Pesquisar reclamações..."
          style={{ marginBottom: 15 }}
        />
        {error && <p className="text-danger">{error}</p>}


        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 25, overflowY: 'scroll' }}>
          {
            loaded ? (
              FilteredPetitions.length > 0 ? (
                FilteredPetitions.map((petition, index) => (
                  (petition.aberto || (currentUser && currentUser.type === ADMIN_USER_TYPE)) ?
                    <PetitionCard
                      key={index}
                      abaixoAssinado={petition}
                      searchTerm={searchTerm}
                      buttons={[
                        {
                          text: <>Vsualizar </>,
                          onclick: () => { loadPetition(petition) }
                        }
                      ]}
                    />
                    : null
                ))
              ) : <p className='text-dark-emphasis' >Nenhuma Petição encontrada.</p>
            ) : <Loader size="md" />
          }
        </div>
      </section>

      <span class="border border-2 border-primary d-none d-md-block"></span>

      <section
        className='d-none d-md-flex'
        style={{ padding: 15, flexGrow: 1, flex: 1, display: 'flex', flexDirection: 'column' }}
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
                  <ActionButtons petition={petition} reloadFunction={()=>{loadPetition(petition)}} currentUser={currentUser} />
                </section>

              </Panel>

            ) : <div> <h4 className='text-dark-emphasis'>Selecione uma petição para visualizar os detalhes.</h4> </div>
          ) : (
            <Loader content="Carregando detalhes..." />
          )}
        </div>
      </section>

    </BaseContainer >
  );
}
