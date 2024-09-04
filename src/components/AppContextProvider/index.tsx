import { useRef, useState } from "react"
import { AppContext } from "../../utils/context"
import { AppContextProviderComponent } from "./types"
import { TransactionApprovalProvider } from "./TransactionApprovalContext"

export const AppContextProvider: AppContextProviderComponent = ({ children }) => {
  const cache = useRef(new Map<string, string>())
  const [error, setError] = useState<string>("")

  return (
    <AppContext.Provider value={{ setError, cache }}>
      <TransactionApprovalProvider>
      {error ? (
        <div className="RampError">
          <h1 className="RampTextHeading--l">Oops. Application broken</h1>
          <div className="RampBreak--l" />
          Error: {error}
        </div>
      ) : (
        children
      )}
     </TransactionApprovalProvider>
    </AppContext.Provider>
  )
}
