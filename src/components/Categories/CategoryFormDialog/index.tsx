import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import type { Category } from "../../shared/types/Category";
import { categoriesApi } from "../../../api/clients/CategoryApiClient";

interface CategoryFormDialogProps {
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
}

function CategoryFormDialog({
  category,
  onClose,
  onSaved,
}: CategoryFormDialogProps) {
  const isEditing = category !== null;

  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [imageUrl, setImageUrl] = useState(category?.imageUrl ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (name.trim() === "") {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const data = { name, description, imageUrl };
      if (isEditing) {
        await categoriesApi.update(category.id, data);
      } else {
        await categoriesApi.create(data);
      }
      onSaved();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? "Edit Category" : "Add Category"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error !== "" && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />  
          <TextField
            label="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            fullWidth
          />
          {imageUrl !== "" && (
            <Box
              component="img"
              src={imageUrl}
              alt="Category Preview"
              sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1 }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CategoryFormDialog;