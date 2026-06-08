import { useState } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
} from '@mui/material'
import { promotionsApi } from '../../../api/clients/PromotionApiClient';
import { PromotionReward, PromotionType } from '../../../api/models/PromotionModel';
import type { Product } from '../../shared/types/Product';
import type { Promotion } from '../../shared/types/Promotion';
import type { Category } from '../../shared/types/Category';

interface PromotionFormDialogProps {
  promotion: Promotion | null
  products: Product[]
  categories: Category[]
  onClose: () => void
  onSaved: () => void
}

function PromotionFormDialog({
  promotion,
  products,
  categories,
  onClose,
  onSaved,
}: PromotionFormDialogProps) {
  const isEditing = promotion !== null

  const [name, setName] = useState(promotion?.name ?? '')
  const [type, setType] = useState<number>(promotion?.type ?? PromotionType.Quantity)
  const [threshold, setThreshold] = useState(
    promotion ? String(promotion.threshold) : '',
  )
  const [reward, setReward] = useState<number>(
    promotion?.reward ?? PromotionReward.FreeItems,
  )
  const [rewardValue, setRewardValue] = useState(
    promotion ? String(promotion.rewardValue) : '',
  )
  const [productId, setProductId] = useState<number | ''>(
    promotion?.productId ?? '',
  )
  const [categoryId, setCategoryId] = useState<number | ''>(
    promotion?.categoryId ?? '',
  )
  const [isActive, setIsActive] = useState(promotion?.isActive ?? true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

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
        type,
        threshold: Number(threshold),
        reward,
        rewardValue: Number(rewardValue),
        productId: productId === '' ? null : productId,
        categoryId: categoryId === '' ? null : categoryId,
        isActive,
      }
      if (isEditing) {
        await promotionsApi.update(promotion.id, data)
      } else {
        await promotionsApi.create(data)
      }
      onSaved()
    } catch (err) {
      setError((err as Error).message)
      setSaving(false)
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? 'Edit Promotion' : 'Add Promotion'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error !== '' && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              value={type}
              onChange={(e) => setType(Number(e.target.value))}
            >
              <MenuItem value={PromotionType.Quantity}>Quantity</MenuItem>
              <MenuItem value={PromotionType.CartTotal}>Cart Total</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Threshold"
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            fullWidth
            helperText="Item quantity, or cart total in RON, needed to trigger the promotion."
          />

          <FormControl fullWidth>
            <InputLabel>Reward</InputLabel>
            <Select
              label="Reward"
              value={reward}
              onChange={(e) => setReward(Number(e.target.value))}
            >
              <MenuItem value={PromotionReward.FreeItems}>Free Items</MenuItem>
              <MenuItem value={PromotionReward.PercentDiscount}>
                Percent Discount
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Reward Value"
            type="number"
            value={rewardValue}
            onChange={(e) => setRewardValue(e.target.value)}
            fullWidth
            helperText="Number of free items, or the discount percentage."
          />

          <FormControl fullWidth>
            <InputLabel>Product (optional)</InputLabel>
            <Select
              label="Product (optional)"
              value={productId}
              onChange={(e) => {
                const value = String(e.target.value)
                setProductId(value === '' ? '' : Number(value))
              }}
            >
              <MenuItem value="">None</MenuItem>
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Category (optional)</InputLabel>
            <Select
              label="Category (optional)"
              value={categoryId}
              onChange={(e) => {
                const value = String(e.target.value)
                setCategoryId(value === '' ? '' : Number(value))
              }}
            >
              <MenuItem value="">None</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            }
            label="Active"
          />
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

export default PromotionFormDialog