import styles from "./footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>Kenz</div>
      <div className={styles.text}>
        KenzTeam © All rights reserved 2025.
      </div>
    </div>
  );
};

export default Footer;
