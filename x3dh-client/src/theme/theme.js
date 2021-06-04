import { responsiveFontSizes, createMuiTheme } from '@material-ui/core/styles';

const iBlue = "#1A73E8";
const blue = "#46455b";
const iOrange = "#FFBA60";
const iGrey = "#424242";

export default responsiveFontSizes(createMuiTheme({
  palette: {
    common: {
      blue: `${blue}`,
      iGrey,
      iOrange,
    },
    primary: {
      main: iBlue
    },
    secondary: {
      main: "#ffffff"
    },
    success: {
      main: "#08BD80"
    }
  },
  typography: {
    fontFamily: '"Open Sans", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: "3.3rem",
      color: iGrey,
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.5rem",
      color: iGrey,
      lineHeight: 1,
    },
    h3: {
      fontWeight: 600,
      fontSize: "2.5rem",
      color: iGrey,
    },
    h4: {
      fontSize: "1.75rem",
      color: iGrey,
      fontWeight: 700,
    },
    h5: {
      fontSize: "1.55rem",
      color: iGrey,
      fontWeight: 600
    },
    subtitle1: {
      fontSize: "1.25rem",
      fontWeight: 400,
      color: iGrey,
    },
    subtitle2: {
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "#000",
    },
    body1: {
      fontSize: "1.2rem",
      color: "#fff",
      // fontWeight: 600,
      fontFamily: "'AndesNeue Alt 1'",
    },
    body2: {
      fontSize: "0.9rem",
      color: iGrey,
      fontWeight: 400,
    },
    button: {
      textTransform: "none",
      fontFamily: '"Open Sans", sans-serif',
      fontWeight: 600,
    },
  },
}));