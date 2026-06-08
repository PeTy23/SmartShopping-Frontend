import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import type { ProductModel } from "../../api/models/ProductModel";
import { productsApi } from "../../api/clients/ProductApiClient";

import PageHeader from "../common/PageHeader";
import ConfirmDialog from "../common/ConfirmDialog";
import ProductFormDialog from "./ProductFormDialog";

// Refolosim stilurile de la categorii pentru a păstra același aspect
import '../Categories/Categories.css';

function Products() {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProductModel | null>(null);

  const [deleting, setDeleting] = useState<ProductModel | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function loadProducts() {
    productsApi
      .getAll()
      .then((data) => {
        setProducts(data);
        setError("");
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }

  function handleAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleEdit(product: ProductModel) {
    setEditing(product);
    setFormOpen(true);
  }

  function handleDeleteClick(product: ProductModel) {
    setDeleting(product);
    setConfirmOpen(true);
  }

  async function handleDelete() {
    if (deleting === null) return;
    setConfirmOpen(false);
    try {
      await productsApi.remove(deleting.id);
      loadProducts();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title={"Products"}
        actionLabel={"Add Product"}
        onAction={handleAdd}
      />

      {error !== "" && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <div className="categories-intro">
            <div className="categories-eyebrow">Products</div>
            <h1 className="categories-main-title">Curated Inventory</h1>
            <p className="categories-subtitle">Manage your high-quality pieces and update pricing.</p>
          </div>

          <div className="categories-grid">
            {products.map((product) => (
              <div className="category-card" key={product.id}>
                
                {/* Imaginea de Fundal (Folosește URL-ul sau un placeholder) */}
                <div 
                  className="category-bg-image" 
                  style={{ backgroundImage: `url('${product.imageUrl || `https://picsum.photos/seed/prod${product.id}/600/800`}')` }}
                ></div>
                
                <div className="category-gradient-overlay"></div>

                {/* Butoanele de Admin (Edit/Delete) */}
                <div className="category-admin-actions">
                  <Tooltip title="Edit">
                    <IconButton size="small" color="primary" onClick={() => handleEdit(product)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDeleteClick(product)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>

                {/* Conținutul cardului (Titlu, preț, descriere) */}
                <div className="category-content">
                  <div className="category-text">
                    <h3>{product.name}</h3>
                    <p style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>
                      ${product.price}
                    </p>
                    <p>{product.description}</p>
                  </div>
                  <div className="category-explore-btn">
                    <ArrowForwardIcon fontSize="small" />
                  </div>
                </div>

              </div>
            ))}

            {products.length === 0 && (
              <Box sx={{ width: '100%', textAlign: 'center', py: 4, color: '#777' }}>
                No products yet. Click "Add Product" to start.
              </Box>
            )}
          </div>
        </>
      )}

      {formOpen && (
        <ProductFormDialog
          product={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            loadProducts();
          }}
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete product"
        description={`Are you sure you want to delete "${deleting?.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Container>
  );
}

export default Products;