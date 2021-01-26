import { useRef, useEffect, useState, useReducer, useCallback } from "react"
import ResizeObserver from "resize-observer-polyfill"
import "intersection-observer"
import CalendarDates from "calendar-dates"

function assignRef(ref, value) {
  if (ref === null) return
  if (typeof ref === "function") {
    ref(value)
    return
  }
  try {
    ref.current = value
  } catch (error) {
    throw new Error(`Cannot assign ${value} to ${ref}`)
  }
}

export function mergeRefs(...refs) {
  return (value) => refs.forEach((ref) => assignRef(ref, value))
}

export function useResize(target, parent) {
  const [bounds, setBounds] = useState({})
  const resize = useCallback(() => {
    if (!target.current) return null
    const targetBounds = target.current.getBoundingClientRect()
    const parentBounds = parent?.getBoundingClientRect() || {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      x: 0,
      y: 0,
    }
    setBounds({
      x: targetBounds.x - parentBounds.x,
      y: targetBounds.y - parentBounds.y,
      top: targetBounds.top - parentBounds.top,
      left: targetBounds.left - parentBounds.left,
      right: targetBounds.x - parentBounds.x + target.current.offsetWidth,
      bottom: targetBounds.y - parentBounds.y + target.current.offsetHeight,
      width: target.current.offsetWidth,
      height: target.current.offsetHeight,
    })
  }, [target.current])
  const [observer] = useState(() => new ResizeObserver(resize))
  useEffect(() => {
    observer.observe(document.body)
    if (target.current) {
      observer.observe(target.current)
    }
    return () => {
      observer.disconnect()
    }
  }, [target.ref])
  return bounds
}

export function useIntersection({
  root = null,
  rootMargin,
  threshold = 0,
} = {}) {
  const [result, setResult] = useState({})
  const target = useRef()
  const observer = useRef(null)
  useEffect(() => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(([entry]) => setResult(entry), {
      root,
      rootMargin,
      threshold,
    })
    if (target.current) observer.current.observe(target.current)
    return () => {
      if (observer.current) observer.current.disconnect()
    }
  }, [target])
  return [target, result]
}

export function useHadIntersected({
  threshold = 0.75,
} = {}) {

const target = useRef()
const [ observer, setObserver ] = useState()
const [ hadIntersected, setHadIntersected ] = useState(false)

useEffect(()=>{
  observer?.disconnect()
  if (!hadIntersected) {
    const newObserver = new IntersectionObserver(([entry]) => {
      const { isIntersecting } = entry
      if (!hadIntersected && isIntersecting) {
        setHadIntersected(true)
        observer?.disconnect()
      }
    }, { threshold })
  
    setObserver(newObserver)
    return () => newObserver.disconnect()
  }
}, [])

useEffect(() => {
  if (!hadIntersected) {
    if (target.current && observer) {
      observer.observe(target.current)
    }
  } else {
    observer?.disconnect()
  }
}, [ target, observer ])

return [ hadIntersected, target ]
}

export function usePortal(type = "avail-portal", parent) {
  if (typeof window === "undefined") return null // bail on server render.
  const rootElement = useRef()
  if (!rootElement.current) {
    rootElement.current = document.createElement(type)
  }
  useEffect(() => {
    const mountRoot = parent || document.body
    mountRoot.appendChild(rootElement.current)
    return () => {
      if (mountRoot.contains(rootElement.current)) {
        mountRoot.removeChild(rootElement.current)
      }
    }
  }, [rootElement.current, parent])
  return rootElement.current
}

const GET_DATES = "avail/actions/GET_DATES"
const UPDATE_DATES = "avail/actions/UPDATE_DATES"

const dateReducer = (state, action) => {
  switch (action.type) {
    case GET_DATES: {
      const { payload } = action
      return {
        ...state,
        dates: payload,
      }
    }
    case UPDATE_DATES: {
      const { payload } = action
      return {
        ...state,
        ...payload,
      }
    }
    default:
      throw Error("DATE REDUCER: Dispatch a known action.")
  }
}

const scriptCache = []

export function useScript(src) {
  const [state, setState] = useState({
    loaded: false,
    error: false,
  })
  useEffect(() => {
    function scriptLoaded() {
      setState({
        loaded: true,
        error: false,
      })
    }
    function scriptErrored({ target }) {
      const index = scriptCache.indexOf(target.src)
      if (index >= 0) scriptCache.splice(index, 1)
      target.remove()
      setState({
        loaded: true,
        error: true,
      })
    }
    if (scriptCache.includes(src)) {
      scriptLoaded()
    } else {
      scriptCache.push(src)
      const script = document.createElement("script")
      script.src = src
      script.async = true
      script.addEventListener("load", scriptLoaded)
      script.addEventListener("error", scriptErrored)
      document.body.appendChild(script)
      return () => {
        script.removeEventListener("load", scriptLoaded)
        script.removeEventListener("error", scriptErrored)
      }
    }
  }, [src])
  return state
}

export function useDates(startDate = new Date()) {
  const calendarDates = useRef(new CalendarDates())
  const [state, dispatch] = useReducer(dateReducer, {
    dates: null,
    month: startDate.getMonth(),
    monthName: startDate.toLocaleString(navigator.language, { month: "long" }),
    year: startDate.getFullYear(),
  })

  async function getDates() {
    const dates = await calendarDates.current.getMatrix(startDate)
    dispatch({
      type: GET_DATES,
      payload: dates,
    })
  }

  async function getNextMonth() {
    const month = (state.month + 1) % 12
    const year = (state.month + 1) % 12 === 0 ? state.year + 1 : state.year
    const newDate = new Date(year, month)
    const dates = await calendarDates.current.getMatrix(newDate)
    dispatch({
      type: UPDATE_DATES,
      payload: {
        dates,
        month: newDate.getMonth(),
        monthName: newDate.toLocaleString(navigator.language, {
          month: "long",
        }),
        year: newDate.getFullYear(),
      },
    })
  }

  async function getPrevMonth() {
    const month = state.month - 1 < 0 ? 12 : state.month - 1
    const year = state.month - 1 < 0 ? state.year - 1 : state.year
    const newDate = new Date(year, month)
    const dates = await calendarDates.current.getMatrix(newDate)
    dispatch({
      type: UPDATE_DATES,
      payload: {
        dates,
        month: newDate.getMonth(),
        monthName: newDate.toLocaleString(navigator.language, {
          month: "long",
        }),
        year: newDate.getFullYear(),
      },
    })
  }

  useEffect(() => {
    let mounted = true
    if (mounted) getDates(state.year, state.month)
    return () => {
      mounted = false
    }
  }, [])
  return {
    state,
    getNextMonth,
    getPrevMonth,
  }
}

export function useBodyScrollLock() {
  if (typeof window === "undefined") return [] // bail on server render.
  const scrollElement = document.scrollingElement || document.documentElement
  const scrollLocked = useRef(false)
  const originalScrollTop = useRef(0)
  const originalStyles = useRef("")

  const lock = () => {
    if (scrollLocked.current) return
    const scrollBarAdjustment =
      window.innerWidth -
      scrollElement.clientWidth +
      (parseInt(
        window
          .getComputedStyle(document.body)
          .getPropertyValue("padding-right"),
        10
      ) || 0)
    originalScrollTop.current = window.scrollY
    originalStyles.current = document.body.style.cssText
    document.body.style.cssText = `
      ${originalStyles.current}
      position: fixed;
      width: 100%;
      top: -${originalScrollTop.current}px;
      padding-right: ${scrollBarAdjustment}px;
    `
    scrollElement.style.scrollBehavior = "auto"
    scrollLocked.current = true
  }

  const unlock = () => {
    if (!scrollLocked.current) return
    document.body.style.cssText = originalStyles.current
    if (originalScrollTop.current) window.scrollTo(0, originalScrollTop.current)
    scrollElement.style.scrollBehavior = ""
    scrollLocked.current = false
  }

  return [lock, unlock]
}

export function throttle(fn, ms) {
  let timeout
  function exec() {
    fn.apply()
  }
  function clear() {
    return timeout === "undefined" ? null : clearTimeout(timeout)
  }
  if (fn !== undefined && ms !== undefined) {
    timeout = setTimeout(exec, ms)
  } else {
    console.error("callback function and the timeout must be supplied")
  }
  // API to clear the timeout
  throttle.clearTimeout = clear()
}

export function wrapEvent(original, additional) {
  return (event) => {
    if (original) original(event)
    if (!event.defaultPrevented) return additional(event)
  }
}

export function isScrollable(node) {
  const regex = /(auto|scroll)/
  const style = getComputedStyle(node, null)
  return regex.test(style.overflow + style.overflowY)
}

export function closestScrollable(element) {
  let parent = element
  while (parent?.parentElement) {
    parent = parent.parentElement
    if (isScrollable(parent)) return parent
  }
  return typeof document === "undefined" ? null : document.body
}

export function noop() {}

export function useId(id) {
  const initialId = id ? id.replace(/ /g, "_").toLowerCase() : null
  const idRef = useRef(
    initialId || `_${Math.random().toString(36).substr(2, 9)}`
  )
  return idRef.current
}

export function getId() {
  return `_${Math.random().toString(36).substr(2, 9)}`
}

export function useAnimation({
  delay = 0.5,
  duration = 1.0,
} = {}) {
  const [ final, setFinal ] = useState(false)
  function animate() {
    setFinal(true)
  }

  const baseAnimationProps = {
    initial: "initial",
    animate: final ? "final" : "initial",
    transition: {
      delay,
      duration,
    },
  }

  const animationEffects = {
    fadeIn: {
      ...baseAnimationProps,
      variants: {
        initial: { opacity: 0, y: "1rem" },
        final: { opacity: 1, y: "0rem" },
      },
    },
    fadeOut: {
      ...baseAnimationProps,
      variants: {
        initial: { opacity: 1, y: "0rem" },
        final: { opacity: 0, y: "-1rem" },
      },
    },
    scaleIn: {
      ...baseAnimationProps,
      variants: {
        initial: { opacity: 0, scale: 0 },
        final: { opacity: 1, scale: 1 },
      },
    },
  }

  return [ animationEffects, animate ]
}

export function useAnimateIntersection({
    threshold,
    delay,
    duration,
} = {}) {
  const [ hadIntersected, target ] = useHadIntersected({ threshold })
  const [ animationVariants, animate ] = useAnimation({
    delay,
    duration,
  })

  useEffect(() => {
    if (hadIntersected) {
      animate()
    }
  }, [ hadIntersected ])

  return [ animationVariants, target ]
}
