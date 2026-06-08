import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import { categoriesApi } from '../../../api/clients/CategoryApiClient';
import { productsApi } from '../../../api/clients/ProductApiClient';
import type { CategoryModel } from '../../../api/models/CategoryModel';
import type { ProductModel } from '../../../api/models/ProductModel';

interface ProductFormDialogProps {
  product: ProductModel | null
  onClose: () => void
  onSaved: () => void
}

function ProductFormDialog({
  product,
  onClose,
  onSaved,
}: ProductFormDialogProps) {
  const isEditing = product !== null

  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? '')
  const [price, setPrice] = useState(product ? String(product.price) : '')
  const [categoryIds, setCategoryIds] = useState<number[]>([])

  const [allCategories, setAllCategories] = useState<CategoryModel[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    categoriesApi.getAll().then((categories) => {
      setAllCategories(categories)
      if (product !== null) {
        setCategoryIds(
          categories
            .filter((c) => product.categories.includes(c.name))
            .map((c) => c.id),
        )
      }
    })
  }, [product])

  async function handleSave() {
    if (name.trim() === '') {
      setError('Name is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const data = {
        name,
        description,
        imageUrl,
        price: Number(price),
        categoryIds,
      }
      if (isEditing) {
        await productsApi.update(product.id, data)
      } else {
        await productsApi.create(data)
      }
      onSaved()
    } catch (err) {
      setError((err as Error).message)
      setSaving(false)
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? 'Edit Product' : 'Add Product'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error !== '' && <Alert severity="error">{error}</Alert>}
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
            rows={2}
          />
          <TextField
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
          />
          <TextField
            label="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            fullWidth
          />

          {imageUrl !== '' && (
            <Box
              component="img"
              src={imageUrl}
              alt="Preview"
              sx={{ width: 80, height: 80, objectFit: 'cover' }}
            />
          )}

          <FormControl fullWidth>
            <InputLabel>Categories</InputLabel>
            <Select
              multiple
              label="Categories"
              value={categoryIds}
              onChange={(e) => setCategoryIds(e.target.value as number[])}
              renderValue={(selected) =>
                selected
                  .map((id) => allCategories.find((c) => c.id === id)?.name)
                  .join(', ')
              }
            >
              {allCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProductFormDialog