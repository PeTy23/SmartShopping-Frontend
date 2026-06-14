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
  FormControlLabel,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
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
  const [isInStock, setIsInStock] = useState(product?.isInStock ?? true)
  const [isOnSale, setIsOnSale] = useState(product?.isOnSale ?? false)
  const [rating, setRating] = useState<number>(product?.rating ?? 0)


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
        isInStock,
        isOnSale,
        rating
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
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', mt: 2 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={isInStock} 
                  onChange={(e) => setIsInStock(e.target.checked)} 
                  color="primary" 
                />
              }
              label="In Stock"
            />
            <FormControlLabel
              control={
                <Switch 
                  checked={isOnSale} 
                  onChange={(e) => setIsOnSale(e.target.checked)} 
                  color="error" 
                />
              }
              label="On Sale (Promo)"
            />
          </Box>

          <Box>
            <Typography component="legend" variant="caption" color="text.secondary">
              Product Rating
            </Typography>
            <Rating
              value={rating}
              precision={0.1}
              onChange={(event, newValue) => {
                setRating(newValue || 0);
              }}
            />
          </Box>


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