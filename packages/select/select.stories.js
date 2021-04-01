import React, { useState, useRef, Fragment } from "react"
import { Heading } from "@rent_avail/typography"
import { Container, Box } from "@rent_avail/layout"
import {
  Dialog,
  DialogTarget,
  DialogHeader,
  ConfirmationDialog,
  FullscreenDialog,
} from "@rent_avail/dialog"
import { Button } from "@rent_avail/controls"
import { Select, SelectInput, SelectList, SelectOption } from "./src"

export default { title: "Packages/Select" }

const options = [
  { name: "Alabama", value: "AL" },
  { name: "Alaska", value: "AK" },
  { name: "Arizona", value: "AZ" },
  { name: "Arkansas", value: "AR" },
  { name: "California", value: "CA" },
  { name: "Colorado", value: "CO" },
  { name: "Connecticut", value: "CT" },
  { name: "A long name that may not fit on smaller screens", value: "ZZ" },
]

function SelectExample() {
  const [state, setState] = useState("")
  return (
    <Container sx={{ mt: "4rem" }}>
      <Heading mb="2rem">{state || "Select a value"}</Heading>
      <Select id="select-id" onSelect={(value) => setState(value)}>
        <SelectInput label="Choose a state" />
        <SelectList>
          {options.map(({ name, value }) => (
            <SelectOption key={value} value={value} label={`Your ${name}`}>
              {name}
            </SelectOption>
          ))}
        </SelectList>
      </Select>
    </Container>
  )
}

export function BasicUsage() {
  return (
    <Container>
      <SelectExample />
    </Container>
  )
}

export function SimplePortalUsage() {
  const [open, set] = useState(true)
  const dialogRef = useRef()
  function handleClick() {
    set((o) => !o)
  }
  return (
    <Container>
      <Dialog open={open} toggle={handleClick} id="confirmation-id">
        <DialogTarget>
          <Button onClick={() => set(true)}>open dialog</Button>
        </DialogTarget>
        <ConfirmationDialog ref={dialogRef}>
          <DialogHeader title="Select an option" />
          <SelectExample parentRef={dialogRef} />
        </ConfirmationDialog>
      </Dialog>
    </Container>
  )
}

export function FullscreenPortalUsage() {
  const [open, set] = useState(true)
  function handleClick() {
    set((o) => !o)
  }
  return (
    <Container>
      <Dialog open={open} toggle={handleClick} id="confirmation-id">
        <DialogTarget>
          <Button onClick={() => set(true)}>open dialog</Button>
        </DialogTarget>
        <FullscreenDialog>
          <Container>
            <DialogHeader title="Select an option" />
            <SelectExample />
          </Container>
        </FullscreenDialog>
      </Dialog>
    </Container>
  )
}

export function DefaultSelected() {
  const [state, setState] = useState("")
  return (
    <Container sx={{ my: "12rem" }}>
      <Heading mb="2rem">{state || "Select a value"}</Heading>
      <Select id="select-id" onSelect={(value) => setState(value)}>
        <SelectInput label="Choose a state" />
        <SelectList>
          {options.map(({ name, value }) => (
            <SelectOption key={value} value={value} label={`Your ${name}`}>
              {name}
            </SelectOption>
          ))}
        </SelectList>
      </Select>
    </Container>
  )
}
