import React from 'react';
import { FaCaretRight } from "react-icons/fa6";
import { formatDate } from '../utils/Parser';
import { Progress } from 'rsuite';

const styles = {
    card: {
        minWidth: '400',
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


export default function PetitionCard({ abaixoAssinado }) {
    return (
        <div className='primary-bg' style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }} >
                <p style={styles.cardText}>
                    {formatDate(abaixoAssinado.data)}
                </p>
                <p
                    className='text-light bt-link' style={{
                        margin: 5,
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        console.log(abaixoAssinado.id);
                    }}
                >
                    Ver mais <FaCaretRight />
                </p>
            </div>
            <div className='light-bg' style={styles.cardBody}>
                <p className='dark-text' style={{
                    maxHeight: 150,
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    display: 'block',
                }}>
                    {abaixoAssinado.causa}
                </p>
                <p className='dark-text' style={{
                    maxHeight: 100,
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 5,
                    textOverflow: 'ellipsis',
                }}>
                    {abaixoAssinado.content}
                </p>
                <div style={{ height: 2, width: '100%' }}></div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'center',
                        margin: 0
                    }} >
                    <p className='dark-text' style={{ margin: 0 }}>
                        {abaixoAssinado.signatures}
                    </p>
                    <Progress.Line
                        percent={abaixoAssinado.signatures / abaixoAssinado.required_signatures}
                        borderRadius={20}
                        color={"red"}
                        animationType='decay'
                        showInfo={false}
                        style={{ margin: 0, padding: 0, width: 250 }}
                    />
                    <p className='dark-text' style={{ margin: 0 }}>
                        {abaixoAssinado.required_signatures}
                    </p>
                </div>
            </div>
        </div>
    )
}