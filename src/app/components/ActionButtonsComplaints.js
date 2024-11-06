import { useState } from "react";
import { ADMIN_USER_TYPE } from "../utils/consts";
import { useEffect } from "react";
import { deleteComplaintControl, updateComplaintStatus } from "../controllers/complaintController";

export default function ActionButtonsComplaints({ complaint, reloadFunction, currentUser, buttonOptions }) {
    const handleApprove = () => updateComplaintStatus(complaint, 1, true, () => { reloadFunction() });
    const handleReprove = () => updateComplaintStatus(complaint, -1, true, () => { reloadFunction() });

    const handleRevoke = () => {
        updateComplaintStatus(complaint, 0, false, () => { reloadFunction() })
    }

    const handleEnd = () => updateComplaintStatus(complaint, 0, false, () => { reloadFunction() });
    const handleDelete = () => deleteComplaintControl(complaint, () => { reloadFunction() })

    return (
        <div style={{ display: 'flex', gap: 25, flexWrap: 'wrap'}}>
            {
                complaint ?
                    (
                        <>
                            {
                                (currentUser && currentUser.type == ADMIN_USER_TYPE && !complaint.aceito) ? (
                                    <>
                                        <button className='btn btn-danger' onClick={handleReprove}>Reprovar</button>
                                        <button className='btn btn-success' onClick={handleApprove}>Aprovar</button>
                                    </>
                                ) : (
                                    <>
                                        {
                                            ((currentUser && currentUser.type == ADMIN_USER_TYPE) || (currentUser.id === complaint.user_id)) ? <button className='btn btn-secondary' onClick={handleEnd}>Encerrar</button> : <></>
                                        }
                                        {
                                            ((currentUser && currentUser.type == ADMIN_USER_TYPE) && (complaint.aceito)) ? <button className='btn btn-warning' onClick={handleRevoke}>Revogar</button> : <></>
                                        }
                                    </>
                                )
                            }
                            {
                                ((currentUser && currentUser.type == ADMIN_USER_TYPE) || (currentUser.id === complaint.user_id)) ? <button className='btn btn-danger' onClick={handleDelete}>Apagar</button> : <></>
                            }
                        </>
                    ) : <></>
            }

        </div>
    )
}