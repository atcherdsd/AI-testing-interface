'use client';

import React, { createContext, useContext, useState } from 'react';

type ReportContainerRefContextType = {
    containerRef: HTMLDivElement | null;
    setContainerRef: (el: HTMLDivElement | null) => void;
};

const ReportContainerRefContext = createContext<ReportContainerRefContextType>({
    containerRef: null,
    setContainerRef: () => {},
});

export const useReportContainerRef = () => useContext(ReportContainerRefContext);

export const ReportContainerRefProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
    return (
        <ReportContainerRefContext.Provider value={{ containerRef, setContainerRef }}>
            {children}
        </ReportContainerRefContext.Provider>
    );
};
