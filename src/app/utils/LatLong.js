const KEY = "vee8Vj_O-V2a0lC-tvyPrmj4GNO8MOamr9h4bi_HqwI"
// wIpDxZ5PYXmnIhhRArIw
export async function getLatLongFromAddress(rua, numero, cidade, estado, pais) {
    // Constrói o endereço de forma flexível, ignorando o número se ele não foi preenchido
    const endereco = `${rua}${numero ? `, ${numero}` : ''}, ${cidade}, ${estado}, ${pais}`;

    const response = await fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(endereco)}&apiKey=${KEY}`);
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
        const location = data.items[0].position; // Retorna a primeira localização
        return { latitude: location.lat, longitude: location.lng };
    } else {
        throw new Error('Endereço não encontrado');
    }
}