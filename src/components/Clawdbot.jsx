import React, { useState, useEffect, useRef } from 'react';
import {
    Bot, X, Send, Cpu, User, Search, BookOpen, Sparkles
} from 'lucide-react';

const DocumentAI = ({ project }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLobsterConnected, setIsLobsterConnected] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: "Document AI active. How can I help with your docs?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [analyzingDoc, setAnalyzingDoc] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const checkLobster = async () => {
            try {
                // Testing connection to OpenClaw / Lobster gateway
                await fetch('http://127.0.0.1:18789/health', { method: 'GET', mode: 'no-cors' });
                setIsLobsterConnected(true);
            } catch (err) {
                setIsLobsterConnected(false);
            }
        };
        checkLobster();
        const interval = setInterval(checkLobster, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const analyzeDocumentation = (query) => {
        if (!project || !project.documents) return null;
        const queryLower = query.toLowerCase();
        for (const doc of project.documents) {
            const content = project.documentContent?.[doc.id]?.content || "";
            if (content.toLowerCase().includes(queryLower) || doc.title.toLowerCase().includes(queryLower)) {
                const index = content.toLowerCase().indexOf(queryLower);
                const snippet = index !== -1
                    ? content.substring(Math.max(0, index - 50), Math.min(content.length, index + 150)) + "..."
                    : "";
                return { doc, snippet };
            }
        }
        return null;
    };

    const callGeminiAI = async (prompt, context) => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyB2oGcmhX5h6AOPTKHNYNCXZwVh86twkSE";

        // List of models to try in order of preference
        const modelsToTry = [
            import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-pro",
            "gemini-1.0-pro"
        ];

        const systemPrompt = `You are "Document AI". Use this project context to answer:
        
        CONTEXT:
        ${context}
        
        QUESTION:
        ${prompt}`;

        let lastError = null;

        for (const model of modelsToTry) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);

                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: systemPrompt }] }]
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    return data.candidates[0].content.parts[0].text;
                } else {
                    const errorData = await response.json();
                    lastError = errorData.error?.message || 'API Call Failed';
                    console.warn(`Model ${model} failed: ${lastError}`);
                    // Continue to next model if it's a "not found" or "supported" error
                    if (lastError.includes("not found") || lastError.includes("not supported")) {
                        continue;
                    } else {
                        throw new Error(lastError);
                    }
                }
            } catch (err) {
                lastError = err.message;
                console.warn(`Attempt with ${model} failed:`, err);
                if (err.name === 'AbortError') throw new Error("Request timed out");
                continue;
            }
        }

        throw new Error(lastError || "All models failed");
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = {
            id: Date.now(),
            role: 'user',
            content: inputValue,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        const currentInput = inputValue;
        setInputValue('');
        setIsSearching(true);

        try {
            const analysisResult = analyzeDocumentation(currentInput);
            const contextContent = analysisResult
                ? `Relevant section from ${analysisResult.doc.title}: ${analysisResult.snippet}`
                : "No exact keyword match found in primary docs, please use your general knowledge of the project structure.";

            if (analysisResult) setAnalyzingDoc(analysisResult.doc.title);

            const aiResponse = await callGeminiAI(currentInput, contextContent);

            let finalContent = isLobsterConnected
                ? `🦞 **LOBSTER SYSTEM SYNCED**\n\n${aiResponse}`
                : aiResponse;

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: finalContent,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (error) {
            console.error("Chatbot Error Detail:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: `I'm having trouble reaching my AI core. ${error.message ? `Error: ${error.message}` : "Please ensure your Google API key is active and your internet is connected."}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsSearching(false);
            setAnalyzingDoc(null);
        }
    };

    return (
        <div className="fixed bottom-28 right-8 z-[1000] font-sans pointer-events-none">
            {/* Square Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="pointer-events-auto w-10 h-10 bg-blue-600 dark:bg-blue-500 text-white rounded-xl shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
                >
                    <Bot className="w-5 h-5" />
                    {isLobsterConnected && (
                        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                    )}
                    <span className="absolute right-12 px-3 py-1.5 bg-slate-900 text-white text-[9px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Document AI
                    </span>
                </button>
            )}

            {/* Square UI Window */}
            {isOpen && (
                <div className="pointer-events-auto flex flex-col w-[300px] h-[440px] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">

                    {/* Compact Header */}
                    <div className="px-5 pt-5 pb-3 bg-white dark:bg-slate-900 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Document AI</h3>
                                <div className="flex items-center gap-1">
                                    <div className={`w-1 h-1 rounded-full ${isLobsterConnected ? 'bg-green-500' : 'bg-slate-300'}`} />
                                    <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest leading-none">
                                        {isLobsterConnected ? 'Live' : 'Standby'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Simple Activity Bar (Only when analyzing) */}
                    {analyzingDoc && (
                        <div className="mx-5 mb-2 py-1 px-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[9px] font-bold rounded-md border border-blue-100 dark:border-blue-800 animate-pulse flex items-center gap-2">
                            <Search className="w-3 h-3" /> Scanning: {analyzingDoc}
                        </div>
                    )}

                    {/* Micro Chat Area */}
                    <div className="flex-1 overflow-y-auto px-5 py-2 space-y-4 bg-white dark:bg-slate-900 custom-scrollbar">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[90%] px-3.5 py-2.5 rounded-lg text-[12px] leading-relaxed ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                                    }`}>
                                    <div className="whitespace-pre-wrap">{msg.content}</div>
                                    <div className={`text-[8px] mt-1 opacity-40 font-bold ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                        {msg.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isSearching && (
                            <div className="flex justify-start">
                                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg rounded-tl-none border border-slate-100 dark:border-slate-700 flex items-center gap-1">
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-duration:0.6s]" />
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]" />
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]" />
                                    <span className="text-[10px] ml-2 text-blue-500 font-bold animate-pulse">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Clean One-Line Input */}
                    <div className="p-5 bg-white dark:bg-slate-900">
                        <form onSubmit={handleSendMessage} className="relative group">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask Document AI..."
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-lg pl-4 pr-10 py-2.5 text-xs focus:ring-1 focus:ring-blue-500/30 outline-none dark:text-slate-100 transition-all placeholder:text-slate-400"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim()}
                                className={`absolute right-1.5 top-1.5 p-1.5 rounded-md transition-all ${inputValue.trim() ? 'bg-blue-600 text-white' : 'bg-transparent text-slate-300'
                                    }`}
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </form>

                        {/* Context Footer */}
                        <div className="mt-3 flex items-center justify-between opacity-30 select-none">
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500">
                                {project?.name || 'Local Context'}
                            </span>
                            <div className="flex gap-2">
                                <Cpu className="w-2.5 h-2.5" />
                                <BookOpen className="w-2.5 h-2.5" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentAI;
