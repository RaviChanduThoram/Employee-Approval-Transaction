import { Fragment, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { InputSelect } from "./components/InputSelect"
import { Instructions } from "./components/Instructions"
import { Transactions } from "./components/Transactions"
import { useEmployees } from "./hooks/useEmployees"
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions"
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee"
import { EMPTY_EMPLOYEE } from "./utils/constants"
import { Employee } from "./utils/types"
import { AppContext } from "./utils/context"

export function App() {
  const { data: employees, ...employeeUtils } = useEmployees()
  const { data: paginatedTransactions, ...paginatedTransactionsUtils } = usePaginatedTransactions()
  const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } = useTransactionsByEmployee()
  const [isLoading, setIsLoading] = useState(false)
  
  const [displayedEmployeeIds,setDisplayedEmployeeIds]=useState<Set<string>>(new Set())
  const [displayedTransactions,setDisplayedTransactions]=useState<number>(5);

  const transactions = useMemo(
    () => paginatedTransactions?.data ?? transactionsByEmployee ?? null,
    [paginatedTransactions, transactionsByEmployee]
  )
 const { cache } = useContext(AppContext); 

  const loadAllTransactions = useCallback(async () => {
    setIsLoading(true)
    transactionsByEmployeeUtils.invalidateData()
    await employeeUtils.fetchAll()
    await paginatedTransactionsUtils.fetchAll()
    setDisplayedTransactions((prevCount=>prevCount+5));
    
    setIsLoading(false)
  }, [employeeUtils, paginatedTransactionsUtils, transactionsByEmployeeUtils])

  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {
      paginatedTransactionsUtils.invalidateData()
      await transactionsByEmployeeUtils.fetchById(employeeId)
      setDisplayedTransactions(5)
      setDisplayedEmployeeIds((prevState) => {
        const newSet = new Set(prevState);
        newSet.add(employeeId);
        return newSet;                     
      })
    },
    [paginatedTransactionsUtils, transactionsByEmployeeUtils]
  )

  useEffect(() => {
    if (employees === null && !employeeUtils.loading) {
      loadAllTransactions();
    }
  
  }, [employeeUtils.loading, employees, loadAllTransactions, transactions]);
  
 
  const hasMoreTransactions = transactions !== null && transactions.length > displayedTransactions
  
  

  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />

        <hr className="RampBreak--l" />

        <InputSelect<Employee>
          isLoading={isLoading}
          defaultValue={EMPTY_EMPLOYEE}
          items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
          label="Filter by employee"
          loadingLabel="Loading employees"
          parseItem={(item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          })}
          onChange={async (newValue) => {
            if (newValue === null) {
              return
            }

            await loadTransactionsByEmployee(newValue.id)
          }}
        />

        <div className="RampBreak--l" />

        <div className="RampGrid">
        <Transactions transactions={transactions ? transactions.slice(0, displayedTransactions) : []}
          />

        <button
            className="RampButton"
            disabled={!hasMoreTransactions || paginatedTransactionsUtils.loading} // Disable if no more transactions or loading
            onClick={() => setDisplayedTransactions(displayedTransactions + 5)}
          >
    View More
  </button>

        </div>
      </main>
    </Fragment>
  )
}
