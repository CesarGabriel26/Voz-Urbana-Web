import React from 'react';
import { FaCaretRight } from "react-icons/fa6";
import { formatDate } from '../utils/Parser';
import { useNavigate } from 'react-router-dom';
import { Highlight } from 'rsuite';

const styles = {
    card: {
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


export default function ReportCard({ complaint, searchTerm, buttons, buttonsOptions }) {
    const navigate = useNavigate();

    return (
        <div className='primary-bg' style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }} >
                <p style={styles.cardText}> {formatDate(complaint.data, true)}</p>
                <div style={{ display: 'flex', alignItems: "center" }} >
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
                                    <spam className='text-light'>|</spam>
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
                                    console.log();
                                    navigate("/Complaint-Details", { state: { complaintId: complaint.id } });
                                }}
                            >
                                Ver mais <FaCaretRight />
                            </p>
                        )
                    }
                </div>
            </div>
            <div style={styles.cardBody} className='light-bg' >
                <Highlight query={searchTerm}>
                    <p
                        className='dark-text'
                        style={{
                            maxHeight: 150,
                            overflow: 'hidden',
                            wordBreak: 'break-word',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 5,
                            textOverflow: 'ellipsis',
                            margin: 0
                        }}
                    >
                        {complaint.conteudo}
                    </p>
                </Highlight>

            </div>
        </div>
    )
}