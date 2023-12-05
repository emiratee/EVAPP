import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const useChat = () => {
    return useContext(ChatContext);
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [name, setName] = useState('HOLA');
    const [imageUrl, setImageUrl] = useState();

    return <ChatContext.Provider value={{
        name,
        setName,
        imageUrl,
        setImageUrl
    }}>
        {children}
    </ChatContext.Provider>;
};