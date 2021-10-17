import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import BasisGrotesqueItalicWoff2 from '../public/fonts/basis-grotesque-italic-pro.woff2';
import BasisGrotesqueMediumWoff2 from '../public/fonts/basis-grotesque-medium-pro.woff2';
import BasisGrotesqueRegularWoff2 from '../public/fonts/basis-grotesque-regular-pro.woff2';

const bodyFontFamily = "'basis-grotesque', sans-serif";
export const mediumFontFamily = "'basis-grotesque-medium', sans-serif";
export const italicFontFamily = "'basis-grotesque-italic', sans-serif";

const theme = createTheme({
	palette: {
		common: {
			black: '#000',
			white: '#fff',
		},
		background: {
			paper: '#fff',
			default: '#fff',
		},
		primary: {
			light: '#DEEBFF',
			main: '#FF4600',
			dark: '#FF4600',
			contrastText: '#fff',
		},
		secondary: {
			light: '#FAF8F5',
			main: '#47B7B8',
			dark: '#47B7B8',
			contrastText: '#fff',
		},
		error: {
			light: 'rgba(245, 98, 0, 1)',
			main: 'rgba(194, 15, 36, 1)',
			dark: '#d32f2f',
			contrastText: '#fff',
		},
		text: {
			primary: 'rgba(0, 0, 0, 0.87)',
			secondary: 'rgba(0, 0, 0, 0.70)',
			disabled: 'rgba(0, 0, 0, 0.38)',
		},
	},
	typography: {
		fontSize: 13,
		fontFamily: bodyFontFamily,
		fontWeightRegular: 400,
		h1: {
			fontWeight: 400,
			fontStyle: 'normal',
			fontSize: '60px',
			color: 'rgba(0,0,0,0.87)',
		},
		h2: {
			fontSize: 60,
			marginBottom: 32,
			width: '100%',
			textAlign: 'center',
			color: 'rgba(0,0,0,0.15)',
		},
		h3: {
			fontWeight: 400,
			fontStyle: 'normal',
			fontSize: 32,
			letterSpacing: 0.25,
			color: 'rgba(0,0,0,0.87)',
		},
		h4: {
			fontSize: 24,
			marginBottom: 12,
		},
		h5: {
			fontSize: 18,
			fontWeight: 500,
			fontFamily: mediumFontFamily,
			fontStyle: 'normal',
			marginTop: 24,
			marginBottom: 12,
		},
		h6: {
			fontSize: '0.875rem',
			// color: theme.palette.primary.dark,
			fontWeight: 400,
			textTransform: 'none',
			fontStyle: 'normal',
		},
		subtitle1: {
			fontFamily: bodyFontFamily,
		},
		subtitle2: {
			fontFamily: bodyFontFamily,
		},
		body1: {
			fontFamily: bodyFontFamily,
			fontSize: '16px',
		},
		body2: {
			fontFamily: bodyFontFamily,
		},
		caption: {
			fontFamily: bodyFontFamily,
		},
		overline: {
			fontFamily: bodyFontFamily,
		},
		button: {
			fontFamily: mediumFontFamily,
			fontWeight: 500,
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: `
      @font-face {
        font-family: "basis-grotesque";
        font-style: "normal";
        font-display: 'swap';
        font-weight: 400;
        src: url(${BasisGrotesqueRegularWoff2}) format('woff2');
      }

      @font-face {
        font-family: 'basis-grotesque-italic';
        font-style: 'italic';
        font-display: 'swap';
        font-weight: 400;
        src: url(${BasisGrotesqueItalicWoff2}) format('woff2');
      }

      @font-face {
        font-family: 'basis-grotesque-medium',
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 400;
        src: url(${BasisGrotesqueMediumWoff2}) format('woff2');
      }
      `,
		},
		MuiListItemIcon: {
			styleOverrides: {
				root: {
					minWidth: 0,
				},
			},
		},
		MuiListItem: {
			styleOverrides: {
				root: {
					paddingTop: 6,
					paddingBottom: 6,
				},
			},
		},
		MuiButton: {
			defaultProps: {
				disableRipple: true,
			},
			styleOverrides: {
				root: {
					textTransform: 'uppercase',
					fontWeight: 500,
					fontFamily: mediumFontFamily,
					paddingTop: 15,
					paddingBottom: 14,
					paddingLeft: 40,
					paddingRight: 40,
					borderRadius: 40,
					letterSpacing: '1.25px',
				},
			},
		},
		MuiAvatar: {
			styleOverrides: {
				root: {
					height: 36,
					width: 36,
					fontSize: '1rem',
					textTransform: 'uppercase',
					color: '#ffffffcf',
				},
			},
		},
		MuiAvatarGroup: {
			styleOverrides: {
				avatar: {
					borderColor: '#fff',
					color: 'rgba(0, 0, 0, 0.87)',
				},
			},
		},
	},
});

export default responsiveFontSizes(theme);
