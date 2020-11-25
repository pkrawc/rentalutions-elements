import React from "react"
import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ThemeProvider } from "styled-components"
import { Base, theme } from "@rent_avail/base"
import "@testing-library/jest-dom/extend-expect"
import "regenerator-runtime"

// Create custom wrapper to add theme and base to tests.
function Wrapper({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <Base />
      {children}
    </ThemeProvider>
  )
}

const customRender = (ui, options) =>
  render(ui, { wrapper: Wrapper, ...options })

// re-export everything
export * from "@testing-library/react"

// override render method
export { customRender as render, userEvent }
