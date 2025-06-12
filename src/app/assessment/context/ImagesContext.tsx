'use client';

import { createContext, ReactNode, RefObject, useContext, useRef } from 'react';

type ImagesFromContextType = {
    filesRef: RefObject<(File | null)[]>;
};

const ImagesContext = createContext<ImagesFromContextType | null>(null);

export const ImagesProvider = ({ children }: { children: ReactNode }) => {
    const filesRef = useRef<(File | null)[]>([null, null, null]);

    return (
        <ImagesContext.Provider value={{ filesRef }}>
            {children}
        </ImagesContext.Provider>
    );
};

export const useImagesContext = () => {
    const ctx = useContext(ImagesContext);
    if (!ctx) {
        throw new Error('useImagesContext must be used within ImagesProvider');
    }
    return ctx;
};
