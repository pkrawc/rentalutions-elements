import React from "react"
import { Box } from "@rent_avail/layout"

function useAutocompleteList(props) {
  return {
    ...props,
  }
}

export function Unsafe_AutocompleteList(props) {
  const autocompleteProps = useAutocompleteList(props)
  return <Box {...autocompleteProps} />
}
