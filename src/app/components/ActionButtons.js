import { useState } from "react";
import { deletePetitionControl, updatePetitionSignatures, updatePetitionStatus } from "../controllers/petitionController";
import { ADMIN_USER_TYPE } from "../utils/consts";
import { useEffect } from "react";

export default function ActionButtons({ petition, reloadFunction, currentUser, buttonOptions }) {
    const [podeAssinar, setPodeAssinar] = useState(true)

    const handleApprove = () => updatePetitionStatus(petition, 1, true, () => { reloadFunction() });
    const handleReprove = () => updatePetitionStatus(petition, -1, false, () => { reloadFunction() });

    const handleRevoke = () => {
        petition.signatures = 0
        petition.apoiadores = []
        updatePetitionStatus(petition, 0, false, () => { reloadFunction() })
    }

    const handleEnd = () => updatePetitionStatus(petition, 0, false, () => { reloadFunction() });
    const handleDelete = () => deletePetitionControl(petition, () => { reloadFunction() })

    const handlesign = () => updatePetitionSignatures(petition, () => { reloadFunction() }, currentUser);

    useEffect(() => {
        setPodeAssinar(
            !currentUser.id === petition.user_id && !petition.apoiadores.includes(currentUser.id)
        );
    }, [currentUser.id, petition.user_id, petition.apoiadores]);

    return (
        <div style={{ display: 'flex', gap: 25, flexWrap: 'wrap' }}>
            {
                petition ?
                    (
                        <>
                            {
                                ((currentUser && currentUser.type === ADMIN_USER_TYPE) && (petition.status != 0)) ? <button className='btn btn-warning' onClick={handleRevoke}>Revogar</button> : <></>
                            }
                            {
                                ((currentUser && currentUser.type === ADMIN_USER_TYPE) && (petition.status == 0)) ? <button className='btn btn-danger' onClick={handleReprove}>Reprovar</button> : <></>
                            }
                            {
                                (currentUser && currentUser.type === ADMIN_USER_TYPE && !petition.aberto) ? (
                                    <>
                                        <button className='btn btn-success' onClick={handleApprove}>Aprovar</button>
                                    </>
                                ) : (
                                    <>
                                        <button disabled={!podeAssinar} className='btn btn-primary' onClick={handlesign}> Assinar </button>
                                        {
                                            ((currentUser && currentUser.type === ADMIN_USER_TYPE) || (currentUser.id === petition.user_id)) ? <button className='btn btn-secondary' onClick={handleEnd}>Encerrar</button> : <></>
                                        }
                                    </>
                                )
                            }
                            {
                                ((currentUser && currentUser.type === ADMIN_USER_TYPE) || (currentUser.id === petition.user_id)) ? <button className='btn btn-danger' onClick={handleDelete}>Apagar</button> : <></>
                            }
                        </>
                    ) : <></>
            }

        </div>
    )
}