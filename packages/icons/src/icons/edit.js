import React, { forwardRef } from "react"
import p from "prop-types"
export const Edit = forwardRef(function Edit(props, ref) {
  const { color = "currentColor", size = 24, ...rest } = props
  return (
    <svg {...rest} ref={ref} stroke={color} width={size} height={size}>
      <path d="M20 14.66V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H9.34"></path>
      <path d="M18 2L22 6L12 16H8V12L18 2Z"></path>
    </svg>
  )
})
Edit.propTypes = {
  color: p.string,
  size: p.oneOfType([p.string, p.number]),
}
Edit.defaultProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
}
Edit.displayName = "Edit"
