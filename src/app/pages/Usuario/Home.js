import React, { useEffect, useState } from 'react';
import { Carousel, Loader } from 'rsuite';

import mapPlaceHolder from '../../assets/mapPlaceHolder.png';
import { listPetitions, listReports } from '../../utils/Api';

import PetitionCard from '../../components/PetitionCard';
import ReportCard from '../../components/ReportCard';
import BaseContainer from '../../components/BaseContainer';

export default function Home() {
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

        <div style={{ display: 'flex', flexDirection: 'row', gap: 25, overflowX: 'scroll' }} >
          {
            loaded ? (
              complaints.map((complaint, index) => (
                complaint.aceito ? (
                  <ReportCard complaint={complaint} key={index} />
                ) : null
              ))
            ) : <Loader size="md" />
          }
        </div>
      </section>

      <section style={{ padding: 15, minHeight: 300 }} >
        <h3 className='text-primary-emphasis mb-3' >Abaixo Assinados Recentes</h3>

        <div style={{ display: 'flex', flexDirection: 'row', gap: 25, overflowX: 'scroll' }} >
          {
            loaded ? (
              abaixoAssinados.map((abaixoAssinado, index) => (
                abaixoAssinado.aberto ? (
                  <PetitionCard style={{maxWidth: 500,}} abaixoAssinado={abaixoAssinado} key={index} />
                ) : null
              ))
            ) : <Loader size="md" />
          }
        </div>
      </section>
    </BaseContainer>
  );
}
