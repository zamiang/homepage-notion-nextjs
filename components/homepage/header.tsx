import Link from 'next/link';
import React from 'react';
import styles from './header.module.css';

const Header = () => (
  <div className={styles.container}>
    <div className={styles.grid}>
      <div className={styles.gridItem}>
        <Link href="/">
          <a>Brennan Moore</a>
        </Link>
      </div>
      <div className={styles.gridItem}>
        <Link href="/writing">
          <a className={styles.headerLink}>Writing</a>
        </Link>
        <Link href="/photos">
          <a className={styles.headerLink}>Updates</a>
        </Link>
      </div>
    </div>
  </div>
);

export default Header;
