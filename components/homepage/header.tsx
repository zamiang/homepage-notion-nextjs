import Link from 'next/link';
import React from 'react';
import Headroom from 'react-headroom';
import styles from './header.module.css';

const Header = () => (
  <Headroom>
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.gridItem}>
          <Link href="/">
            <a className={styles.headerLink}>Brennan Moore</a>
          </Link>
        </div>
        <div className={styles.gridItem}>
          <Link href="/writing">
            <a className={styles.headerLink}>Writing</a>
          </Link>
          <Link href="/photos">
            <a className={styles.headerLink}>Photos</a>
          </Link>
        </div>
      </div>
    </div>
  </Headroom>
);

export default Header;
