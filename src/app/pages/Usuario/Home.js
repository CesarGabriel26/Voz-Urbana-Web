import React, { useEffect, useState } from 'react';
import { Container, Header, Content, Footer, Carousel, Loader } from 'rsuite';
import NavigationBar from '../../components/navigationBar';

import mapPlaceHolder from '../../assets/mapPlaceHolder.png';
import { listPetitions, listReports } from '../../utils/Api';

import PetitionCard from '../../components/PetitionCard';
import ReportCard from '../../components/ReportCard';

export default function Home() {
  const [complaints, setComplaints] = useState([]);
  const [abaixoAssinados, setAbaixoAssinados] = useState([]);

  const [loaded, setloaded] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

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
  const ControleScrollHeader = () => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }

  useEffect(() => {
    loadList()
  }, []);
  useEffect(() => {
    ControleScrollHeader()
  });

  return (
    <Container style={{
      height: '100vh',
      paddingTop: isSticky ? 80 : 0,
    }}>
      <Header
        style={{
          position: isSticky ? 'fixed' : 'relative',
          top: 0,
          width: '100%',
          zIndex: 1000,
          transition: '3.s ease-in-out',
        }}
      >
        <NavigationBar />
      </Header>
      <Content >
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
          <h3 className='primary-text mb-3' >Reclamações Recentes</h3>

          <div style={{ display: 'flex', flexDirection: 'row', gap: 25, overflowX: 'scroll' }} >
            {
              loaded ? (
                complaints.map((complaint, index) => (
                  <ReportCard complaint={complaint} key={index}/>
                ))
              ) : <Loader size="md" />
            }
          </div>
        </section>

        <section style={{ padding: 15, minHeight: 300 }} >
          <h3 className='primary-text mb-3' >Abaixo Assinados Recentes</h3>

          <div style={{ display: 'flex', flexDirection: 'row', gap: 25, overflowX: 'scroll' }} >
            {
              loaded ? (
                abaixoAssinados.map((abaixoAssinado, index) => (
                  <PetitionCard abaixoAssinado={abaixoAssinado} key={index} />
                ))
              ) : <Loader size="md" />
            }
          </div>
        </section>

      </Content>
      <Footer></Footer>
    </Container>
  );
}
