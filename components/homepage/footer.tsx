import Link from 'next/link';
import React from 'react';
import styles from './footer.module.css';

const Footer = () => (
  <React.Fragment>
    <div className={styles.grid}>
      <div className={styles.gridItem}>
        <Link href="/writing">
          <div className={styles.footerLink}>Writing</div>
        </Link>
      </div>
      <div className={styles.gridItem}>
        <Link href="/photos">
          <div className={styles.footerLink}>Photos</div>
        </Link>
      </div>
    </div>
    <div className={styles.copyright}>
      {'Copyright © '}
      <Link href="/">
        <a>Brennan Moore</a>
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </div>
  </React.Fragment>
);

export default Footer;
