const URL = "https://voz-urbana-api.vercel.app" //"http://192.168.0.152:5000" //"https://voz-urbana-api.vercel.app";

// Funções para Usuários
export const createUser = async (userData) => {
    const response = await fetch(`${URL}/usuarios/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    return response.json();
};

export const loginUser = async (email, password) => {
    const response = await fetch(`${URL}/usuarios/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            senha: password
        }),
    });
    return response.json();
};

export const getUserById = async (id) => {
    const response = await fetch(`${URL}/usuarios/get/${id}`);
    return response.json();
};

export const checkUserPassword = async (userId, password) => {
    const response = await fetch(`${URL}/usuarios/passwordCheck/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            senha: password
        }),
    });

    if (!response.ok) {
        // Se a resposta não for bem-sucedida, você pode lançar um erro ou retornar uma mensagem adequada.
        const errorData = await response.json();
        return { "error": errorData.error || 'Erro ao verificar a senha.' }
    }

    return response.json();
};

export const updateUser = async (userId, userData) => {
    const response = await fetch(`${URL}/usuarios/update/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    return response.json();
};

export const deleteUser = async (userId) => {
    const response = await fetch(`${URL}/usuarios/delete/${userId}`, {
        method: 'DELETE',
    });
    return response.json();
};

export const verifyUserToken = async (userId) => {
    const response = await fetch(`${URL}/usuarios/verifyToken/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
};

// Funções para Reports
export const createReport = async (reportData) => {
    const response = await fetch(`${URL}/reports/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
    });
    return response.json();
};

export const listReports = async () => {
    const response = await fetch(`${URL}/reports/list`);
    return response.json();
};

export const getReportById = async (id) => {
    const response = await fetch(`${URL}/reports/get/${id}`);
    return response.json();
};

export const getReportsByUser = async (userId) => {
    const response = await fetch(`${URL}/reports/get_by_user/${userId}`);
    return response.json();
};

export const updateReport = async (id, reportData) => {
    const response = await fetch(`${URL}/reports/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
    });
    return response.json();
};

export const deleteReport = async (id) => {
    const response = await fetch(`${URL}/reports/delete/${id}`, {
        method: 'DELETE',
    });
    return response.json();
};

// Funções para Petições
export const createPetition = async (petitionData) => {
    const response = await fetch(`${URL}/peticoes/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(petitionData),
    });
    return response.json();
};

export const listPetitions = async () => {
    const response = await fetch(`${URL}/peticoes/list`);
    return response.json();
};

export const getPetitionById = async (id) => {
    const response = await fetch(`${URL}/peticoes/get/${id}`);
    return response.json();
};

export const getPetitionsByUser = async (userId) => {
    const response = await fetch(`${URL}/peticoes/get_by_user/${userId}`);
    return response.json();
};

export const updatePetition = async (id, petitionData) => {
    const response = await fetch(`${URL}/peticoes/update/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(petitionData),
    });
    return response.json();
};

export const getRemainingTimeForPetition = async (petitionId) => {
    const response = await fetch(`${URL}/peticoes/check_timer/${petitionId}`);
    if (!response.ok) {
        throw new Error(response.error);
    }
    return response.json();
};


export const deletePetition = async (id) => {
    const response = await fetch(`${URL}/peticoes/delete/${id}`, {
        method: 'DELETE',
    });
    return response.json();
};

// Função para enviar uma imagem
export const uploadImage = async (imageUri, userName) => {
    const currentDate = new Date().toISOString().replace(/:/g, '-');
    const fileName = `${userName}_${currentDate}.jpg`;

    // Remove o prefixo base64 e cria um Blob
    const base64Data = imageUri.split(',')[1];
    const blob = base64ToBlob(base64Data, 'image/jpeg');

    const formData = new FormData();
    formData.append('imagem', blob, fileName); // Usa o Blob diretamente com o nome

    const response = await fetch(`${URL}/imagem/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Erro ao enviar imagem: ${errorResponse.error || response.statusText}`);
    }

    return response.json();
};

// Função utilitária para converter base64 para Blob
const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i += 512) {
        const slice = byteCharacters.slice(i, i + 512);
        const byteNumbers = new Array(slice.length);
        for (let j = 0; j < slice.length; j++) {
            byteNumbers[j] = slice.charCodeAt(j);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
};

export const deleteImage = async (fileName) => {
    try {
        const response = await fetch(`${URL}/imagem/delete`, {
            method: 'POST',  // Mudado para POST
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ link: fileName }),  // Enviando o link no corpo
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Erro ao deletar imagem: ${errorResponse.error || response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

