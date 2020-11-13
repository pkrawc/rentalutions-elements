import React, {
  createContext,
  useMemo,
  useState,
  useRef,
  useContext,
} from "react"
import useAutocomplete from "../use-autocomplete"
import { Box } from "@rent_avail/layout"
import { noop } from "@rent_avail/utils"

export const AutocompleteContext = createContext()

function useAutocompleteWrapper({
  id,
  children,
  onClear = noop,
  ...htmlProps
}) {
  const inputRef = useRef()
  const listRef = useRef()
  const [manual, setManual] = useState(false)
  const autocomplete = useAutocomplete()
  return {
    id,
    children,
    htmlProps,
    manual,
    setManual,
    inputRef,
    listRef,
    onClear,
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

function Unsafe_AutocompleteSelection() {
  const { selected } = useContext(AutocompleteContext)
  return (
    selected && (
      <Box
        sx={{
          position: "absolute",
          top: "3.25rem",
          left: "2rem",
          display: "flex",
          px: "0.5rem",
          py: "0.25rem",
          bg: "blue_100",
          borderRadius: "0.25rem",
          maxWidth: "calc(100% - 4rem)",
          pointerEvents: "none",
          color: "blue_700",
        }}
      >
        <Box
          as="span"
          sx={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {selection}
        </Box>
        <Box
          as={X}
          sx={{
            color: "blue_300",
            ml: "0.5rem",
            cursor: "pointer",
            transition: "200ms",
            pointerEvents: "all",
            "&:hover": { color: "blue_500" },
          }}
          onClick={() => clearSelection(onClear)}
        />
      </Box>
    )
  )
}
