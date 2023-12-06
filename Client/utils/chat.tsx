import React, { createContext, useContext, useState } from 'react';

type ChatContextType = {
    name: string | undefined,
    setName: React.Dispatch<React.SetStateAction<string | undefined>>,
    imageUrl: string | undefined,
    setImageUrl: React.Dispatch<React.SetStateAction<string | undefined>>
}

const defaultChatContext: ChatContextType = {
    name: undefined,
    setName: () => { },
    imageUrl: undefined,
    setImageUrl: () => { },
};

const ChatContext = createContext(defaultChatContext);

export const useChat = () => {
    return useContext(ChatContext);
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [name, setName] = useState<string | undefined>(undefined);
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

    return <ChatContext.Provider value={{
        name,
        setName,
        imageUrl,
        setImageUrl
    }}>
        {children}
    </ChatContext.Provider>;
};