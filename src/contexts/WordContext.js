import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const WordContext = createContext();

export function useWords() {
    return useContext(WordContext);
}

export function WordProvider({ children }) {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();

    const addWord = async (wordData) => {
        if (!currentUser) return;

        try {
            const docRef = await addDoc(collection(db, 'words'), {
                ...wordData,
                userId: currentUser.uid,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Refresh the words list after adding
            await fetchWords();

            return docRef.id;
        } catch (error) {
            console.error('Error adding word:', error);
            throw error;
        }
    };

    const updateWord = async (id, wordData) => {
        try {
            const wordRef = doc(db, 'words', id);
            await updateDoc(wordRef, {
                ...wordData,
                updatedAt: new Date()
            });

            // Refresh the words list after updating
            await fetchWords();
        } catch (error) {
            console.error('Error updating word:', error);
            throw error;
        }
    };

    const deleteWord = async (id) => {
        try {
            await deleteDoc(doc(db, 'words', id));

            // Refresh the words list after deleting
            await fetchWords();
        } catch (error) {
            console.error('Error deleting word:', error);
            throw error;
        }
    };

    const fetchWords = async () => {
        if (!currentUser) return;

        setLoading(true);
        try {
            const q = query(
                collection(db, 'words'),
                where('userId', '==', currentUser.uid),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const wordsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setWords(wordsData);
        } catch (error) {
            console.error('Error fetching words:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchWords();
        } else {
            setWords([]);
        }
    }, [currentUser]);

    const value = {
        words,
        loading,
        addWord,
        updateWord,
        deleteWord,
        fetchWords
    };

    return (
        <WordContext.Provider value={value}>
            {children}
        </WordContext.Provider>
    );
}
