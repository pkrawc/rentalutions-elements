import React from "react"
import { render, screen, userEvent } from "testing-utils"
import Input from "../src"

describe("<Input />", () => {
  it("Should render without crashing", () => {
    render(<Input label="Phone Number" labelId="phone_number_specific" />)
    const input = screen.getByLabelText(/Phone Number/)
    expect(input).toBeInTheDocument()
  })
  it("Should store it's value internally", async () => {
    render(<Input label="Name" labelId="user_name" />)
    const input = screen.getByLabelText(/Name/)
    userEvent.type(input, "Chuck")
    expect(input).toHaveValue("Chuck")
    userEvent.type(input, " Norris")
    expect(input).toHaveValue("Chuck Norris")
  })
  it("Should mount filled when type is date", () => {
    const { container } = render(
      <Input type="date" label="Birth Date" labelId="user_birth_day" />
    )
    const input = screen.getByLabelText(/Birth Date/)
    const wrapper = container.querySelector("label")
    expect(input).toHaveAttribute("type", "date")
    expect(wrapper).toHaveClass("filled")
  })
  it("Should display an error when present.", () => {
    const { rerender } = render(
      <Input
        label="First Name"
        labelId="first_name"
        error="Must enter a name."
      />
    )
    expect(screen.queryByText(/Must enter a name./)).toBeInTheDocument()

    rerender(<Input label="First Name" labelId="first_name" error={null} />)

    expect(screen.queryByText(/Must enter a name./)).not.toBeInTheDocument()
  })

  it("Shouldn't allow value changes when disabled", async () => {
    render(<Input disabled label="Favorite Color" />)
    const input = screen.getByLabelText(/Favorite Color/)
    userEvent.type(input, "Hello World")
    expect(input).toHaveValue("")
  })
})
