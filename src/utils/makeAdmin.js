// Script para tornar usuário admin
// Execute no console do navegador (F12) após fazer login

import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

const makeAdmin = async () => {
    const user = auth.currentUser;

    if (!user) {
        console.error('❌ Você precisa estar logado!');
        return;
    }

    try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
            role: 'admin'
        });

        console.log('✅ Você agora é admin!');
        console.log('🔄 Recarregue a página e acesse: /admin');
    } catch (error) {
        console.error('❌ Erro:', error);
    }
};

// Execute:
makeAdmin();
