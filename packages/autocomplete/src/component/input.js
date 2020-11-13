import React, { useContext, forwardRef } from "react"
import Input from "@rent_avail/input"
import { AutocompleteContext } from "./wrapper"
import { mergeRefs, noop, wrapEvent } from "@rent_avail/utils"

function useAutocompleteInput({ onChange = noop, onKeyDown = noop, ...props }) {
  const {
    query,
    selection,
    setQuery,
    error,
    inputRef,
    clearSelection,
    onClear,
  } = useContext(AutocompleteContext)
  function handleKeyDown({ key }) {
    if (selection) clearSelection(onClear)
    if (key === "ArrowDown") listRef.current?.firstElementChild.focus()
  }
  function handleChange({ target }) {
    setQuery(target.value)
  }
  return {
    ...props,
    error: error || props.error,
    ref: mergeRefs(props.ref, inputRef),
    onChange: wrapEvent(onChange, handleChange),
    onKeyDown: wrapEvent(onKeyDown, handleKeyDown),
    value: query,
    selection,
  }
}

export const Unsafe_AutocompleteInput = forwardRef(
  function Unsafe_AutocompleteInput(props, ref) {
    const { selection, ...htmlProps } = useAutocompleteInput({
      ...props,
      ref,
    })
    return <Input {...htmlProps} className={selection && "filled"} />
  }
)
