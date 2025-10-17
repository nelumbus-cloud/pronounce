import React, { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import { useWords } from '../contexts/WordContext';
import { generateSentence } from '../services/geminiService';

export default function AddWordModal({ isOpen, onClose, editingWord }) {
    const [word, setWord] = useState('');
    const [sentence, setSentence] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isGeneratingSentence, setIsGeneratingSentence] = useState(false);
    const { addWord, updateWord } = useWords();

    useEffect(() => {
        if (editingWord) {
            setWord(editingWord.word);
            setSentence(editingWord.sentence || '');
        } else {
            setWord('');
            setSentence('');
        }
        setError('');
    }, [editingWord, isOpen]);

    const handleGenerateSentence = async () => {
        if (!word.trim()) {
            setError('Please enter a word first');
            return;
        }

        setIsGeneratingSentence(true);
        setError('');

        try {
            const generatedSentence = await generateSentence(word);
            setSentence(generatedSentence);
        } catch (error) {
            setError('Failed to generate sentence. Please try again.');
            console.error('Error generating sentence:', error);
        } finally {
            setIsGeneratingSentence(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!word.trim()) {
            setError('Please enter a word');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const wordData = {
                word: word.trim(),
                sentence: sentence.trim() || null
            };

            if (editingWord) {
                await updateWord(editingWord.id, wordData);
            } else {
                await addWord(wordData);
            }

            onClose();
        } catch (error) {
            setError('Failed to save word. Please try again.');
            console.error('Error saving word:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        {editingWord ?
                            (editingWord.editingSentence ? 'Edit Sentence' : 'Edit Word') :
                            'Add New Word'
                        }
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!editingWord?.editingSentence && (
                        <div>
                            <label htmlFor="word" className="block text-sm font-medium text-gray-700 mb-1">
                                Word *
                            </label>
                            <input
                                type="text"
                                id="word"
                                value={word}
                                onChange={(e) => setWord(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Enter word to practice"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="sentence" className="block text-sm font-medium text-gray-700 mb-1">
                            {editingWord?.editingSentence ? 'Sentence *' : 'Sentence (Optional)'}
                        </label>
                        <div className="flex space-x-2">
                            <textarea
                                id="sentence"
                                value={sentence}
                                onChange={(e) => setSentence(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder={editingWord?.editingSentence ? "Enter a sentence" : "Enter a sentence or leave empty to auto-generate"}
                                rows={3}
                                required={editingWord?.editingSentence}
                            />
                            {!editingWord?.editingSentence && (
                                <button
                                    type="button"
                                    onClick={handleGenerateSentence}
                                    disabled={isGeneratingSentence || !word.trim()}
                                    className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    {isGeneratingSentence ? (
                                        <Loader className="h-4 w-4 animate-spin" />
                                    ) : (
                                        'Generate'
                                    )}
                                </button>
                            )}
                        </div>
                        {!editingWord?.editingSentence && (
                            <p className="text-xs text-gray-500 mt-1">
                                Leave empty to auto-generate a sentence using AI
                            </p>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <Loader className="h-4 w-4 animate-spin mr-2" />
                                    {editingWord ?
                                        (editingWord.editingSentence ? 'Updating Sentence...' : 'Updating...') :
                                        'Adding...'
                                    }
                                </div>
                            ) : (
                                editingWord ?
                                    (editingWord.editingSentence ? 'Update Sentence' : 'Update Word') :
                                    'Add Word'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
