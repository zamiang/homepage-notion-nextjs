import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import Head from 'next/head';
import React from 'react';
import Footer from '../components/homepage/footer';
import { italicFontFamily, mediumFontFamily } from '../constants/homepage-theme';

const PREFIX = 'App';

export const classes = {
	container: `${PREFIX}-container`,
	installButtonContainer: `${PREFIX}-installButtonContainer`,
	colorContainer: `${PREFIX}-colorContainer`,
	footerContainer: `${PREFIX}-footerContainer`,
	logoImage: `${PREFIX}-logoImage`,
	logo: `${PREFIX}-logo`,
	heading: `${PREFIX}-heading`,
	subheading: `${PREFIX}-subheading`,
	loginMargin: `${PREFIX}-loginMargin`,
	loginPaper: `${PREFIX}-loginPaper`,
	hero: `${PREFIX}-hero`,
	subpage: `${PREFIX}-subpage`,
	buttonContainer: `${PREFIX}-buttonContainer`,
	login: `${PREFIX}-login`,
	body: `${PREFIX}-body`,
	section: `${PREFIX}-section`,
	hint: `${PREFIX}-hint`,
	link: `${PREFIX}-link`,
	meetingContainer: `${PREFIX}-meetingContainer`,
	meetingImage: `${PREFIX}-meetingImage`,
	bodyCopySection: `${PREFIX}-bodyCopySection`,
	italics: `${PREFIX}-italics`,
	loginButtonContainer: `${PREFIX}-loginButtonContainer`,
	emojiIcon: `${PREFIX}-emojiIcon`,
	list: `${PREFIX}-list`,
	quote: `${PREFIX}-quote`,
	largeText: `${PREFIX}-largeText`,
};

export const Root = styled('div')(({ theme }) => ({
	[`&.${classes.container}`]: {
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
	},
	[`& .${classes.installButtonContainer}`]: {
		paddingBottom: theme.spacing(4),
		[theme.breakpoints.down('md')]: {
			paddingTop: theme.spacing(4),
		},
	},
	[`& .${classes.colorContainer}`]: {
		width: '100%',
		backgroundColor: theme.palette.secondary.light,
	},
	[`& .${classes.footerContainer}`]: {
		marginTop: theme.spacing(6),
		marginBottom: theme.spacing(10),
		textAlign: 'center',
	},
	[`& .${classes.logoImage}`]: {
		height: 64,
		opacity: 1,
		cursor: 'pointer',
		transition: 'opacity 0.3s',
		'&:hover': {
			opacity: 0.5,
		},
	},
	[`& .${classes.logo}`]: {
		cursor: 'pointer',
		fontSize: 42,
		margin: 0,
		marginTop: theme.spacing(4),
		color: theme.palette.text.primary,
		[theme.breakpoints.down('lg')]: {
			fontSize: 42,
		},
	},
	[`& .${classes.heading}`]: {
		fontSize: 32,
		marginTop: theme.spacing(4),
		[theme.breakpoints.down('md')]: {
			fontSize: 32,
		},
	},
	[`& .${classes.subheading}`]: {
		marginTop: 32,
		fontSize: 24,
		marginBottom: theme.spacing(3),
		[theme.breakpoints.down('md')]: {
			fontSize: 16,
			marginTop: theme.spacing(4),
			marginBottom: theme.spacing(1),
		},
	},
	[`& .${classes.loginMargin}`]: {
		margin: theme.spacing(1),
	},
	[`& .${classes.loginPaper}`]: {
		padding: theme.spacing(2),
	},
	[`& .${classes.hero}`]: {
		marginTop: theme.spacing(15),
		marginBottom: theme.spacing(6),
		width: '100%',
		textAlign: 'center',
		[theme.breakpoints.down('md')]: {
			marginTop: theme.spacing(6),
			marginBottom: theme.spacing(10),
		},
	},
	[`& .${classes.subpage}`]: {
		marginTop: theme.spacing(8),
		marginBottom: theme.spacing(12),
		width: '100%',
	},
	[`& .${classes.buttonContainer}`]: {
		marginTop: 48,
		[theme.breakpoints.down('md')]: {
			marginLeft: 'auto',
			marginRight: 'auto',
			maxWidth: 'none',
		},
	},
	[`& .${classes.login}`]: {
		margin: 0,
		width: 260,
		padding: theme.spacing(2),
		cursor: 'pointer',
		opacity: 1,
		transition: 'opacity 0.3s',
		fontFamily: mediumFontFamily,
		fontWeight: 500,
		'&:hover': {
			opacity: 0.6,
		},
		[theme.breakpoints.down('md')]: {
			width: '100%',
		},
	},

	[`& .${classes.body}`]: {
		marginTop: theme.spacing(2),
	},

	[`& .${classes.section}`]: {
		marginTop: theme.spacing(4),
		marginBottom: theme.spacing(4),
	},

	[`& .${classes.hint}`]: {
		marginTop: theme.spacing(2),
		fontStyle: 'italic',
	},

	[`& .${classes.link}`]: {
		color: theme.palette.primary.dark,
	},
	[`& .${classes.meetingContainer}`]: {
		width: '100%',
		textAlign: 'center',
		borderRadius: 30,
		marginLeft: 'auto',
		marginRight: 'auto',
		maxHeight: 629,
		overflow: 'hidden',
		marginBottom: theme.spacing(4),
		[theme.breakpoints.down('md')]: {
			borderRadius: 15,
			marginTop: theme.spacing(2),
			marginBottom: theme.spacing(8),
		},
	},
	[`& .${classes.meetingImage}`]: {
		display: 'block',
		margin: '0px auto',
		width: '100%',
	},
	[`& .${classes.bodyCopySection}`]: {
		paddingTop: theme.spacing(10),
		paddingBottom: theme.spacing(10),
		[theme.breakpoints.down('md')]: {
			paddingTop: theme.spacing(4),
			paddingBottom: theme.spacing(4),
			maxWidth: 'none',
		},
	},
	[`& .${classes.italics}`]: {
		fontFamily: italicFontFamily,
		fontStyle: 'italics',
	},
	[`& .${classes.loginButtonContainer}`]: {
		[theme.breakpoints.down('md')]: {
			textAlign: 'center',
			margin: '0px auto',
		},
	},
	[`& .${classes.emojiIcon}`]: {
		fontSize: 26,
		marginRight: theme.spacing(2),
	},
	[`& .${classes.list}`]: {
		[theme.breakpoints.down('md')]: {
			textAlign: 'center',
			margin: '0px auto',
			maxWidth: 367,
		},
	},
	[`& .${classes.quote}`]: {
		[theme.breakpoints.down('md')]: {
			fontSize: 24,
		},
	},
	[`& .${classes.largeText}`]: {
		[theme.breakpoints.down('md')]: {
			fontSize: 32,
		},
	},
}));

// <meta name="slack-app-id" content="A01E5A9263B" />
const description = 'A newtab page that gets you what you need when you need it.';

const App = () => (
	<Root className={classes.container}>
		<Head>
			<title>Kelp - a magical website organizer for busy people</title>
			<meta name="description" content={description} />
			{/* Twitter */}
			<meta name="twitter:card" content="summary" key="twcard" />
			<meta name="twitter:creator" content="kelpnyc" key="twhandle" />

			{/* Open Graph */}
			<meta property="og:url" content="https://www.kelp.nyc" key="ogurl" />
			<meta property="og:image" content="https://www.kelp.nyc/images/overview.jpg" key="ogimage" />
			<meta property="og:site_name" content="Kelp" key="ogsitename" />
			<meta
				property="og:title"
				content="Kelp - A magical website organizer for busy people"
				key="ogtitle"
			/>
			<meta property="og:description" content={description} key="ogdesc" />
		</Head>
		<style jsx global>{`
			html body {
				background-color: #faf5eb;
			}
		`}</style>
		<div className={classes.hero}>
			<Container maxWidth="md">
				<img className={classes.logoImage} src="/kelp.svg" alt="Kelp logo" />
				<Typography variant="h1" className={classes.heading}>
					Kelp is a magical website organizer for busy people
				</Typography>
				<Typography className={classes.subheading}>
					Install Kelp to leave tags and folders behind, and switch to an organization system that
					adapts to the real world.
				</Typography>
			</Container>
			<Container className={classes.buttonContainer}>
				<Button
					variant="contained"
					size="large"
					color="primary"
					className={classes.login}
					startIcon={<img src="/icons/install-white.svg" width="24" height="24" />}
					onClick={() => (window.location.pathname = '/install')}
					disableElevation={true}
				>
					Install Kelp
				</Button>
			</Container>
		</div>
		<Container maxWidth="lg">
			<div className={classes.meetingContainer}>
				<img src="images/meetings-large.svg" className={classes.meetingImage} />
			</div>
		</Container>
		<Container maxWidth="md" className={classes.bodyCopySection}>
			<Typography variant="h2" className={classes.largeText}>
				Your data is your data
			</Typography>
			<Container maxWidth="sm">
				<Typography>
					Kelp does not store your passwords or personal data. We take security seriously and apply
					experience from e-commerce, and healthcare data security. Kelp’s security practices
					include but are not limited to: static code analysis, static dependency checking, web
					vulnerability scanning, end-to-end encryption, and a bug bounty program.
				</Typography>
				<br />
				<List disablePadding className={classes.list}>
					<ListItem disableGutters>
						<div className={classes.emojiIcon}>💻</div>
						<ListItemText>
							Kelp is a chrome extension that runs entirely on your computer
						</ListItemText>
					</ListItem>
					<ListItem disableGutters>
						<div className={classes.emojiIcon}>🛑 </div>
						<ListItemText>Kelp does not send your data to third parties</ListItemText>
					</ListItem>
					<ListItem disableGutters>
						<div className={classes.emojiIcon}>🔐</div>
						<ListItemText>Kelp does not record your email or Google Profile</ListItemText>
					</ListItem>
					<ListItem disableGutters>
						<div className={classes.emojiIcon}>🛤</div>
						<ListItemText>Kelp does not include analytics or tracking tools</ListItemText>
					</ListItem>
				</List>
			</Container>
		</Container>
		<br />
		<Container maxWidth="md">
			<Grid container alignItems="center" justifyContent="center">
				<Grid
					sm={12}
					md={6}
					item
					className={clsx(classes.bodyCopySection, classes.loginButtonContainer)}
				>
					<Typography variant="h4" className={classes.quote}>
						Ready to get started?
					</Typography>
					<div className={classes.buttonContainer}>
						<Button
							variant="contained"
							size="large"
							color="primary"
							className={classes.login}
							startIcon={<img src="/icons/install-white.svg" width="24" height="24" />}
							onClick={() => (window.location.pathname = '/install')}
							disableElevation={true}
						>
							Install Kelp
						</Button>
					</div>
				</Grid>
				<Grid sm={12} md={6} item>
					<List disablePadding className={classes.list}>
						<ListItem disableGutters>
							<div className={classes.emojiIcon}>🎨</div>
							<ListItemText>Designed for people with too many meetings</ListItemText>
						</ListItem>
						<ListItem disableGutters>
							<div className={classes.emojiIcon}>🗝</div>
							<ListItemText>Secure - Kelp does not store your data</ListItemText>
						</ListItem>
						<ListItem disableGutters>
							<div className={classes.emojiIcon}>🪞</div>
							<ListItemText>Active & transparent development</ListItemText>
						</ListItem>
						<ListItem disableGutters>
							<div className={classes.emojiIcon}>🦄</div>
							<ListItemText>Independently bootstrapped</ListItemText>
						</ListItem>
						<ListItem disableGutters>
							<div className={classes.emojiIcon}>🏎</div>
							<ListItemText>Fast and easy to use</ListItemText>
						</ListItem>
					</List>
				</Grid>
			</Grid>
		</Container>
		<br />
		<br />
		<Divider />
		<Footer />
	</Root>
);

export default App;
