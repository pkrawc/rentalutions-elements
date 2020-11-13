import React, { useContext, forwardRef } from "react"
import { Box } from "@rent_avail/layout"
import { AutocompleteContext } from "./wrapper"
import { mergeRefs, useResize } from "@rent_avail/utils"
import Popover from "@rent_avail/popover"
import { GoogleLogo } from "./google-logo"

function useAutocompleteList(props) {
  const {
    called,
    selection,
    suggestions,
    manual,
    listRef,
    inputRef,
    getDetails,
    setManual,
  } = useContext(AutocompleteContext)
  const { width } = useResize(inputRef)
  function handleSelect(place) {
    getDetails({ id: place.place_id, onSelect })
  }
  function handleKeyDown(ev) {}
  return {
    called,
    selection,
    manual,
    suggestions,
    ref: mergeRefs(props.ref, listRef),
    handleSelect,
    handleKeyDown,
    inputRef,
    width,
    setManual,
    ...props,
  }
}

export const Unsafe_AutocompleteList = forwardRef(
  function Unsafe_AutocompleteList(props, ref) {
    const {
      called,
      selection,
      manual,
      suggestions,
      handleSelect,
      inputRef,
      width,
      setManual,
      ...htmlProps
    } = useAutocompleteList({
      ...props,
      ref,
    })
    const isOpen = called && !selection && !manual
    return (
      isOpen && (
        <Popover
          {...htmlProps}
          as="ul"
          targetRef={inputRef}
          position={{ x: "left", y: "bottom" }}
          sx={{
            mb: "2rem",
            bg: "ui_100",
            borderRadius: "0.25rem",
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: "ui_500",
            listStyle: "none",
            width: width,
          }}
        >
          {suggestions.map((place) => (
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
          ))}
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
        </Popover>
      )
    )
  }
)
