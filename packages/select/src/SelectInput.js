import React, { useContext, forwardRef, useImperativeHandle } from "react"
import { Box } from "@rent_avail/layout"
import Input from "@rent_avail/input"
import { wrapEvent, mergeRefs } from "@rent_avail/utils"
import { ChevronDown } from "react-feather"
import clsx from "clsx"
import { SelectContext, types } from "./SelectProvider"

function SelectInput(
  { className, onFocus, onChange, onKeyDown, sx, ...props },
  ref
) {
  const { state, dispatch, listRef, inputRef } = useContext(SelectContext)
  function handleFocus() {
    dispatch({ type: types.OPEN_LIST })
  }
  function handleChange({ target }) {
    if (state.search) {
      dispatch({ type: types.UPDATE_INPUT, payload: target.value })
    }
  }
  function handleKeyDown({ key }) {
    if (key === "ArrowDown") listRef.current.firstChild.focus()
    if (key === "Tab") dispatch({ type: types.CLOSE_LIST })
  }
  return (
    <Box as="section" sx={{ position: "relative", ...sx }}>
      <Input
        {...props}
        ref={mergeRefs(ref, inputRef)}
        value={state.typeAheadQuery}
        onFocus={wrapEvent(onFocus, handleFocus)}
        onChange={wrapEvent(onChange, handleChange)}
        onKeyDown={wrapEvent(onKeyDown, handleKeyDown)}
        className={clsx(className, { filled: state.value })}
        sx={{
          "& input": { color: "transparent", textShadow: "0 0 0 #2d2d2d" },
        }}
      />
      <Box
        as={ChevronDown}
        sx={{
          position: "absolute",
          top: "2.25rem",
          right: "2rem",
          transition: "200ms",
          transform: state.isOpen ? "rotate(180deg)" : "rotate(0)",
        }}
      />
      {state.value && (
        <Box
          sx={{
            position: "absolute",
            top: "3.334rem",
            left: "2rem",
            bg: "blue_100",
            px: "0.5rem",
            borderRadius: 4,
            color: "blue_700",
          }}
        >
          {state.value}
        </Box>
      )}
    </Box>
  )
}

export default forwardRef(SelectInput)
