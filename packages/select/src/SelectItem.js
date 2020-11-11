import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react"
import { Box } from "@rent_avail/layout"
import { wrapEvent, mergeRefs } from "@rent_avail/utils"
import { SelectContext, types } from "./SelectProvider"

function SelectItem(
  {
    as = "li",
    sx = {},
    onClick,
    onKeyDown,
    value: itemValue,
    name,
    label,
    ...props
  },
  ref
) {
  const itemRef = useRef(null)
  const { state, dispatch, onSelect } = useContext(SelectContext)
  const [visible, setVisible] = useState(true)
  function handleSelect({ target }) {
    dispatch({ type: types.SET_VALUE, payload: target.dataset.value })
    onSelect(target.dataset.value)
  }
  function handleKeyDown({ key, target }) {
    const itemEl = itemRef.current
    if (key === "ArrowDown") itemEl.nextSibling?.focus()
    if (key === "ArrowUp") itemEl.previousSibling?.focus()
    if (key === "Enter") handleSelect({ target })
    if (key === "Escape") dispatch({ type: types.CLOSE_LIST })
  }
  useEffect(() => {
    function isFiltered() {
      const matcher = new RegExp(state.typeAheadQuery, "i")
      const search = name || label || state.value
      if (!state.typeAheadQuery.length) return true
      if (search.match(matcher)) return true
      return false
    }
    setVisible(isFiltered())
  }, [state.typeAheadQuery])
  return visible ? (
    <Box
      {...props}
      ref={mergeRefs(ref, itemRef)}
      as={as}
      data-value={itemValue}
      tabIndex="0"
      role="menuitem"
      onClick={wrapEvent(onClick, handleSelect)}
      onKeyDown={wrapEvent(onKeyDown, handleKeyDown)}
      sx={{
        p: "2rem",
        outline: "none",
        cursor: "pointer",
        bg: itemValue === state.value ? "blue_100" : "transparent",
        "&:hover, &:focus": { bg: "ui_300" },
        "&:not(:last-of-type)": {
          borderBottomStyle: "solid",
          borderBottomWidth: 1,
          borderBottomColor: "ui_500",
        },
        ...sx,
      }}
    />
  ) : null
}

export default forwardRef(SelectItem)
