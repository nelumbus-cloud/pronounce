import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWords } from '../contexts/WordContext';
import { Plus, LogOut, Volume2, Edit3, Trash2, Play, Pause, Gauge, VolumeX, Star } from 'lucide-react';
import AddWordModal from './AddWordModal';

export default function Dashboard() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingWord, setEditingWord] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [playingWord, setPlayingWord] = useState(null);
    const [playingSentence, setPlayingSentence] = useState(null);
    const [isPlayingAll, setIsPlayingAll] = useState(false);
    const playAllAbortRef = useRef({ stopped: false });
    const [speechSpeed, setSpeechSpeed] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const { currentUser, logout } = useAuth();
    const { words, loading, deleteWord, updateWord } = useWords();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleDeleteWord = async (id) => {
        if (window.confirm('Are you sure you want to delete this word?')) {
            try {
                await deleteWord(id);
            } catch (error) {
                console.error('Error deleting word:', error);
            }
        }
    };

    const speakText = (text) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = speechSpeed;
        utterance.volume = isMuted ? 0 : 1;
        utterance.onend = () => {
            setPlayingWord(null);
            setPlayingSentence(null);
        };
        utterance.onerror = () => {
            setPlayingWord(null);
            setPlayingSentence(null);
        };
        window.speechSynthesis.speak(utterance);
    };

    const handlePlayWord = (word) => {
        if (playingWord === word.id) {
            window.speechSynthesis.cancel();
            setPlayingWord(null);
        } else {
            setPlayingWord(word.id);
            setPlayingSentence(null);
            speakText(word.word);
        }
    };

    const handlePlaySentence = (word) => {
        if (!word.sentence) return;

        if (playingSentence === word.id) {
            window.speechSynthesis.cancel();
            setPlayingSentence(null);
        } else {
            setPlayingSentence(word.id);
            setPlayingWord(null);
            speakText(word.sentence);
        }
    };

    const handleEditWord = (word) => {
        setEditingWord(word);
        setShowAddModal(true);
    };

    const handleEditSentence = (word) => {
        setEditingWord({ ...word, editingSentence: true });
        setShowAddModal(true);
    };

    const handleToggleFavorite = async (word) => {
        try {
            await updateWord(word.id, {
                ...word,
                isFavorite: !word.isFavorite
            });
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    // Sort words: favorites first, then by creation date
    const sortedWords = [...words].sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return new Date(b.createdAt?.seconds * 1000) - new Date(a.createdAt?.seconds * 1000);
    });

    // Filtered by search query (match word or sentence)
    const filteredWords = sortedWords.filter((w) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (w.word && w.word.toLowerCase().includes(q)) || (w.sentence && w.sentence.toLowerCase().includes(q));
    });

    // Helper: speak text and return a Promise that resolves when speech ends
    const speakTextPromise = (text) => {
        return new Promise((resolve) => {
            try {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = speechSpeed;
                utterance.volume = isMuted ? 0 : 1;
                utterance.onend = () => resolve();
                utterance.onerror = () => resolve();
                window.speechSynthesis.speak(utterance);
            } catch (e) {
                // If speech API is not available or errors, resolve so sequence continues
                resolve();
            }
        });
    };

    const pause = (ms) => new Promise((res) => setTimeout(res, ms));

    const handlePlayAll = async () => {
        if (isPlayingAll) {
            // stop playback
            playAllAbortRef.current.stopped = true;
            window.speechSynthesis.cancel();
            setIsPlayingAll(false);
            setPlayingWord(null);
            setPlayingSentence(null);
            return;
        }

        const list = filteredWords.length > 0 ? filteredWords : sortedWords;
        if (!list || list.length === 0) return;

        playAllAbortRef.current.stopped = false;
        setIsPlayingAll(true);

        for (let i = 0; i < list.length; i++) {
            if (playAllAbortRef.current.stopped) break;
            const w = list[i];

            // Speak word
            setPlayingWord(w.id);
            setPlayingSentence(null);
            await speakTextPromise(w.word || '');
            if (playAllAbortRef.current.stopped) break;
            await pause(400);

            // Speak sentence if exists
            if (w.sentence) {
                setPlayingWord(null);
                setPlayingSentence(w.id);
                await speakTextPromise(w.sentence);
                if (playAllAbortRef.current.stopped) break;
                await pause(600);
            }
        }

        playAllAbortRef.current.stopped = true;
        setIsPlayingAll(false);
        setPlayingWord(null);
        setPlayingSentence(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <Volume2 className="h-8 w-8 text-primary-600" />
                            <h1 className="ml-2 text-2xl font-bold text-gray-900">PronouncD</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                Welcome, {currentUser?.displayName || 'User'}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                            >
                                <LogOut className="h-4 w-4 mr-1" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    {/* Search input replaces title/subtitle */}
                    <div className="flex items-center w-full max-w-xl">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search words or example sentences..."
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            aria-label="Search words"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="ml-2 px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    <div className="ml-6">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Word
                        </button>
                    </div>
                </div>

                {/* Speed Control Section */}
                {words.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Gauge className="h-5 w-5 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">Speed:</span>
                                </div>
                                <div className="flex space-x-1">
                                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                                        <button
                                            key={speed}
                                            onClick={() => setSpeechSpeed(speed)}
                                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${speechSpeed === speed
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {speed}x
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handlePlayAll}
                                    className={`px-3 py-2 rounded-md flex items-center space-x-2 ${isPlayingAll ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    title={isPlayingAll ? 'Stop play all' : 'Play all words'}
                                >
                                    {isPlayingAll ? (
                                        <Pause className="h-4 w-4" />
                                    ) : (
                                        <Play className="h-4 w-4" />
                                    )}
                                    <span className="text-xs">Play All</span>
                                </button>

                                <button
                                    onClick={() => setIsMuted(!isMuted)}
                                    className={`p-2 rounded-md transition-colors ${isMuted
                                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                </button>
                                <span className="text-xs text-gray-500">
                                    {isMuted ? 'Muted' : 'Unmuted'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Words Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : words.length === 0 ? (
                    <div className="text-center py-12">
                        <Volume2 className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No words yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by adding your first word to practice.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add your first word
                            </button>
                        </div>
                    </div>
                ) : filteredWords.length === 0 ? (
                    <div className="text-center py-12">
                        <Volume2 className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No matching words</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Try a different search term or add a new word.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setShowAddModal(true);
                                }}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add a word
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredWords.map((word) => (
                            <div key={word.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        {/* Star Icon - Top Right */}
                                        <div className="flex justify-end mb-2">
                                            <button
                                                onClick={() => handleToggleFavorite(word)}
                                                className={`p-1 rounded-full transition-colors ${word.isFavorite
                                                    ? 'text-yellow-500 hover:text-yellow-600'
                                                    : 'text-gray-300 hover:text-yellow-400'
                                                    }`}
                                            >
                                                <Star
                                                    className={`h-5 w-5 ${word.isFavorite ? 'fill-current' : ''
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                        {/* Word - Click to play, Double click to edit */}
                                        <div
                                            className="flex items-center cursor-pointer group"
                                            onClick={() => handlePlayWord(word)}
                                            onDoubleClick={() => handleEditWord(word)}
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                                {word.word}
                                            </h3>
                                            {playingWord === word.id ? (
                                                <Pause className="h-4 w-4 ml-2 text-primary-600" />
                                            ) : (
                                                <Play className="h-4 w-4 ml-2 text-gray-400 group-hover:text-primary-600 transition-colors" />
                                            )}
                                        </div>

                                        {/* Sentence - Click to play, Double click to edit */}
                                        {word.sentence && (
                                            <div
                                                className="mt-2 cursor-pointer group"
                                                onClick={() => handlePlaySentence(word)}
                                                onDoubleClick={() => handleEditSentence(word)}
                                            >
                                                <p className="text-sm text-gray-600 group-hover:text-primary-600 transition-colors italic">
                                                    "{word.sentence}"
                                                </p>
                                                {playingSentence === word.id ? (
                                                    <Pause className="h-3 w-3 mt-1 text-primary-600" />
                                                ) : (
                                                    <Play className="h-3 w-3 mt-1 text-gray-400 group-hover:text-primary-600 transition-colors" />
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center text-xs text-gray-500 mt-3">
                                            <span>Added {new Date(word.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex space-x-2">
                                    <button
                                        onClick={() => handleDeleteWord(word.id)}
                                        className="px-3 py-2 border border-red-300 text-red-700 text-sm font-medium rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Add Word Modal */}
            {showAddModal && (
                <AddWordModal
                    isOpen={showAddModal}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingWord(null);
                    }}
                    editingWord={editingWord}
                />
            )}
        </div>
    );
}
