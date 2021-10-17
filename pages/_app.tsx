import { CacheProvider, ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import ThemeProvider from '@mui/styles/ThemeProvider';
import React, { useEffect } from 'react';
import createEmotionCache from '../components/styles/create-emotion-cache';
import homepageTheme from '../constants/homepage-theme';

const clientSideEmotionCache = createEmotionCache();

const App = (props: any) => {
	useEffect(() => {
		const jssStyles = document.querySelector('#jss-server-side');
		if (jssStyles && jssStyles.parentNode) jssStyles.parentNode.removeChild(jssStyles);
	}, []);

	const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
	return (
		<CacheProvider value={emotionCache}>
			<EmotionThemeProvider theme={homepageTheme}>
				<ThemeProvider theme={homepageTheme}>
					<CssBaseline />
					<Component {...pageProps} />
				</ThemeProvider>
			</EmotionThemeProvider>
		</CacheProvider>
	);
};

export default App;
