// Categories (componenta principală)
// ├── PageHeader        (titlu + buton "Add Category")
// ├── Table             (lista de categorii)
// ├── CategoryFormDialog (dialog pentru add/edit)
// └── ConfirmDialog     (dialog pentru delete)

import {
  Alert,
  Box,
  CircularProgress,
  Container,
  IconButton,
  // Paper,
  // Table,
  // TableBody,
  // TableCell,
  // TableContainer,
  // TableHead,
  // TableRow,
  Tooltip,
} from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Category } from "../shared/types/Category";
import { useEffect, useState } from "react";
import { categoriesApi } from "../../api/clients/CategoryApiClient";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PageHeader from "../common/PageHeader";
import CategoryFormDialog from "./CategoryFormDialog";
import ConfirmDialog from "../common/ConfirmDialog";
import './Categories.css';

function Categories() {
  // lista de categorii afisata in tabel
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const [deleting, setDeleting] = useState<Category | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function loadCategories() {
    categoriesApi
      .getAll()
      .then((data) => {
        setCategories(data);
        setError("");
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }

  function handleAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleEdit(category: Category) {
    setEditing(category);
    setFormOpen(true);
  }

  function handleDeleteClick(category: Category) {
    setDeleting(category);
    setConfirmOpen(true);
  }

  async function handleDelete() {
    if (deleting === null) return;
    setConfirmOpen(false);
    try {
      await categoriesApi.remove(deleting.id);
      loadCategories();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title={"Categories"}
        actionLabel={"Add Category"}
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
          {/* Titlurile customizate inspirate din designul tău */}
          <div className="categories-intro">
            <div className="categories-eyebrow">Categories</div>
            <h1 className="categories-main-title">Find your next favorite thing</h1>
            <p className="categories-subtitle">Explore our curated departments, each with its own point of view.</p>
          </div>

          {/* Grila care înlocuiește Tabelul */}
          <div className="categories-grid">
            {categories.map((category) => (
              <div className="category-card" key={category.id}>
                
                {/* 1. Imaginea de Fundal (Generată dinamic după numele categoriei) */}
                <div 
                  className="category-bg-image" 
                  style={{ backgroundImage: `url('https://picsum.photos/seed/${category.id}/600/800)` }}
                ></div>
                
                {/* 2. Gradientul care face textul vizibil */}
                <div className="category-gradient-overlay"></div>

                {/* 3. Butoanele de Admin (Edit/Delete) în dreapta-sus */}
                <div className="category-admin-actions">
                  <Tooltip title="Edit">
                    <IconButton size="small" color="primary" onClick={() => handleEdit(category)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDeleteClick(category)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>

                {/* 4. Conținutul de jos (Text + Săgeată auriu) */}
                <div className="category-content">
                  <div className="category-text">
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                  </div>
                  <div className="category-explore-btn">
                    <ArrowForwardIcon fontSize="small" />
                  </div>
                </div>

              </div>
            ))}

            {categories.length === 0 && (
              <Box sx={{ width: '100%', textAlign: 'center', py: 4, color: '#777' }}>
                No categories yet. Click "Add Category" to start.
              </Box>
            )}
          </div>
        </>
      )}
      {formOpen && (
        <CategoryFormDialog
          category={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            loadCategories();
          }}
        />
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete category"
        description={`Are you sure you want to delete "${deleting?.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Container>
  );
}

export default Categories;