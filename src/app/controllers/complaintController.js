import { deleteReport, updateReport } from "../utils/Api";

export const updateComplaintStatus = async (report, status, aceito, loadList) => {
    report.status = status;
    report.aceito = aceito;

    const resp = await updateReport(report.id, report);

    if (resp.error) {
        console.error(resp.error);
        return
    } 
    loadList(); // Recarrega a lista após atualização
};


export const deleteComplaintControl = async (report, loadList) => {
    const resp = await deleteReport(report.id)
    if (resp.error) {
      console.log(resp.error);
    } else {
      loadList(); // Recarrega a lista após atualização
    }
  }