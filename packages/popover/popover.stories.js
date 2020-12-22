import React, { useRef } from "react"
import Popover from "./src"
import { Container, Box } from "@rent_avail/layout"
import { createGlobalStyle } from "styled-components"

export default { title: "Popover" }

const Global = createGlobalStyle`
  html, body {
    height: 100%;
  }
`

export function DefaultUsage() {
  const targetRef = useRef(null)
  return (
    <Container sx={{ mt: "6rem" }}>
      <Global />
      <Box ref={targetRef}>Hello Target</Box>
      <Popover targetRef={targetRef}>
        <Box>Popover Target</Box>
      </Popover>
    </Container>
  )
}
