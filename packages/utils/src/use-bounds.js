import { useCallback, useEffect, useState, useMemo } from "react"
import ResizeObserver from "resize-observer-polyfill"

export function useResizeObserver(callback) {
  const observer = useMemo(() => new ResizeObserver(callback), [callback])
  return observer
}

export function useBounds(target, parent) {
  const [bounds, setBounds] = useState({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
  })
  const updateBounds = useCallback(() => {
    if (!target.current) return null
    const targetRect = target.current.getBoundingClientRect()
    const parentRect = parent?.getBoundingClientRect() || {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }
    setBounds({
      x: targetRect.x - parentRect.x,
      y: targetRect.y - parentRect.y,
      top: targetRect.top - parentRect.top,
      left: targetRect.left - parentRect.left,
      right: targetRect.right - parentRect.right,
      width: targetRect.width,
      height: targetRect.height,
    })
  }, [target.current, parent?.current])
  const observer = useResizeObserver(updateBounds)
  useEffect(() => {
    observer.observe(document.body)
    if (target.current) {
      observer.observe(target.current)
    }
    if (parent.current) {
      observer.observe(parent.current)
    }
    return () => {
      observer.disconnect()
    }
  }, [target.current, parent.current])
  return bounds
}
