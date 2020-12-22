import { createGlobalStyle } from "styled-components"
import css from "@styled-system/css"
import { themeGet } from "@styled-system/theme-get"

const colors = {
  ui_100: "#ffffff",
  ui_300: "#f3f3f3",
  ui_500: "#c7c7c7",
  ui_700: "#6f6f6f",
  ui_900: "#2d2d2d",

  blue_100: "#e9edf1",
  blue_300: "#7c95b0",
  blue_500: "#0f3e6f",
  blue_700: "#0b2e51",
  blue_900: "#0a2847",

  gold_100: "#fdf9e9",
  gold_300: "#fbeab3",
  gold_500: "#f9de89",
  gold_700: "#b6a264",
  gold_900: "#443d26",

  green_100: "#dff9f3",
  green_300: "#9fefdd",
  green_500: "#50e3c2",
  green_700: "#3ba68e",
  green_900: "#163e35",

  straw_100: "#fefef5",
  straw_300: "#fefce3",
  straw_500: "#fefacc",
  straw_700: "#e7e4ba",
  straw_900: "#a2a082",

  red_300: "#F6A5B4",
  red_500: "#EC4261",

  purple_300: "#B7B5EE",
  purple_500: "#6965D5",
}

export const theme = {
  breakpoints: ["40rem", "60rem", "80rem", "100rem", "120rem"],
  colors,
  fonts: {
    body: "'Nunito', -apple-system, 'Segoe UI', sans-serif",
    legal: "'Noto Serif', serif",
    monospace: "'IBM Plex Mono', monospace",
  },
  fontSizes: {
    small: "1.334rem",
    body: "1.5rem",
    subtitle: "2rem",
    title: "3rem",
    headline: "4rem",
    hero: "5rem",
  },
  fontWeights: {
    light: 200,
    regular: 400,
    bold: 600,
    black: 800,
  },
  lineHeights: {
    small: "1.5",
    body: "1.334",
    heading: "1.25",
  },
  space: [0, 12, 24, 36, 48, 60, 72, 84, 96],
  shadows: [
    "0 0.084rem 0.25rem rgba(0,0,0.12)",
    "0 0.25rem 0.5rem rgba(0,0,0,0.12)",
    "0 1rem 1rem -1rem rgba(0,0,0,0.12)",
  ],
  text: {
    body: {
      lineHeight: "body",
      fontSize: "body",
    },
    small: {
      lineHeight: "small",
      fontSize: "small",
    },
    subtitle: {
      lineHeight: "heading",
      fontSize: "subtitle",
    },
    title: {
      lineHeight: "heading",
      fontSize: "title",
    },
    headline: {
      lineHeight: "heading",
      fontSize: "headline",
    },
    hero: {
      lineHeight: "heading",
      fontSize: "hero",
    },
  },
}

export const Base = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  :root {
    font-size: ${({ theme }) => theme.space[1]}px;
  }

  html, body, div, span, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strong, sub, sup, var,
  b, u, i, dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${themeGet("fonts.body")};
    font-size:  ${themeGet("fontSizes.body")};
    font-weight: ${themeGet("fontWeights.regular")};
    line-height: ${themeGet("lineHeights.body")};
    color: ${themeGet("colors.ui_900")};
  }

  h1 {
    font-size:${themeGet("fontSizes.hero")};
    font-weight: ${themeGet("fontWeights.light")};
    line-height: ${themeGet("lineHeights.heading")};
  }
  h2 {
    font-size:${themeGet("fontSizes.headline")};
    font-weight: ${themeGet("fontWeights.regular")};
    line-height: ${themeGet("lineHeights.heading")};
  }
  h3 {
    font-size:${themeGet("fontSizes.title")};
    font-weight: ${themeGet("fontWeights.regular")};
    line-height: ${themeGet("lineHeights.heading")};
  }
  h4 {
    font-size:${themeGet("fontSizes.subtitle")};
    font-weight: ${themeGet("fontWeights.regular")};
    line-height: ${themeGet("lineHeights.heading")};
  }
  h5 {
    font-size:${themeGet("fontSizes.body")};
    font-weight: ${themeGet("fontWeights.black")};
    line-height: ${themeGet("lineHeights.heading")};
  }

  pre, code {
    font-family: ${themeGet("fonts.monospace")};
  }

  a {
    text-decoration:none;
    color: inherit;
  }

  .link {
    box-shadow: inset 0 -6px 0 ${themeGet("colors.green_500")};
    font-weight: ${themeGet("fontWeights.black")};
    transition: box-shadow 250ms;
    &:hover {
      box-shadow: inset 0 -12px 0 ${themeGet("colors.green_500")};
    }
  }

  .no-sizing h1 {
    font-size: 4rem;
  }

  .no-sizing h2 {
    font-size: 3rem;
  }
  
  .no-sizing  h3 {
    font-size: 2rem;
  }
`

export const sx = ({ sx = {} }) => {
  const { text, ...styleProps } = sx
  if (text) {
    return css({
      variant: [...text].map((txt) => `text.${txt}`),
      ...styleProps,
    })
  }
  return css(styleProps)
}
