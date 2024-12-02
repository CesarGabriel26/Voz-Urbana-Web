import React, { useEffect, useState } from 'react';
import { Carousel, Loader } from 'rsuite';
import { useNavigate } from 'react-router-dom';

import mapPlaceHolder from '../../assets/mapPlaceHolder.png';
import { listPetitions, listReports } from '../../utils/Api';

import PetitionCard from '../../components/PetitionCard';
import ReportCard from '../../components/ReportCard';
import BaseContainer from '../../components/BaseContainer';
import PriorityCard from '../../components/PriorityCard';

export default function Home() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [abaixoAssinados, setAbaixoAssinados] = useState([]);

  const [loaded, setloaded] = useState(false);

  const loadList = async () => {
    try {
      setloaded(false)
      let rest = await listReports()

      if (!rest.error) {
        setComplaints(rest.content)
      }

      rest = await listPetitions()

      if (!rest.error) {
        setAbaixoAssinados(rest.content)
      }

      setloaded(true)
    } catch (error) {
      setloaded(false)
      console.log(error);
    }
  }

  useEffect(() => {
    loadList()
  }, []);


  return (
    <BaseContainer
      flex={false}
    >
      <section>
        <Carousel
          key={`bottom.bar`}
          placement="bottom"
          shape="bar"
          className="custom-slider"
        >
          <div
            style={{
              backgroundImage: `url(${mapPlaceHolder})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              width: '100%',
              height: '100%',
            }}
          />
        </Carousel>
      </section>

      <section style={{ padding: 15, minHeight: 300 }} >
        <h3 className='text-primary-emphasis mb-3' >Reclamações Recentes</h3>

        <div style={{ display: 'flex', flexDirection: 'row', gap: 25, overflowX: 'scroll', whiteSpace: 'nowrap' }} >
          {
            loaded ? (
              complaints.map((complaint, i) => (
                complaint.aceito ? (
                  <>
                    <PriorityCard
                      key={i}
                      prioridade={complaint.prioridade}
                      tittle={complaint.titulo}
                      date={complaint.data}
                      content={complaint.conteudo}
                      onPress={() => {
                        navigate("/Complaint-Details", { state: { complaintId: complaint.id } })
                      }}
                      pressableText="ver mais"
                      style={{ marginTop: i == 0 ? 20 : 0 }}
                    />
                  </>
                ) : null
              ))
            ) : <Loader size="md" />
          }
        </div>
      </section>

      <section style={{ padding: 15, minHeight: 300 }} >
        <h3 className='text-primary-emphasis mb-3' >Abaixo Assinados Recentes</h3>

        <div
          style={{
            display: 'flex',
            gap: 25,
            overflowX: 'scroll', // Corrige o comportamento de scroll
            whiteSpace: 'nowrap',
            width: "100%"
          }}
        >
          {
            loaded ? (
              abaixoAssinados.map((abaixoAssinado, i) => (
                abaixoAssinado.aberto ? (
                  <PriorityCard
                    key={i}
                    prioridade={abaixoAssinado.prioridade}
                    tittle={abaixoAssinado.titulo}
                    date={abaixoAssinado.data}
                    content={abaixoAssinado.content}
                    onPress={() => {
                      navigate('/Abaixo-Assinados-Detalhes', { state: { petitionId: abaixoAssinado.id } })
                    }}
                    pressableText="ver mais"
                    style={{ marginTop: i === 0 ? 20 : 0, display: 'inline-block' }}
                  />
                ) : null
              ))
            ) : <Loader size="md" />
          }
        </div>
      </section>
    </BaseContainer>
  );
}
