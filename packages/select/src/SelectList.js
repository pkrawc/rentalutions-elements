import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useEffect,
} from "react"
import Popover from "@rent_avail/popover"
import { Box } from "@rent_avail/layout"
import { useResize, mergeRefs } from "@rent_avail/utils"
import { SelectContext, types } from "./SelectProvider"

function SelectList({ as = "ul", sx = {}, style = {}, ...props }, ref) {
  const { state, dispatch, listRef, inputRef } = useContext(SelectContext)
  const inputBounds = useResize(inputRef)
  const listBounds = useResize(listRef)
  useEffect(() => {
    let cancelled = false
    function handleDocumentClick({ target }) {
      if (!state.isOpen) return false
      const listEl = listRef.current
      const inputEl = inputRef.current
      if (!listEl?.contains(target) && !inputEl?.contains(target)) {
        dispatch({ type: types.CLOSE_LIST })
      }
    }
    function scrollWindow(top, fromBottom) {
      if (!cancelled) window.scrollBy(0, Math.max(top - fromBottom + 120, 0))
    }
    document.addEventListener("click", handleDocumentClick)
    if (state.isOpen) {
      const fromBottom = window.innerHeight - listBounds.height
      setTimeout(() => scrollWindow(inputBounds.top, fromBottom), 20)
    }
    return () => {
      cancelled = true
      document.removeEventListener("click", handleDocumentClick)
    }
  }, [state.isOpen])
  return state.isOpen ? (
    <Popover
      id={state.id}
      targetRef={inputRef}
      position={{ x: "left", y: "bottom" }}
      style={{ zIndex: "9999" }}
    >
      <Box
        {...props}
        ref={mergeRefs(ref, listRef)}
        as={as}
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
        style={{
          ...style,
          width: inputBounds.width || "auto",
        }}
      />
    </Popover>
  ) : null
}

export default forwardRef(SelectList)
