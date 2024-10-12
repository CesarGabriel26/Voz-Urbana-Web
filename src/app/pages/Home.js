import React, { useEffect, useState } from 'react';
import { Container, Header, Content, Footer, Carousel, Loader } from 'rsuite';
import NavigationBar from '../components/navigationBar';

import mapPlaceHolder from '../assets/mapPlaceHolder.png';
import { getReportsByUser } from '../utils/Api';
import { formatDate } from '../utils/Parser';
import DecodeToken from '../utils/JWT';

const styles = {
  container: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20
  },
  card: {
      width: '100%',
      padding: 10,
      borderRadius: 20,
      marginBottom: 10
  },
  cardBody: {
      minHeight: 100,
      width: '100%',
      padding: 5,
      borderRadius: 10
  },
  cardText: {
      fontSize: 15,
      marginTop: 10,
      marginBottom: 10
  }
}


export default function Home() {
  const [complaints, setComplaints] = useState([]);
    const [loaded, setloaded] = useState(false);

    const loadList = async () => {
        setloaded(false)
        let userToken = localStorage.getItem('usuario') || null;
        let userJson = DecodeToken(userToken)
        let rest = await getReportsByUser(userJson.id)

        if (!rest.error) {
            setComplaints(rest.content)
            setloaded(true)
        }
    }

    useEffect(() => {
        loadList()
    }, []);

  return (
    <Container style={{ height: '100vh' }}>
      <Header>
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

        <section>
          <h3 className='primary-text' >Reclamações gerais da população</h3>
          {
            loaded ? (
              complaints.map((complaint, index) => (
                <div key={index} style={[styles.card]}>
                  <p style={[styles.cardText]}> {formatDate(complaint.data, true)}</p>
                  <div style={[styles.cardBody]}>
                    <p>
                      {complaint.conteudo}
                    </p>
                  </div>
                  {
                    complaint.aceito ? (
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                        <p style={[styles.cardText]} >
                          Sua requisição foi respondida!
                        </p>
                        {/* <IonicIcons name="checkmark-done-circle-outline" size={30} color={colorScheme.Icons.check} /> */}
                      </div>
                    ) : (
                      <p style={[styles.cardText]} >
                        Sua requisição ainda não foi respondida!
                      </p>
                    )
                  }

                </div>
              ))
            ) : <Loader size="md" />
          }
        </section>

      </Content>
      <Footer>Footer</Footer>
    </Container>
  );
}
