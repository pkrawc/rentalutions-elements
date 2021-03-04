import {
  createContext,
  useRef,
  useReducer,
  useContext,
  useEffect,
  useState,
} from "react"
import { noop, wrapEvent, mergeRefs, useResize } from "@rent_avail/utils"
import clsx from "clsx"

export const SelectContext = createContext()

export const types = {
  OPEN_LIST: "@rent_avail/elements/select/open_list",
  CLOSE_LIST: "@rent_avail/elements/select/close_list",
  UPDATE_WIDTH: "@rent_avail/elements/select/update_width",
  UPDATE_INPUT: "@rent_avail/elements/select/update_input",
  SET_VALUE: "@rent_avail/elements/select/set_value",
  SET_ERROR: "@rent_avail/elements/select/set_value",
}

function selectReducer(state, action) {
  switch (action.type) {
    case types.OPEN_LIST:
      return { ...state, isOpen: true }
    case types.CLOSE_LIST:
      return { ...state, isOpen: false, typeAheadQuery: "" }
    case types.UPDATE_WIDTH:
      return { ...state, width: action.payload }
    case types.UPDATE_INPUT:
      return { ...state, typeAheadQuery: action.payload, value: "" }
    case types.SET_VALUE:
      return {
        ...state,
        isOpen: false,
        valueBox: action.payload.label || action.payload.value,
        value: action.payload.value,
        typeAheadQuery: "",
      }
    default:
      throw Error(`Unknown action type ${action.type}.`)
  }
}

export function useSelect({
  id,
  onSelect = noop,
  disabled = false,
  defaultValue = "",
  search = true,
}) {
  const inputRef = useRef()
  const listRef = useRef()
  const [state, dispatch] = useReducer(selectReducer, {
    value: defaultValue,
    typeAheadQuery: "",
    width: 120,
    isOpen: false,
    search,
    disabled,
  })
  return {
    id,
    onSelect,
    disabled,
    defaultValue,
    search,
    state,
    dispatch,
    listRef,
    inputRef,
  }
}

export function useSelectInput({
  className,
  onFocus,
  onChange,
  onKeyDown,
  ref,
  ...props
}) {
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
  return {
    state,
    inputProps: {
      ...props,
      className: clsx(className, { filled: state.value.length }),
      onFocus: wrapEvent(onFocus, handleFocus),
      onChange: wrapEvent(onChange, handleChange),
      onKeyDown: wrapEvent(onKeyDown, handleKeyDown),
      ref: mergeRefs(ref, inputRef),
    },
    valueBoxProps: {
      "aria-hidden": !state.value.length,
      hidden: !state.value.length,
      children: state.valueBox,
    },
  }
}

export function useSelectList({ ref, as = "ul", style = {}, ...props }) {
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
  return {
    open: state.isOpen,
    id: state.id,
    inputRef,
    listHtmlProps: {
      ...props,
      as,
      ref: mergeRefs(ref, listRef),
      style: {
        ...style,
        width: inputBounds.width || "auto",
      },
    },
  }
}

export function useSelectOption({
  onClick,
  onKeyDown,
  value: optionValue,
  name,
  label,
  ref,
  ...props
}) {
  const optionRef = useRef()
  const { state, dispatch, onSelect } = useContext(SelectContext)
  const [hidden, setHidden] = useState(false)
  const selected = optionValue === state.value

  function handleSelect({ target }) {
    const { value, label } = target.dataset
    dispatch({ type: types.SET_VALUE, payload: target.dataset })
    onSelect(value)
  }

  function handleKeyDown({ key, target }) {
    const itemEl = optionRef.current
    if (key === "ArrowDown") itemEl.nextSibling?.focus()
    if (key === "ArrowUp") itemEl.previousSibling?.focus()
    if (key === "Enter") handleSelect({ target })
    if (key === "Escape") dispatch({ type: types.CLOSE_LIST })
  }

  useEffect(() => {
    setHidden(() => {
      const matcher = new RegExp(state.typeAheadQuery, "i")
      const search = name || label || state.value
      if (!state.typeAheadQuery.length) return false
      if (search.match(matcher)) return false
      return true
    })
  }, [state.typeAheadQuery])

  return {
    ...props,
    as: "li",
    "aria-hidden": hidden,
    "data-label": label,
    "data-value": optionValue,
    hidden,
    name,
    onClick: wrapEvent(onClick, handleSelect),
    onKeyDown: wrapEvent(onKeyDown, handleKeyDown),
    role: "option",
    ref: mergeRefs(optionRef, ref),
    tabIndex: "0",
    selected,
  }
}
