import { useEffect, useState } from "react";
import api from "./api/api";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(res => setProducts(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>E-Commerce Frontend</h1>
      <p>Products loaded from FastAPI backend</p>

      <ul>
        {products.map(p => (
          <li key={p.id}>
            <strong>{p.name}</strong> – ₹{p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
