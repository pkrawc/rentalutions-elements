import React, { useState } from "react"
import { Container, Box, Grid, Col } from "@rent_avail/layout"
import { Dialog, DialogHeader, ConfirmationDialog } from "@rent_avail/dialog"
import Input from "@rent_avail/input"
import { Button } from "@rent_avail/controls"
import {
  Autocomplete,
  AutocompleteProvider as GooglePlacesProvider,
  Unsafe_Autocomplete,
  Unsafe_AutocompleteInput,
  Unsafe_AutocompleteList,
  Unsafe_AutocompleteManualInput,
} from "./src"

export default {
  title: "Autocomplete",
  decorators: [
    (Story) => (
      <GooglePlacesProvider apiKey={process.env.PLACES_KEY}>
        <Story />
      </GooglePlacesProvider>
    ),
  ],
}

export function BasicUsage() {
  const [response, setResponse] = useState(null)
  return (
    <Container mt="4rem">
      <Autocomplete
        label="Street Address"
        onSelect={(place) => setResponse(place)}
        onClear={() => setResponse(null)}
        onManualSelection={(submit, [isOpen, setOpen]) => {
          return (
            <Dialog open={isOpen} toggle={() => setOpen((o) => !o)}>
              <ConfirmationDialog style={{ zIndex: "99999" }}>
                <DialogHeader title="Enter address manually" />
                <Grid>
                  <Col as={Input} span={[9]} label="Street Address" />
                  <Col as={Input} span={[3]} label="No." />
                  <Col as={Input} span={[8]} label="City" />
                  <Col as={Input} span={[4]} label="State" />
                  <Col as={Input} span={[6]} label="Zip Code" />
                  <Col
                    as={Input}
                    span={[6]}
                    label="Country"
                    defaultValue="United States"
                  />
                  <Col
                    as={Button}
                    sx={{ justifySelf: "end" }}
                    variant="primary"
                    onClick={(e) =>
                      submit({
                        formatted_address:
                          "1234 North Augusta Boulevard, Chicago, IL, United States",
                      })
                    }
                  >
                    submit
                  </Col>
                </Grid>
              </ConfirmationDialog>
            </Dialog>
          )
        }}
      />
      <Box mt="2rem">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. A voluptatum
        nulla cupiditate, deserunt est placeat iure similique rem dolor adipisci
        molestiae quasi ipsum quisquam? Sed veritatis iusto ipsa quidem
        mollitia?
      </Box>
      <Box as="pre" my="2rem" fontSize="1.25rem">
        <Box as="code">{JSON.stringify(response, null, 2)}</Box>
      </Box>
    </Container>
  )
}

export function DefaultValueUsage() {
  const [address, setAddress] = useState({
    formatted_address:
      "1003 North Sandburg Terrace, Chicago, IL, United States",
  })
  return (
    <Container>
      <Autocomplete
        label="Mailing Address"
        onSelect={(value) => setAddress(value)}
        defaultValue={address.formatted_address}
      />
    </Container>
  )
}

export function BetaUsage() {
  return (
    <Container>
      <Unsafe_Autocomplete id="autocomplete-uid">
        <Unsafe_AutocompleteInput label="Autocomplete Input" />
        <Unsafe_AutocompleteList />
        <Unsafe_AutocompleteManualInput>
          Hello Worlds
        </Unsafe_AutocompleteManualInput>
      </Unsafe_Autocomplete>
    </Container>
  )
}
