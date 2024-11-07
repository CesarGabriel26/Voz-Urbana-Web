import React, { useEffect, useState } from 'react';
import { FaCaretRight } from "react-icons/fa6";
import { formatDate } from '../utils/Parser';
import { useNavigate } from 'react-router-dom';
import { Highlight } from 'rsuite';

const styles = {
    card: {
        minWidth: 200,
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
};

export default function ReportCard({ style, complaint, searchTerm, buttons, buttonsOptions }) {
    const navigate = useNavigate();

    const [textColor, setTextColor] = useState("text-dark")

    useEffect(() => {
        setTextColor(localStorage.getItem('theme') === "light" ? 'text-dark' : 'text-light')
    }, [])

    return (
        <div className='bg-primary' style={{ ...styles.card, ...style }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <p className='text-light' style={styles.cardText}>{formatDate(complaint.data, true)}</p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className='d-none d-md-flex' style={{ alignItems: 'center' }}>
                        {buttons?.map((btn, index) => (
                            <React.Fragment key={index}>
                                <p className='text-light bt-link' style={styles.button} onClick={btn.onclick}>
                                    {btn.text}
                                </p>
                                {index < buttons.length - 1 && <span className='text-light'>|</span>}
                            </React.Fragment>
                        ))}
                    </div>
                    {buttonsOptions?.hasDefault === false ? null : (
                        <p className='text-light bt-link' style={styles.button} onClick={() => navigate("/Complaint-Details", { state: { complaintId: complaint.id } })}>
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
                    {complaint.titulo}
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

                    <p>
                        {complaint.conteudo}
                    </p>

                </Highlight>
            </div>
        </div >
    );
}
