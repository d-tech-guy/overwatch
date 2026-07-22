"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { submitIncident } from "@/actions/incidents";
import { PROCESSING_STATUS } from "@/lib/constants";


interface InvestigationContextType {
  activeInvestigationId: string | null;
  publicToken: string | null;
  isModalOpen: boolean;
  isMinimized: boolean;
  status: string | null;
  progress: number;
  openModal: () => void;
  closeModal: () => void;
  minimizeModal: () => void;
  restoreModal: () => void;
  startInvestigation: (url: string) => Promise<void>;
  updateProgress: (status: string, progress: number) => void;
  completeInvestigation: () => void;
}

const InvestigationContext = createContext<InvestigationContextType | undefined>(undefined);

export function InvestigationProvider({ children }: { children: ReactNode }) {
  const [activeInvestigationId, setActiveInvestigationId] = useState<string | null>(null);
  const [publicToken, setPublicToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsMinimized(false);
    setActiveInvestigationId(null);
    setPublicToken(null);
    setStatus(null);
    setProgress(0);
  };
  const minimizeModal = () => {
    setIsModalOpen(false);
    setIsMinimized(true);
  };
  const restoreModal = () => {
    setIsModalOpen(true);
    setIsMinimized(false);
  };

  const startInvestigation = async (url: string) => {
    setStatus(PROCESSING_STATUS.queued);
    setProgress(0);
    setIsModalOpen(true);
    
    try {
      const formData = new FormData();
      formData.append("url", url);
      const result = await submitIncident(formData);
      
      if ('error' in result) {
        setStatus("failed");
        return;
      }
      
      if ('id' in result) {
        setActiveInvestigationId(result.id);
        setPublicToken(result.publicToken);
      }
    } catch (err) {
      console.error("Failed to start investigation", err);
      setStatus("failed");
    }
  };

  const updateProgress = (newStatus: string, newProgress: number) => {
    setStatus(newStatus);
    setProgress(newProgress);
  };
  
  const completeInvestigation = () => {
    setStatus(PROCESSING_STATUS.completed);
    setProgress(100);
  };

  return (
    <InvestigationContext.Provider
      value={{
        activeInvestigationId,
        publicToken,
        isModalOpen,
        isMinimized,
        status,
        progress,
        openModal,
        closeModal,
        minimizeModal,
        restoreModal,
        startInvestigation,
        updateProgress,
        completeInvestigation
      }}
    >
      {children}
    </InvestigationContext.Provider>
  );
}

export function useInvestigationContext() {
  const context = useContext(InvestigationContext);
  if (context === undefined) {
    throw new Error("useInvestigationContext must be used within an InvestigationProvider");
  }
  return context;
}
