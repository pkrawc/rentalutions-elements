import React, { useState } from "react"
import { Calendar, Search } from "react-feather"
import { Container, Grid, Col, Stack } from "@rent_avail/layout"
import { Button } from "@rent_avail/controls"
import {
  Dialog,
  DialogHeader,
  DialogTarget,
  ConfirmationDialog,
} from "@rent_avail/dialog"
import {
  Select,
  SelectInput,
  SelectList,
  SelectOption,
} from "@rent_avail/select"
import Input from "./src"

export default { title: "Packages/Input" }

export function BasicUsage() {
  return (
    <Container sx={{ my: "4rem" }}>
      <Stack wrapChildren spacing="1rem">
        <Input label="Required Field" required />
        <Input label="Optional Field" />
        <Input label="Disabled Field" disabled />
        <Input label="Disabled Field" disabled value="I'm disabled" />
        <Input label="Default Field" value="Default Value" />
        <Input label="Icon Field" icon={Search} />
        <Input label="Error Field" error="Some Error" />
        <Input label="Date Field" type="date" />
        <Input label="Textarea Field" as="textarea" />
      </Stack>
    </Container>
  )
}

export function DateUsage() {
  const [error, setError] = useState(true)
  return (
    <Container sx={{ mt: "4rem" }}>
      <Input
        type="date"
        label="Move In Date"
        error={error && "Must include a move in date."}
        onChange={(e) => {
          if (e.target.value) setError(false)
          else setError(true)
        }}
      />
    </Container>
  )
}

export function DialogUsage() {
  const [open, setOpen] = useState(true)
  const options = [
    { label: "Alabama", value: "AL" },
    { label: "Alaska", value: "AK" },
    { label: "Arizona", value: "AZ" },
    { label: "Arkansas", value: "AR" },
    { label: "California", value: "CA" },
    { label: "Colorado", value: "CO" },
    { label: "Connecticut", value: "CT" },
  ]
  const { 1: setSelection } = useState("")
  return (
    <Container sx={{ mt: "4rem" }}>
      <Dialog open={open} toggle={() => setOpen((state) => !state)}>
        <DialogTarget>
          <Button mb="4rem" onClick={() => setOpen(true)}>
            Click Me
          </Button>
        </DialogTarget>
        <ConfirmationDialog>
          <DialogHeader title="Hello World" />
          <Grid>
            <Col as={Input} label="Full Name" />
            <Col as={Input} label="Full Name" />
            <Col as={Input} label="Full Name" />
            <Col>
              <Select id="select-id" onSelect={(value) => setSelection(value)}>
                <SelectInput label="Choose a state" />
                <SelectList>
                  {options.map(({ label, value }) => (
                    <SelectOption key={value} value={value} label={label}>
                      {label}
                    </SelectOption>
                  ))}
                </SelectList>
              </Select>
            </Col>
            <Col as={Input} label="Full Name" />
            <Col as={Input} label="Full Name" />
          </Grid>
        </ConfirmationDialog>
      </Dialog>
      <Grid>
        <Col as="p">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam atque
          saepe impedit, quia recusandae eaque dignissimos nam cumque debitis ex
          reiciendis! Voluptatum architecto reiciendis ipsa ducimus sequi
          consequuntur ipsum sint!
        </Col>
        <Col as="p">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Commodi
          perferendis fuga officia quaerat, ullam possimus, accusantium tempore
          dolorem sunt a impedit odio sed rem placeat, assumenda deleniti
          beatae! Inventore, blanditiis?
        </Col>
        <Col as="p">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus vero
          ut unde similique mollitia dolore quisquam veniam aliquam illo
          cupiditate. Perspiciatis modi nam iste recusandae labore aut. Optio,
          dolorum ex!
        </Col>
        <Col as="p">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magni ab
          molestias nemo dolore quibusdam libero porro architecto, similique
          consequuntur, vitae officia, dignissimos sit ratione unde delectus ut
          rem vero ipsam.
        </Col>
        <Col as="p">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus nam
          blanditiis ad perferendis adipisci corporis rerum consequuntur qui
          sit! Modi facere reprehenderit recusandae facilis culpa cupiditate
          velit nihil qui dignissimos!
        </Col>
        <Col as="p">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quia laborum
          necessitatibus illo fugit iste provident, architecto ex sunt earum eum
          ut pariatur consequatur quos, ratione rem, amet omnis non aliquam?
        </Col>
        <Col>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique
          iusto dicta alias dolor enim animi laboriosam illum inventore,
          eligendi numquam, asperiores voluptatibus quos magnam ut sed ratione,
          blanditiis laborum pariatur?
        </Col>
      </Grid>
    </Container>
  )
}
