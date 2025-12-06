/**
 * Script para resetar stats de treino no Firestore
 * Use este script no Console do Firebase ou crie uma Cloud Function
 */

// Opção 1: Via Firebase Console (Firestore)
// Vá para: https://console.firebase.google.com
// Firestore Database → users → [seu usuário]
// Edite manualmente os campos:
// - workoutsCompleted: 0
// - caloriesBurnedToday: 0

// Opção 2: Via código (adicione temporariamente no Dashboard ou Profile)
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

export const resetUserStats = async () => {
    if (!auth.currentUser) {
        console.error('Usuário não autenticado');
        return;
    }

    try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
            workoutsCompleted: 0,
            caloriesBurnedToday: 0,
            // Opcional: resetar outros campos
            // totalWorkouts: 0,
            // weeklyWorkouts: 0
        });

        console.log('✅ Stats resetados com sucesso!');
        alert('Stats resetados! Recarregue a página.');
    } catch (error) {
        console.error('❌ Erro ao resetar stats:', error);
    }
};

// Para usar: Adicione um botão temporário em qualquer página
// <button onClick={resetUserStats}>Resetar Stats</button>
