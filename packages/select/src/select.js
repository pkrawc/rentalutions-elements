import React, { forwardRef, useMemo } from "react"
import { Box } from "@rent_avail/layout"
import Input from "@rent_avail/input"
import Popover from "@rent_avail/popover"
import { ChevronDown } from "react-feather"
import {
  SelectContext,
  useSelect,
  useSelectInput,
  useSelectList,
  useSelectOption,
} from "./use-select"

export function Select({ children, ...props }) {
  const context = useSelect(props)
  const value = useMemo(() => context, [context])
  return (
    <SelectContext.Provider value={value}>{children}</SelectContext.Provider>
  )
}

export const SelectInput = forwardRef(function SelectInput(
  { sx, ...props },
  ref
) {
  const {
    inputHtmlProps,
    valueBoxHtmlProps,
    iconHtmlProps,
    state,
  } = useSelectInput({ ...props, ref })
  return (
    <Box as="section" sx={{ position: "relative", ...sx }}>
      <Input
        {...inputHtmlProps}
        sx={{
          "& input": { color: "transparent", textShadow: "0 0 0 #2d2d2d" },
        }}
      />
      <Box
        {...iconHtmlProps}
        as={ChevronDown}
        sx={{
          position: "absolute",
          top: "2.5rem",
          right: "2rem",
          transition: "200ms",
          transform: state.open ? "rotate(180deg)" : "rotate(0)",
          pointerEvents: "none",
        }}
      />
      <Box
        {...valueBoxHtmlProps}
        sx={{
          position: "absolute",
          top: "3.75rem",
          left: "2rem",
          maxWidth: "calc(100% - 7rem)",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          bg: "blue_100",
          px: "0.5rem",
          borderRadius: 4,
          color: "blue_700",
          pointerEvents: "none",
        }}
      />
    </Box>
  )
})

export const SelectList = forwardRef(function SelectList(
  { sx = {}, ...props },
  ref
) {
  const { open, id, inputRef, listHtmlProps } = useSelectList({ ...props, ref })
  return open ? (
    <Popover
      id={id}
      targetRef={inputRef}
      position={{ x: "left", y: "bottom" }}
      style={{ zIndex: "9999" }}
    >
      <Box
        {...listHtmlProps}
        sx={{
          display: "block",
          p: 0,
          mb: "2rem",
          bg: "ui_100",
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: "ui_500",
          maxHeight: "calc(100vh - 10rem)",
          overflowY: "auto",
          borderRadius: 4,
          ...sx,
        }}
      />
    </Popover>
  ) : null
})

export const SelectOption = forwardRef(function SelectItem(
  { sx = {}, ...props },
  ref
) {
  const { selected, ...optionHtmlProps } = useSelectOption({ ...props, ref })
  return (
    <Box
      {...optionHtmlProps}
      sx={{
        p: "2rem",
        outline: "none",
        cursor: "pointer",
        bg: selected ? "blue_100" : "transparent",
        "&:hover, &:focus": { bg: "ui_300" },
        "&:not(:last-of-type)": {
          borderBottomStyle: "solid",
          borderBottomWidth: 1,
          borderBottomColor: "ui_500",
        },
        ...sx,
      }}
    />
  )
})
