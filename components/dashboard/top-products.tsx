import { products } from "@/data/dashboard";
import styles from "./dashboard.module.css";

export function TopProducts() {
  return (
    <section className={`${styles.card} ${styles.products}`} aria-labelledby="products-heading">
      <h2 id="products-heading">Top Products</h2>
      <div className={styles.tableScroll}>
        <table>
          <thead><tr><th scope="col">#</th><th scope="col">Name</th><th scope="col">Popularity</th><th scope="col">Sales</th></tr></thead>
          <tbody>{products.map(({ name, popularity, sales, color }, i) => <tr key={name}>
            <td>{String(i + 1).padStart(2, "0")}</td><td>{name}</td>
            <td><div className={`${styles.progress} ${styles[color]}`} role="meter" aria-label={`${name} popularity`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={popularity}><span style={{ width: `${popularity}%` }} /></div></td>
            <td><span className={`${styles.salesBadge} ${styles[color]}`}>{sales}%</span></td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
