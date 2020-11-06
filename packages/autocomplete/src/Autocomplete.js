import React, { useState, useRef, useEffect } from "react"
import Input from "@rent_avail/input"
import { Box } from "@rent_avail/layout"
import { noop } from "@rent_avail/utils"
import Popover from "@rent_avail/popover"
import { X } from "react-feather"
import useAutocomplete from "./useAutocomplete"

function GoogleLogo() {
  return (
    <Box
      as="svg"
      viewBox="0 0 24 24"
      sx={{
        width: "1.5rem",
        height: "1.5rem",
        position: "absolute",
        top: "2.25rem",
        right: "2.25rem",
      }}
    >
      <path
        fill="currentColor"
        d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
      />
    </Box>
  )
}

export default function Autocomplete({
  onSelect = noop,
  onClear = noop,
  onManualSelection = noop,
  defaultValue = null,
  ...props
}) {
  const targetRef = useRef()
  const listRef = useRef()
  const [manualOpen, setManualOpen] = useState(false)
  const {
    query,
    setQuery,
    suggestions,
    getDetails,
    selection,
    clearSelection,
    called,
  } = useAutocomplete()
  function handleSelect(place) {
    getDetails({ id: place.place_id, onSelect })
  }
  function handleKeyDown({ key, target }, place) {
    if (selection) clearSelection(onClear)
    if (target.nodeName === "INPUT") {
      if (key === "ArrowDown") listRef.current?.firstElementChild.focus()
    } else {
      const active = document.activeElement
      if (key === "ArrowDown" && active.nextSibling) active.nextSibling.focus()
      if (key === "ArrowUp" && active.previousSibling)
        active.previousSibling.focus()
      if (key === "Enter") getDetails({ id: place.place_id, onSelect })
    }
  }
  async function handleManualSelect(value) {
    await getDetails({ onSelect, manualSelection: value })
    setManualOpen(false)
  }
  useEffect(() => {
    if (defaultValue) {
      getDetails({ manualSelection: { formatted_address: defaultValue } })
    }
  }, [])
  return (
    <Box position="relative">
      <Input
        {...props}
        ref={targetRef}
        onChange={({ target }) => setQuery(target.value)}
        onKeyDown={handleKeyDown}
        value={query}
        className={selection && "filled"}
      />
      {!!selection && (
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
      )}
      {called && !selection && (
        <Popover targetRef={targetRef} position={{ x: "left", y: "bottom" }}>
          <Box
            ref={listRef}
            as="ul"
            sx={{
              mb: "2rem",
              bg: "ui_100",
              borderRadius: "0.25rem",
              borderWidth: "2px",
              borderStyle: "solid",
              borderColor: "ui_500",
              listStyle: "none",
              width: targetRef.current.offsetWidth,
            }}
          >
            {suggestions.map((place) => {
              return (
                <Box
                  onKeyDown={(e) => handleKeyDown(e, place)}
                  as="li"
                  className="suggestion"
                  key={place.place_id}
                  tabIndex="0"
                  sx={{
                    p: "2rem",
                    cursor: "pointer",
                    outline: "none",
                    "&:hover, &:focus": { bg: "blue_100" },
                  }}
                  p="2rem"
                  onClick={() => handleSelect(place)}
                >
                  {place.description}
                </Box>
              )
            })}
            {suggestions.length < 5 && (
              <Box className="manual-add" sx={{ p: "2rem" }}>
                No results found.&nbsp;
                <Box
                  tabIndex="0"
                  as="span"
                  role="button"
                  className="link"
                  sx={{ fontWeight: "black", cursor: "pointer" }}
                  onClick={() => setManualOpen(true)}
                >
                  Enter an address manually.
                </Box>
              </Box>
            )}
            <GoogleLogo />
          </Box>
        </Popover>
      )}
      {manualOpen &&
        onManualSelection(handleManualSelect, [manualOpen, setManualOpen])}
    </Box>
  )
}
