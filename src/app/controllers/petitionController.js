import { updatePetition } from "../utils/Api";

export const updatePetitionStatus = async (petition, status, aberto, loadList) => {
    petition.status = status;
    petition.aberto = aberto;

    const resp = await updatePetition(petition.id, petition);

    if (resp.error) {
        console.error(resp.error);
    } else {
        loadList(); // Recarrega a lista após atualização
    }
};