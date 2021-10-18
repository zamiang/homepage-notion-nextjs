import Link from 'next/link';
import React from 'react';
import styles from './footer.module.css';

const Footer = () => (
  <React.Fragment>
    <div className={styles.grid}>
      <div className={styles.gridItem}>
        <Link href="/writing">
          <a className={styles.footerLink}>Writing</a>
        </Link>
      </div>
      <div className={styles.gridItem}>
        <Link href="/photos">
          <a className={styles.footerLink}>Photos</a>
        </Link>
      </div>
    </div>
    <div className={styles.copyright}>
      {'Copyright © '}
      <Link href="/">
        <a className={styles.footerLink}>Brennan Moore</a>
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </div>
  </React.Fragment>
);

export default Footer;
