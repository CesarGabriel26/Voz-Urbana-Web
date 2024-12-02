import React, { useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Loader, Input, Panel, FlexboxGrid, Avatar, Divider } from 'rsuite';
import BaseContainer from '../../components/BaseContainer';
import { getUserById, getPetitionsByUser } from '../../utils/Api';
import PetitionCard from '../../components/PetitionCard';
import { FaCaretRight } from "react-icons/fa6";
import { formatDate } from '../../utils/Parser';
import DecodeToken from '../../utils/JWT';
import ActionButtons from '../../components/ActionButtons';
import PriorityCard from '../../components/PriorityCard';
import { useNavigate } from 'react-router-dom';

export default function AbaixoAssinadosDoUsuario() {
  const navigate = useNavigate();
  const [textColor, setTextColor] = useState("text-dark")

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
    setTextColor(localStorage.getItem('theme') === "light" ? 'text-dark' : 'text-light')
    loadList();
  }, []);

  return (
    <BaseContainer flex={true} footer={false}>
      <div style={{ maxHeight: 'calc(100vh - 92px)', display: 'flex', flexDirection: 'row', flex: 1 }}>
        <section
          style={{
            padding: 15,
            display: 'flex',
            maxWidth: '100vw',
            flexDirection: 'column',
            flex: 1
          }}
        >
          <div style={{ flex: 1 }} >
            <h3 className='text-primary-emphasis mb-3'>Reclamações Recentes</h3>

            <Input
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Pesquisar reclamações..."
              style={{ marginBottom: 15 }}
            />
          </div>

          <div
            style={{
              flex: 6,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {
              loaded ? (
                filteredPetitions.length > 0 ? (
                  filteredPetitions.map((abaixoAssinado, i) => (
                    <PriorityCard
                      key={i}
                      searchTerm={searchTerm}
                      prioridade={abaixoAssinado.prioridade}
                      tittle={abaixoAssinado.titulo}
                      date={abaixoAssinado.data}
                      content={abaixoAssinado.content}
                      onPress={() => {
                        navigate('/Abaixo-Assinados-Detalhes', { state: { petitionId: abaixoAssinado.id } })
                      }}
                      extraButtons={
                        [
                          {
                            pressableText: "ver detalhes ao lado",
                            onPress: () => {
                              loadPetition(abaixoAssinado)
                            }
                          }
                        ]
                      }
                      pressableText="ver mais"
                      noMax={true}
                      style={{ marginTop: i === 0 ? 20 : 0, display: 'inline-block' }}
                    />
                  ))
                ) : <p className='text-dark-emphasis'>Nenhuma Petição encontrada.</p>
              ) : <Loader size="md" />
            }
          </div>
        </section>

        <span class="border border-2 border-primary d-none d-md-block" />

        <section style={{ padding: 15, flex: 1, display: 'flex', flexDirection: 'column' }}
          className='d-none d-md-flex'
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
                    <p
                      style={{
                        flex: 1,
                        paddingLeft: 20,
                        textAlign: 'justify',
                      }}
                    >
                      {petition.content.substring(0, 250) + "..." || 'Descrição da causa....'}
                      <a
                        className="a-link"
                        onClick={() => {
                          navigate('/Abaixo-Assinados-Detalhes', { state: { petitionId: petition.id } })
                        }}
                      >
                        <p
                          className={`${textColor} bold`}
                        >
                          Ver mais
                        </p>
                      </a>
                    </p>
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
      </div>

    </BaseContainer>
  );
}
