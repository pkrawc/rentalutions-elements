import React, { useContext } from "react"
import { Box } from "@rent_avail/layout"
import { AutocompleteContext } from "./wrapper"

function useAutocompleteManualInput(props) {
  const { manual } = useContext(AutocompleteContext)
  return {
    manual,
    ...props,
  }
}

export function Unsafe_AutocompleteManualInput(props) {
  const { manual, ...htmlProps } = useAutocompleteManualInput(props)
  return manual && <Box {...htmlProps} />
}
