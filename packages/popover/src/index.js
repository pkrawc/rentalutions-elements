/* eslint-disable no-nested-ternary */
import React, { useRef, forwardRef, useState, useEffect, useMemo } from "react"
import { createPortal } from "react-dom"
import { Box } from "@rent_avail/layout"
import {
  usePortal,
  closestScrollable,
  useResize,
  mergeRefs,
} from "@rent_avail/utils"
import { dequal } from "dequal"

export function getPosition({ popover, target, parent, position: { x, y } }) {
  const defaultValue = { top: 0, left: 0, visibility: "hidden" }
  if (!popover || !target) return defaultValue
  const yOffset = !parent ? window.pageYOffset : parent.scrollTop
  const xOffset = !parent ? window.pageXOffset : parent.scrollLeft
  /**
   * We need to check width and height differently here. The viewport should be
   * the vertical bounding box and a parent (if exists) should be the horizontal
   * bounding box.
   */
  const collisions = {
    top: target.top - popover.height < 0,
    right:
      (parent?.clientWidth || window.innerWidth) < target.left + popover.width,
    bottom: window.innerHeight < target.bottom + popover.height,
    left: target.left - popover.width < 0,
  }
  const rightCollision = collisions.right && !collisions.left
  const topCollision = collisions.bottom && !collisions.top
  const alignTop = target.top - 12 - popover.height + yOffset
  const alignBottom = target.top + 12 + target.height + yOffset
  const alignRight = target.right - popover.width + xOffset
  const alignLeft = target.left + xOffset
  const top =
    y === "top"
      ? alignTop
      : y === "bottom"
      ? alignBottom
      : topCollision
      ? alignTop
      : alignBottom
  const left =
    x === "left"
      ? alignLeft
      : x === "right"
      ? alignRight
      : rightCollision
      ? alignRight
      : alignLeft
  if (Number.isNaN(top + left)) return defaultValue
  return {
    visibility: "visible",
    top,
    left,
  }
}

function deepCompare(value) {
  const ref = useRef()
  if (!dequal(value, ref.current)) {
    ref.current = value
  }
  return ref.current
}

const Popover = forwardRef(function Popover(
  {
    targetRef,
    position = { x: "default", y: "default" },
    style,
    sx = {},
    as = "aside",
    ...rest
  },
  ref
) {
  const popoverRef = useRef(null)
  const parent = useMemo(() => closestScrollable(targetRef.current), [
    targetRef.current,
  ])
  const portalTarget = usePortal(undefined, parent)
  const popoverBounds = useResize(popoverRef, parent)
  const targetBounds = useResize(targetRef, parent)
  const [currentPosition, setPosition] = useState({
    top: 0,
    left: 0,
    visibility: "hidden",
  })
  useEffect(() => {
    const newPos = getPosition({
      popover: popoverBounds,
      target: targetBounds,
      parent,
      position,
    })
    setPosition(newPos)
  }, deepCompare([targetBounds]))
  return createPortal(
    <Box
      {...rest}
      as={as}
      ref={mergeRefs(ref, popoverRef)}
      sx={{ position: "absolute", ...sx }}
      style={{ ...style, ...currentPosition }}
    />,
    portalTarget
  )
})

export default Popover

function usePopover({
  target,
  position = "auto",
  style = {},
  as = "aside",
  ref,
}) {
  const popoverRef = useRef(null)
  const targetBounds = useBounds(target)
  const expandedPosition = useMemo(() => {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }
  }, [targetBounds, position, popoverRef])
  return {
    as,
    ref: mergeRefs(ref, popoverRef),
    style: {
      position: "absolute",
      ...style,
      ...expandedPosition,
    },
  }
}

function Usage() {
  const popoverProps = usePopover({ target, position, style })
  return <Box {...popoverProps} />
}
