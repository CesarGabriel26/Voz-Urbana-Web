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


export default function PetitionCard({ abaixoAssinado, searchTerm, buttons, buttonsOptions }) {

    return (
        <div className='bg-primary' style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }} >
                <p className='text-light' style={styles.cardText}>
                    {formatDate(abaixoAssinado.data)}
                </p>
                <div style={{ display: 'flex' }}>
                    <div className='d-none d-md-flex' style={{ alignItems: "center" }} >
                        {
                            buttons?.map((btn, index) => (
                                <>
                                    <p
                                        key={index}
                                        className='text-light bt-link' style={{
                                            margin: 5,
                                            cursor: 'pointer'
                                        }}
                                        onClick={btn.onclick}
                                    >
                                        {btn.text}
                                    </p>
                                    {
                                        (buttonsOptions?.hasDefault === false && index < buttons.length - 1) || buttonsOptions?.hasDefault !== false
                                        ? <span key={index} className='text-light'>|</span>
                                        : null
                                    }

                                </>
                            ))
                        }
                    </div>
                    {
                        buttonsOptions?.hasDefault === false ? null : (
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
                        )
                    }
                </div>
            </div>
            <div className='bg-body' style={styles.cardBody}>
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
                        color={"red"}
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