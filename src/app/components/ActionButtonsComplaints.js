import { ADMIN_USER_TYPE } from "../utils/consts";
import { deleteComplaintControl, updateComplaintPriority, updateComplaintStatus } from "../controllers/complaintController";
import { useNavigate } from 'react-router-dom';
import { deleteImage } from "../utils/Api";

export default function ActionButtonsComplaints({ complaint, reloadFunction, currentUser, buttonOptions, prioridade, setPrioridade }) {
    const navigate = useNavigate();

    const handleApprove = () => updateComplaintStatus(complaint, 1, true, () => { reloadFunction() });
    const handleReprove = () => updateComplaintStatus(complaint, -1, true, () => { reloadFunction() });

    const handleRevoke = () => {
        updateComplaintStatus(complaint, 0, false, () => { reloadFunction() })
    }

    const handleEnd = () => updateComplaintStatus(complaint, 0, false, () => { reloadFunction() });
    const handleDelete = () => deleteComplaintControl(complaint, async () => {
        let res = await deleteImage(complaint.imagem)

        if (res.success) {
            navigate("/");
        }
    })

    const handleSetPriority = () => updateComplaintPriority(complaint, prioridade, async () => {
        reloadFunction()
    })

    return (
        <div style={{ display: 'flex', gap: 25, flexWrap: 'wrap' }}>
            {
                complaint ?
                    (
                        <>
                            {
                                ((currentUser && currentUser.type === ADMIN_USER_TYPE) && (complaint.status != 0)) ? <button className='btn btn-warning' onClick={handleRevoke}>Revogar</button> : <></>
                            }
                            {
                                ((currentUser && currentUser.type === ADMIN_USER_TYPE) && (complaint.status == 0)) ? <button className='btn btn-danger' onClick={handleReprove}>Reprovar</button> : <></>
                            }
                            {
                                (currentUser && currentUser.type === ADMIN_USER_TYPE && !complaint.aceito) ? (
                                    <>
                                        <button className='btn btn-success' onClick={handleApprove}>Aprovar</button>
                                    </>
                                ) : (
                                    <>
                                        {
                                            ((currentUser && currentUser.type === ADMIN_USER_TYPE) || (currentUser.id === complaint.user_id)) ? <button className='btn btn-secondary' onClick={handleEnd}>Encerrar</button> : <></>
                                        }
                                    </>
                                )
                            }
                            {
                                ((currentUser && currentUser.type === ADMIN_USER_TYPE) || (currentUser.id === complaint.user_id)) ? <button className='btn btn-danger' onClick={handleDelete}>Apagar</button> : <></>
                            }
                            {
                                (currentUser && currentUser.type === ADMIN_USER_TYPE) ? <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                                    <button className='btn btn-primary' onClick={handleSetPriority}>Definir Prioridade</button>
                                    <input
                                        style={{ 
                                            marginLeft: 15,
                                         }}
                                        type="number"
                                        min={0}
                                        max={10}
                                        value={prioridade}
                                        onChange={(e) => {
                                            let v = e.target.value
                                            if (v > 10) {
                                                v = 10
                                            }

                                            if (v < 0) {
                                                v = 0
                                            }

                                            setPrioridade(Number(v));
                                        }}
                                    />
                                </div> : <></>
                            }
                        </>
                    ) : <></>
            }

        </div>
    )
}