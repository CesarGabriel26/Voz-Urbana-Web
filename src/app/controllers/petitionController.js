import { deletePetition, updatePetition } from "../utils/Api";

export const updatePetitionStatus = async (petition, status, aberto, loadList) => {
  petition.status = status;
  petition.aberto = aberto;

  const resp = await updatePetition(petition.id, petition);

  if (resp.error) {
    console.error(resp.error);
    return
  }
  loadList(); // Recarrega a lista após atualização
};

export const updatePetitionSignatures = async (petition, loadList, user) => {
  petition.signatures += 1
  let apoiadores = petition.apoiadores
  apoiadores.push(user.id)
  petition.apoiadores = apoiadores

  const resp = await updatePetition(petition.id, petition);

  if (resp.error) {
    console.error(resp.error);
    return
  }
  loadList(); // Recarrega a lista após atualização
};


export const deletePetitionControl = async (petition, loadList) => {
  const resp = await deletePetition(petition.id)
  if (resp.error) {
    console.log(resp.error);
  } else {
    loadList(); // Recarrega a lista após atualização
  }
}

export const updatePetitionPriority = async (petition, prioridade, loadList) => {
  petition.prioridade = prioridade

  const resp = await updatePetition(petition.id, petition);

  if (resp.error) {
    console.error(resp.error);
    return
  }
  loadList();
}