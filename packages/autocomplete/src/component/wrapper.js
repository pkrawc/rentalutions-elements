import React, { createContext, useMemo, useState } from "react"
import useAutocomplete from "../use-autocomplete"
import { Box } from "@rent_avail/layout"

export const AutocompleteContext = createContext()

function useAutocompleteWrapper({ id, children, ...htmlProps }) {
  const [manual, setManual] = useState(false)
  const autocomplete = useAutocomplete()
  return {
    id,
    children,
    htmlProps,
    manual,
    setManual,
    ...autocomplete,
  }
}

export function Unsafe_Autocomplete(props) {
  const { htmlProps, children, id, ...ctx } = useAutocompleteWrapper(props)
  const context = useMemo(() => ctx, [ctx])
  return (
    <AutocompleteContext.Provider value={context}>
      <Box {...htmlProps} id={id} sx={{ postion: "relative" }}>
        {children}
      </Box>
    </AutocompleteContext.Provider>
  )
}
