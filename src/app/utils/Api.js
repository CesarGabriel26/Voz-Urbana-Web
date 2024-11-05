const URL = "https://voz-urbana-api.vercel.app" //"https://voz-urbana-api.vercel.app"; // http://192.168.0.152:5000

// ==============================
// Funções para Usuários
// ==============================

/**
 * Cria um novo usuário
 * @param {Object} userData - Dados do usuário a serem criados
 * @returns {Promise<Object>} - Resposta da API
 */
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

/**
 * Obtém um usuário pelo ID
 * @param {string} id - ID do usuário
 * @returns {Promise<Object>} - Resposta da API
 */
export const getUserById = async (id) => {
    const response = await fetch(`${URL}/usuarios/get/${id}`);
    return response.json();
};

/**
 * Realiza login do usuário
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<Object>} - Resposta da API
 */
export const loginUser = async (email, password) => {
    const response = await fetch(`${URL}/usuarios/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha: password }),
    });
    return response.json();
};

/**
 * Atualiza os dados de um usuário
 * @param {string} userId - ID do usuário a ser atualizado
 * @param {Object} userData - Dados atualizados do usuário
 * @returns {Promise<Object>} - Resposta da API
 */
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

/**
 * Deleta um usuário
 * @param {string} userId - ID do usuário a ser deletado
 * @returns {Promise<Object>} - Resposta da API
 */
export const deleteUser = async (userId) => {
    const response = await fetch(`${URL}/usuarios/delete/${userId}`, {
        method: 'DELETE',
    });
    return response.json();
};

// ==============================
// Funções para Reports
// ==============================

/**
 * Cria um novo relatório
 * @param {Object} reportData - Dados do relatório a serem criados
 * @returns {Promise<Object>} - Resposta da API
 */
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

/**
 * Lista todos os relatórios
 * @returns {Promise<Array>} - Lista de relatórios
 */
export const listReports = async () => {
    const response = await fetch(`${URL}/reports/list`);
    return response.json();
};

/**
 * Obtém um relatório pelo ID
 * @param {string} id - ID do relatório
 * @returns {Promise<Object>} - Resposta da API
 */
export const getReportById = async (id) => {
    const response = await fetch(`${URL}/reports/get/${id}`);
    return response.json();
};

/**
 * Obtém os relatórios de um usuário específico
 * @param {string} userId - ID do usuário
 * @returns {Promise<Array>} - Lista de relatórios do usuário
 */
export const getReportsByUser = async (userId) => {
    const response = await fetch(`${URL}/reports/get_by_user/${userId}`);
    return response.json();
};

/**
 * Atualiza um relatório
 * @param {string} id - ID do relatório a ser atualizado
 * @param {Object} reportData - Dados atualizados do relatório
 * @returns {Promise<Object>} - Resposta da API
 */
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

/**
 * Deleta um relatório
 * @param {string} id - ID do relatório a ser deletado
 * @returns {Promise<Object>} - Resposta da API
 */
export const deleteReport = async (id) => {
    const response = await fetch(`${URL}/reports/delete/${id}`, {
        method: 'DELETE',
    });
    return response.json();
};

/**
 * Verifica a senha do usuário
 * @param {number} id - ID do usuário
 * @param {string} senha - Senha a ser verificada
 * @returns {Promise<boolean>} - Retorna true se a senha estiver correta, caso contrário, lança um erro
 */
export const verifyPassword = async (id, senha) => {
    const response = await fetch(`${URL}/usuarios/passwordCheck/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ senha })
    });

    if (!response.ok) {
        
        if (response.status === 401) {
            throw new Error('Senha Incorreta');
        } else {
            throw new Error('Erro ao verificar a senha: ' + response.statusText);
        }

    }

    const data = await response.json();
    return data.content; // Retorna true se a senha estiver correta
};


// ==============================
// Funções para Petições
// ==============================

/**
 * Cria uma nova petição
 * @param {Object} petitionData - Dados da petição a serem criados
 * @returns {Promise<Object>} - Resposta da API
 */
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

/**
 * Lista todas as petições
 * @returns {Promise<Array>} - Lista de petições
 */
export const listPetitions = async () => {
    const response = await fetch(`${URL}/peticoes/list`);
    return response.json();
};

/**
 * Obtém uma petição pelo ID
 * @param {string} id - ID da petição
 * @returns {Promise<Object>} - Resposta da API
 */
export const getPetitionById = async (id) => {
    const response = await fetch(`${URL}/peticoes/get/${id}`);
    return response.json();
};

/**
 * Verifica o tempo restante para uma petição
 * @param {string} id - ID da petição
 * @returns {Promise<Object>} - Resposta com o tempo restante
 */
export const getRemainingTimeForPetition = async (id) => {
    const response = await fetch(`${URL}/peticoes/check_timer/${id}`);
    return response.json();
};

/**
 * Obtém as petições de um usuário específico
 * @param {string} userId - ID do usuário
 * @returns {Promise<Array>} - Lista de petições do usuário
 */
export const getPetitionsByUser = async (userId) => {
    const response = await fetch(`${URL}/peticoes/get_by_user/${userId}`);
    return response.json();
};

/**
 * Atualiza uma petição
 * @param {string} id - ID da petição a ser atualizada
 * @param {Object} petitionData - Dados atualizados da petição
 * @returns {Promise<Object>} - Resposta da API
 */
export const updatePetition = async (id, petitionData) => {
    const response = await fetch(`${URL}/peticoes/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(petitionData),
    });
    return response.json();
};

/**
 * Deleta uma petição
 * @param {string} id - ID da petição a ser deletada
 * @returns {Promise<Object>} - Resposta da API
 */
export const deletePetition = async (id) => {
    const response = await fetch(`${URL}/peticoes/delete/${id}`, {
        method: 'DELETE',
    });
    return response.json();
};

// ==============================
// Função para enviar uma imagem
// ==============================

/**
 * Envia uma imagem para a API
 * @param {string} imageUri - URI da imagem
 * @param {string} userName - Nome do usuário
 * @returns {Promise<Object>} - Resposta da API
 */
export const uploadImage = async (imageUri, userName) => {
    const currentDate = new Date().toISOString().replace(/:/g, '-'); // Formata a data para evitar caracteres inválidos
    const fileName = `${userName}_${currentDate}.jpg`; // Cria o nome do arquivo

    const formData = new FormData();
    formData.append('imagem', {
        uri: imageUri,
        type: 'image/jpeg', // ou o tipo correto da imagem
        name: fileName, // Nome dinâmico
    });

    const response = await fetch(`${URL}/imagem/upload`, {
        method: 'POST',
        headers: {
        },
        body: formData,
    });

    if (!response.ok) {
        // Lida com possíveis erros
        const errorResponse = await response.json();
        throw new Error(`Erro ao enviar imagem: ${errorResponse.error || response.statusText}`);
    }

    return response.json();
}

/**
 * Envia uma imagem para a API
 * @param {string} fileName - URI da imagem
 * @returns {Promise<Object>} - Resposta da API
 */
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

