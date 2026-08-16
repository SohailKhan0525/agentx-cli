import { createContext, createSignal, useContext, type ParentProps, type Accessor } from "solid-js"
import { InstallationVersion } from "@agentx-cli/core/installation/version"

interface VersionContextValue {
  version: Accessor<string>
  setVersion: (version: string) => void
}

const VersionContext = createContext<VersionContextValue>()

export function VersionProvider(props: ParentProps) {
  const [version, setVersion] = createSignal<string>(InstallationVersion)

  return (
    <VersionContext.Provider value={{ version, setVersion }}>
      {props.children}
    </VersionContext.Provider>
  )
}

export function useVersion() {
  const ctx = useContext(VersionContext)
  if (!ctx) {
    return {
      version: () => InstallationVersion,
      setVersion: () => {},
    }
  }
  return ctx
}
