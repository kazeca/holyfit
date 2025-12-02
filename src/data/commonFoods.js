// Banco de alimentos brasileiros com informações nutricionais
// Serving = porção padrão, servingGrams = peso em gramas, calories = calorias por porção
// protein, carbs, fat = macronutrientes em gramas por porção

export const commonFoods = [
    // ========== CARBOIDRATOS ==========
    {
        id: 1,
        name: 'Arroz branco',
        category: 'Carboidrato',
        serving: '1 colher de sopa',
        servingGrams: 25,
        calories: 32,
        protein: 0.7,
        carbs: 7,
        fat: 0.1
    },
    {
        id: 2,
        name: 'Arroz integral',
        category: 'Carboidrato',
        serving: '1 colher de sopa',
        servingGrams: 25,
        calories: 28,
        protein: 0.6,
        carbs: 6,
        fat: 0.2
    },
    {
        id: 3,
        name: 'Batata doce',
        category: 'Carboidrato',
        serving: '100g',
        servingGrams: 100,
        calories: 86,
        protein: 1.6,
        carbs: 20,
        fat: 0.1
    },
    {
        id: 4,
        name: 'Batata inglesa',
        category: 'Carboidrato',
        serving: '100g',
        servingGrams: 100,
        calories: 77,
        protein: 2,
        carbs: 17,
        fat: 0.1
    },
    {
        id: 5,
        name: 'Macarrão cozido',
        category: 'Carboidrato',
        serving: '1 pegador',
        servingGrams: 80,
        calories: 112,
        protein: 4,
        carbs: 24,
        fat: 0.5
    },
    {
        id: 6,
        name: 'Pão francês',
        category: 'Carboidrato',
        serving: '1 unidade',
        servingGrams: 50,
        calories: 135,
        protein: 4,
        carbs: 27,
        fat: 1
    },
    {
        id: 7,
        name: 'Pão integral',
        category: 'Carboidrato',
        serving: '1 fatia',
        servingGrams: 25,
        calories: 69,
        protein: 3,
        carbs: 11,
        fat: 1.2
    },
    {
        id: 8,
        name: 'Tapioca',
        category: 'Carboidrato',
        serving: '1 unidade',
        servingGrams: 50,
        calories: 70,
        protein: 0,
        carbs: 17,
        fat: 0
    },
    {
        id: 9,
        name: 'Aveia',
        category: 'Carboidrato',
        serving: '30g',
        servingGrams: 30,
        calories: 117,
        protein: 4,
        carbs: 20,
        fat: 2.5
    },
    {
        id: 10,
        name: 'Granola',
        category: 'Carboidrato',
        serving: '30g',
        servingGrams: 30,
        calories: 120,
        protein: 3,
        carbs: 22,
        fat: 2
    },

    // ========== PROTEÍNAS ==========
    {
        id: 11,
        name: 'Frango grelhado',
        category: 'Proteína',
        serving: '100g',
        servingGrams: 100,
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6
    },
    {
        id: 12,
        name: 'Peito de peru',
        category: 'Proteína',
        serving: '2 fatias',
        servingGrams: 40,
        calories: 50,
        protein: 10,
        carbs: 1,
        fat: 0.5
    },
    {
        id: 13,
        name: 'Ovo cozido',
        category: 'Proteína',
        serving: '1 unidade',
        servingGrams: 50,
        calories: 78,
        protein: 6,
        carbs: 0.6,
        fat: 5
    },
    {
        id: 14,
        name: 'Ovo frito',
        category: 'Proteína',
        serving: '1 unidade',
        servingGrams: 50,
        calories: 90,
        protein: 6,
        carbs: 0.6,
        fat: 7
    },
    {
        id: 15,
        name: 'Omelete (2 ovos)',
        category: 'Proteína',
        serving: '1 porção',
        servingGrams: 120,
        calories: 180,
        protein: 12,
        carbs: 1,
        fat: 14
    },
    {
        id: 16,
        name: 'Carne moída',
        category: 'Proteína',
        serving: '100g',
        servingGrams: 100,
        calories: 215,
        protein: 26,
        carbs: 0,
        fat: 11
    },
    {
        id: 17,
        name: 'Bife de patinho',
        category: 'Proteína',
        serving: '100g',
        servingGrams: 100,
        calories: 143,
        protein: 28,
        carbs: 0,
        fat: 3
    },
    {
        id: 18,
        name: 'Filé de tilápia',
        category: 'Proteína',
        serving: '100g',
        servingGrams: 100,
        calories: 96,
        protein: 20,
        carbs: 0,
        fat: 1.7
    },
    {
        id: 19,
        name: 'Salmão grelhado',
        category: 'Proteína',
        serving: '100g',
        servingGrams: 100,
        calories: 206,
        protein: 22,
        carbs: 0,
        fat: 13
    },
    {
        id: 20,
        name: 'Atum em lata',
        category: 'Proteína',
        serving: '1 lata',
        servingGrams: 170,
        calories: 150,
        protein: 35,
        carbs: 0,
        fat: 1
    },
    {
        id: 21,
        name: 'Whey protein',
        category: 'Proteína',
        serving: '1 scoop',
        servingGrams: 30,
        calories: 120,
        protein: 24,
        carbs: 3,
        fat: 1.5
    },

    // ========== LEGUMINOSAS ==========
    {
        id: 22,
        name: 'Feijão preto',
        category: 'Leguminosa',
        serving: '1 concha',
        servingGrams: 80,
        calories: 77,
        protein: 5,
        carbs: 14,
        fat: 0.5
    },
    {
        id: 23,
        name: 'Feijão carioca',
        category: 'Leguminosa',
        serving: '1 concha',
        servingGrams: 80,
        calories: 76,
        protein: 4.8,
        carbs: 13.6,
        fat: 0.5
    },
    {
        id: 24,
        name: 'Lentilha',
        category: 'Leguminosa',
        serving: '1 concha',
        servingGrams: 100,
        calories: 116,
        protein: 9,
        carbs: 20,
        fat: 0.4
    },
    {
        id: 25,
        name: 'Grão-de-bico',
        category: 'Leguminosa',
        serving: '1 concha',
        servingGrams: 100,
        calories: 164,
        protein: 8.9,
        carbs: 27,
        fat: 2.6
    },

    // ========== VEGETAIS ==========
    {
        id: 26,
        name: 'Brócolis',
        category: 'Vegetal',
        serving: '100g',
        servingGrams: 100,
        calories: 34,
        protein: 2.8,
        carbs: 7,
        fat: 0.4
    },
    {
        id: 27,
        name: 'Alface',
        category: 'Vegetal',
        serving: '1 prato',
        servingGrams: 50,
        calories: 7,
        protein: 0.6,
        carbs: 1.4,
        fat: 0.1
    },
    {
        id: 28,
        name: 'Tomate',
        category: 'Vegetal',
        serving: '1 unidade',
        servingGrams: 100,
        calories: 18,
        protein: 0.9,
        carbs: 3.9,
        fat: 0.2
    },
    {
        id: 29,
        name: 'Cenoura',
        category: 'Vegetal',
        serving: '1 unidade',
        servingGrams: 80,
        calories: 33,
        protein: 0.8,
        carbs: 8,
        fat: 0.2
    },
    {
        id: 30,
        name: 'Abobrinha',
        category: 'Vegetal',
        serving: '100g',
        servingGrams: 100,
        calories: 17,
        protein: 1.2,
        carbs: 3.1,
        fat: 0.3
    },

    // ========== FRUTAS ==========
    {
        id: 31,
        name: 'Banana',
        category: 'Fruta',
        serving: '1 unidade',
        servingGrams: 100,
        calories: 89,
        protein: 1.1,
        carbs: 23,
        fat: 0.3
    },
    {
        id: 32,
        name: 'Maçã',
        category: 'Fruta',
        serving: '1 unidade',
        servingGrams: 150,
        calories: 78,
        protein: 0.4,
        carbs: 21,
        fat: 0.3
    },
    {
        id: 33,
        name: 'Laranja',
        category: 'Fruta',
        serving: '1 unidade',
        servingGrams: 130,
        calories: 62,
        protein: 1.2,
        carbs: 15,
        fat: 0.2
    },
    {
        id: 34,
        name: 'Morango',
        category: 'Fruta',
        serving: '100g',
        servingGrams: 100,
        calories: 32,
        protein: 0.7,
        carbs: 7.7,
        fat: 0.3
    },
    {
        id: 35,
        name: 'Abacate',
        category: 'Fruta',
        serving: '100g',
        servingGrams: 100,
        calories: 160,
        protein: 2,
        carbs: 8.5,
        fat: 14.7
    },
    {
        id: 36,
        name: 'Melancia',
        category: 'Fruta',
        serving: '1 fatia',
        servingGrams: 200,
        calories: 60,
        protein: 1.2,
        carbs: 15,
        fat: 0.3
    },

    // ========== GORDURAS BOAS ==========
    {
        id: 37,
        name: 'Azeite de oliva',
        category: 'Gordura',
        serving: '1 colher de sopa',
        servingGrams: 13,
        calories: 119,
        protein: 0,
        carbs: 0,
        fat: 13.5
    },
    {
        id: 38,
        name: 'Pasta de amendoim',
        category: 'Gordura',
        serving: '1 colher de sopa',
        servingGrams: 16,
        calories: 94,
        protein: 4,
        carbs: 3.6,
        fat: 8
    },
    {
        id: 39,
        name: 'Castanha de caju',
        category: 'Gordura',
        serving: '10 unidades',
        servingGrams: 20,
        calories: 113,
        protein: 3.8,
        carbs: 6.3,
        fat: 9
    },
    {
        id: 40,
        name: 'Amêndoas',
        category: 'Gordura',
        serving: '10 unidades',
        servingGrams: 14,
        calories: 82,
        protein: 3,
        carbs: 3,
        fat: 7
    },

    // ========== LÁCTEOS ==========
    {
        id: 41,
        name: 'Leite integral',
        category: 'Lácteo',
        serving: '1 copo',
        servingGrams: 200,
        calories: 122,
        protein: 6.4,
        carbs: 9.2,
        fat: 6.2
    },
    {
        id: 42,
        name: 'Leite desnatado',
        category: 'Lácteo',
        serving: '1 copo',
        servingGrams: 200,
        calories: 68,
        protein: 6.8,
        carbs: 9.8,
        fat: 0.4
    },
    {
        id: 43,
        name: 'Iogurte natural',
        category: 'Lácteo',
        serving: '1 pote',
        servingGrams: 170,
        calories: 100,
        protein: 5,
        carbs: 7,
        fat: 5
    },
    {
        id: 44,
        name: 'Queijo branco',
        category: 'Lácteo',
        serving: '1 fatia',
        servingGrams: 30,
        calories: 71,
        protein: 5.3,
        carbs: 1.4,
        fat: 5
    },
    {
        id: 45,
        name: 'Requeijão light',
        category: 'Lácteo',
        serving: '1 colher de sopa',
        servingGrams: 30,
        calories: 50,
        protein: 2,
        carbs: 2,
        fat: 3.5
    },

    // ========== BEBIDAS/OUTROS ==========
    {
        id: 46,
        name: 'Café sem açúcar',
        category: 'Bebida',
        serving: '1 xícara',
        servingGrams: 200,
        calories: 2,
        protein: 0,
        carbs: 0,
        fat: 0
    },
    {
        id: 47,
        name: 'Suco de laranja natural',
        category: 'Bebida',
        serving: '1 copo',
        servingGrams: 200,
        calories: 90,
        protein: 1.4,
        carbs: 20,
        fat: 0.4
    },
    {
        id: 48,
        name: 'Açúcar',
        category: 'Outro',
        serving: '1 colher de chá',
        servingGrams: 5,
        calories: 20,
        protein: 0,
        carbs: 5,
        fat: 0
    },
    {
        id: 49,
        name: 'Mel',
        category: 'Outro',
        serving: '1 colher de sopa',
        servingGrams: 21,
        calories: 64,
        protein: 0.1,
        carbs: 17,
        fat: 0
    },
    {
        id: 50,
        name: 'Chocolate 70% cacau',
        category: 'Outro',
        serving: '2 quadrados',
        servingGrams: 20,
        calories: 110,
        protein: 2,
        carbs: 10,
        fat: 7
    }
];

// Helper para buscar alimentos por nome
export const searchFoods = (query) => {
    if (!query) return commonFoods;

    const lowerQuery = query.toLowerCase();
    return commonFoods.filter(food =>
        food.name.toLowerCase().includes(lowerQuery) ||
        food.category.toLowerCase().includes(lowerQuery)
    );
};

// Helper para obter alimentos por categoria
export const getFoodsByCategory = (category) => {
    return commonFoods.filter(food => food.category === category);
};

// Categorias disponíveis
export const foodCategories = [
    'Carboidrato',
    'Proteína',
    'Leguminosa',
    'Vegetal',
    'Fruta',
    'Gordura',
    'Lácteo',
    'Bebida',
    'Outro'
];
