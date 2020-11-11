import React, { useContext, forwardRef, useRef } from "react"
import Input from "@rent_avail/input"
import { AutocompleteContext } from "./wrapper"
import { mergeRefs, noop, wrapEvent } from "@rent_avail/utils"

function useAutocompleteInput({ onChange = noop, onKeyDown = noop, ...props }) {
  const { query, selection } = useContext(AutocompleteContext)
  const innerRef = useRef()
  function handleKeyDown() {}
  function handleChange() {}
  return {
    ...props,
    ref: mergeRefs(props.ref, innerRef),
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
