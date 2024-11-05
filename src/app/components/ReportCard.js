import React from 'react';
import { FaCaretRight } from "react-icons/fa6";
import { formatDate } from '../utils/Parser';
import { useNavigate } from 'react-router-dom';
import { Highlight } from 'rsuite';

const styles = {
    card: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    cardBody: {
        minHeight: 120,
        padding: 10,
        borderRadius: 10,
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

export default function ReportCard({ complaint, searchTerm, buttons, buttonsOptions }) {
    const navigate = useNavigate();

    return (
        <div className='bg-primary' style={styles.card}>
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
                <Highlight query={searchTerm}>
                    <p className='dark-text' style={{
                        maxHeight: 150,
                        overflow: 'hidden',
                        wordBreak: 'break-word',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 5,
                        textOverflow: 'ellipsis',
                        margin: 0,
                    }}>
                        {complaint.conteudo}
                    </p>
                </Highlight>
            </div>
        </div>
    );
}
