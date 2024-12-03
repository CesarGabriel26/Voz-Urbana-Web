export const NORMAL_USER_TYPE = 0
export const ADMIN_USER_TYPE = 1

export const FILTROS = [
    {
        label: "Data ▼",
        value: 'Data-menor-maior'
    },
    {
        label: "Data ▲",
        value: 'Data-maior-menor'
    },
    {
        label: "Prioridade ▼",
        value: 'Prioridade-menor-maior'
    },
    {
        label: "Prioridade ▲",
        value: 'Prioridade-maior-menor'
    },
]

export const categories = [
    'Não Especificada',
    'Iluminação Pública', 'Buraco na Rua', 'Poluição', 'Transporte Público',
    'Saúde Pública', 'Árvore Caída', 'Lixo Acumulado', 'Obras Irregulares',
    'Coleta de Lixo', 'Calçadas danificadas', 'Vandalismo', 'Escola Pública',
    'Maus-Tratos a Animais', 'Desigualdade Social', 'Moradores de Rua',
    'Internet Pública', 'Documentação', 'Parques e Praças', 'Sinalização'
];
export const PetitionsCategories = [
    'Não Especificada',
    'Direitos Humanos',
    'Meio Ambiente',
    'Educação',
    'Saúde Pública',
    'Bem-Estar Animal',
    'Política e Governo',
    'Economia e Trabalho',
    'Tecnologia e Privacidade',
    'Justiça e Segurança',
    'Cultura e Lazer',
    'Infraestrutura e Transporte',
    'Direitos das Mulheres',
    'Direitos das Crianças',
    'Direitos dos Idosos',
    'Direitos LGBTQIA+',
    'Comunidade e Sociedade',
    'Esporte e Juventude',
    'Proteção ao Consumidor',
    'Habitação e Urbanismo',
    'Ciência e Pesquisa'
];

export const PrioritiesColors = [
    "hsl(207, 89.00%, 35.70%)",  // #0A62AC
    "hsl(150, 100%, 45%)",  // #33FF99
    "hsl(120, 100%, 45%)",  // #66FF66
    "hsl(75, 100%, 45%)",   // #99FF33
    "hsl(60, 100%, 45%)",   // #CCE700
    "hsl(51, 100%, 45%)",   // #FFD700
    "hsl(45, 100%, 45%)",   // #FFCC00
    "hsl(30, 100%, 45%)",   // #FF9900
    "hsl(15, 100%, 45%)",   // #FF6600
    "hsl(0, 100%, 45%)",    // #FF3300
    "hsl(0, 100%, 45%)",    // #FF0000
];

export const priorities = [
    {
        level: 'Todas'
    },
    {
        level: 0,
        color: PrioritiesColors[0],
        textColor: 'white',
        title: "Muito baixa",
        description: "Questões insignificantes ou meramente informativas.",
        example: "Grafite em uma parede pública sem impacto no ambiente.",
    },
    {
        level: 1,
        color: PrioritiesColors[1],
        textColor: 'white',
        title: "Baixa",
        description: "Problemas de baixa relevância ou somente estéticos.",
        example: "Pequenas manchas de ferrugem em uma grade.",
    },
    {
        level: 2,
        color: PrioritiesColors[2],
        textColor: 'white',
        title: "Pouco Relevante",
        description: "Problemas menores que afetam pouquíssimas pessoas.",
        example: "Rachadura superficial em um banco público.",
    },
    {
        level: 3,
        color: PrioritiesColors[3],
        title: "Relevante",
        description: "Problemas pouco significativos, mas visíveis.",
        example: "Lâmpada queimada em uma praça pública.",
    },
    {
        level: 4,
        color: PrioritiesColors[4],
        title: "Abaixo da Media",
        description: "Problemas menores, mas que podem causar desconforto.",
        example: "Calçada quebrada em frente a uma escola.",
    },
    {
        level: 5,
        color: PrioritiesColors[5],
        title: "Media",
        description: "Questões importantes, mas sem risco imediato.",
        example: "Semáforo intermitente em um cruzamento.",
    },
    {
        level: 6,
        color: PrioritiesColors[6],
        title: "Acima da media",
        description: "Moderadamente importante, exige atenção em breve.",
        example: "Sinais de trânsito apagados em cruzamentos menos movimentados.",
    },
    {
        level: 7,
        color: PrioritiesColors[7],
        textColor: 'white',
        title: "Importante",
        description: "Problemas consideráveis, mas sem risco imediato grave.",
        example: "Poste de luz piscando próximo de uma área movimentada.",
    },
    {
        level: 8,
        color: PrioritiesColors[8],
        textColor: 'white',
        title: "Grave",
        description: "Problemas graves que precisam de atenção rápida.",
        example: "Buraco grande na via principal, risco de acidentes.",
    },
    {
        level: 9,
        color: PrioritiesColors[9],
        textColor: 'white',
        title: "Urgente",
        description: "Situações muito graves, próximas de urgência máxima.",
        example: "Cabo elétrico rompido solto no meio da estrada.",
    },
    {
        level: 10,
        color: PrioritiesColors[10],
        textColor: 'white',
        title: "Crítico",
        description: "Situações extremamente perigosas ou críticas.",
        example: "Rua completamente alagada, bloqueando acesso a residências.",
    }
]