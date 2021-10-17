import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import React from 'react';

const PREFIX = 'Footer';

const classes = {
  copyright: `${PREFIX}-copyright`,
  footer: `${PREFIX}-footer`,
  alignLeft: `${PREFIX}-alignLeft`,
  logoImage: `${PREFIX}-logoImage`,
  footerLink: `${PREFIX}-footerLink`,
  footerItem: `${PREFIX}-footerItem`,
  hideOnMobile: `${PREFIX}-hideOnMobile`,
};

const StyledContainer = styled(Container)(({ theme }) => ({
  [`& .${classes.copyright}`]: {
    marginTop: theme.spacing(4),
    color: theme.palette.text.secondary,
  },

  [`&.${classes.footer}`]: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(6),
    textAlign: 'center',
    position: 'relative',
  },

  [`& .${classes.alignLeft}`]: {
    textAlign: 'left',
  },

  [`& .${classes.logoImage}`]: {
    height: 80,
    cursor: 'pointer',
    opacity: 1,
    transition: 'opacity 0.3s',
    '&:hover': {
      opacity: 0.5,
    },
    [theme.breakpoints.down('md')]: {
      margin: '0 auto',
    },
  },

  [`& .${classes.footerLink}`]: {
    color: theme.palette.text.primary,
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    '&:hover': {
      textDecoration: 'underline',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 16,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },

  [`& .${classes.footerItem}`]: {
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(1),
      padding: '0px',
    },
  },

  [`& .${classes.hideOnMobile}`]: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
}));

const Footer = () => (
  <StyledContainer maxWidth="lg" className={classes.footer}>
    <Grid container alignItems="center" justifyContent="center">
      <Grid item className={classes.footerItem}>
        <MuiLink href="https://www.kelp.nyc/about" underline="hover">
          <Typography variant="body2" className={classes.footerLink}>
            About
          </Typography>
        </MuiLink>
      </Grid>
      <Grid item className={classes.footerItem}>
        <MuiLink
          href="https://chrome.google.com/webstore/detail/kelp-new-tab-page-for-peo/onkkkcfnlbkoialleldfbgodakajfpnl?hl=en&authuser=0"
          underline="hover"
        >
          <Typography variant="body2" className={classes.footerLink}>
            Download
          </Typography>
        </MuiLink>
      </Grid>
      <Grid item className={classes.footerItem}>
        <MuiLink href="https://www.kelp.nyc/privacy" underline="hover">
          <Typography variant="body2" className={classes.footerLink}>
            Privacy
          </Typography>
        </MuiLink>
      </Grid>
      <Grid item className={classes.footerItem}>
        <MuiLink href="https://www.kelp.nyc/terms" underline="hover">
          <Typography variant="body2" className={classes.footerLink}>
            Terms
          </Typography>
        </MuiLink>
      </Grid>
    </Grid>
    <Typography className={classes.copyright}>
      {'Copyright © '}
      <MuiLink
        color="textSecondary"
        href="https://www.zamiang.com"
        style={{ textDecoration: 'none' }}
      >
        Kelp Information Filtration, LLC
      </MuiLink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  </StyledContainer>
);

export default Footer;
