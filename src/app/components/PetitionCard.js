import React, { useEffect, useState } from 'react';
import { FaCaretRight } from "react-icons/fa6";
import { formatDate } from '../utils/Parser';
import { Progress, Highlight } from 'rsuite';
import { useNavigate } from 'react-router-dom';

const styles = {
    card: {
        minWidth: 500,
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: "column"
    },
    cardBody: {
        minHeight: 120,
        padding: 10,
        borderRadius: 10,
        flex: 1,
    },
    cardText: {
        fontSize: 14,
        margin: 5,
    },
    button: {
        margin: 5,
        cursor: 'pointer',
    },
    progressContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
};

export default function PetitionCard({ abaixoAssinado, searchTerm, buttons, buttonsOptions, style }) {
    let navigate = useNavigate()
    const [textColor, setTextColor] = useState("text-dark")

    useEffect(() => {
        setTextColor(localStorage.getItem('theme') === "light" ? 'text-dark' : 'text-light')
    }, [])

    return (
        <div className='bg-primary' style={{ ...styles.card, ...style }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <p className='text-light' style={styles.cardText}>
                    {formatDate(abaixoAssinado.data)}
                </p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {buttons?.map((btn, index) => (
                        <React.Fragment key={index}>
                            <p className='text-light bt-link d-none d-md-block' style={styles.button} onClick={btn.onclick}>
                                {btn.text}
                            </p>
                            {
                                buttonsOptions?.hasDefault === false ?
                                    index < buttons.length - 1 ? <span className='text-light d-none d-md-block'>|</span> : null
                                    : <span className='text-light d-none d-md-block'>|</span>
                            }

                        </React.Fragment>
                    ))}
                    {buttonsOptions?.hasDefault === false ? null : (
                        <p className='text-light bt-link' style={styles.button} onClick={() => {
                            navigate('/Abaixo-Assinados-Detalhes', { state: { petitionId: abaixoAssinado.id } })

                        }}>
                            Ver mais <FaCaretRight />
                        </p>
                    )}
                </div>
            </div>

            <div className='bg-body' style={styles.cardBody}>
                <p className={`${textColor} bold`} style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    WebkitLineClamp: 1,
                    wordBreak: 'break-word',
                    marginBottom: 5,
                }}>
                    {abaixoAssinado.titulo}
                </p>
                <Highlight
                    className={textColor}
                    query={searchTerm}
                    style={{
                        maxHeight: 100,
                        overflow: 'hidden',
                        wordBreak: 'break-word',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 4,
                        textOverflow: 'ellipsis',
                    }}
                >
                    <p  >
                        {abaixoAssinado.content}
                    </p>
                </Highlight>
                <div style={styles.progressContainer}>
                    <p className={textColor} style={{ margin: 0 }}>{abaixoAssinado.signatures}</p>
                    <Progress.Line
                        percent={Math.min((abaixoAssinado.signatures / abaixoAssinado.required_signatures) * 100, 100)}
                        color={"red"}
                        showInfo={false}
                        style={{ flex: 1, margin: '0 10px' }}
                    />
                    <p className={textColor} style={{ margin: 0 }}>{abaixoAssinado.required_signatures}</p>
                </div>
            </div>
        </div>
    );
}
