import React, { createContext, useContext, useState, useCallback } from "react";

type TransactionApprovalContextProps = {
  approvals: Map<string, boolean>;
  setTransactionApproval: (transactionId: string, approved: boolean) => void;
};

const TransactionApprovalContext = createContext<TransactionApprovalContextProps | undefined>(undefined);

export const TransactionApprovalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [approvals, setApprovals] = useState<Map<string, boolean>>(new Map());

  const setTransactionApproval = useCallback((transactionId: string, approved: boolean) => {
    setApprovals(prev => new Map(prev).set(transactionId, approved));
  }, []);

  return (
    <TransactionApprovalContext.Provider value={{ approvals, setTransactionApproval }}>
      {children}
    </TransactionApprovalContext.Provider>
  );
};

export const useTransactionApproval = () => {
  const context = useContext(TransactionApprovalContext);
  if (context === undefined) {
    throw new Error("useTransactionApproval must be used within a TransactionApprovalProvider");
  }
  return context;
};
