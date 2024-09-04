import { useCallback } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"
import { useTransactionApproval } from "../AppContextProvider/TransactionApprovalContext"

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithoutCache, loading } = useCustomFetch()
  const { approvals, setTransactionApproval } = useTransactionApproval();

  const setTransactionApprovalState: SetTransactionApprovalFunction = useCallback(
    async ({ transactionId, newValue }) => {
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      });
      setTransactionApproval(transactionId, newValue);
    },
    [fetchWithoutCache, setTransactionApproval]
  );

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={{ ...transaction, approved: approvals.get(transaction.id) ?? transaction.approved }}
          loading={loading}
          setTransactionApproval={setTransactionApprovalState}
        />
      ))}
    </div>
  )
}
