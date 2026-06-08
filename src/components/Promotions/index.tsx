import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { categoriesApi } from '../../api/clients/CategoryApiClient';
import { productsApi } from '../../api/clients/ProductApiClient';
import { promotionsApi } from '../../api/clients/PromotionApiClient';
import ConfirmDialog from '../common/ConfirmDialog';
import PageHeader from '../common/PageHeader';
import type { Product } from '../shared/types/Product';
import type { Promotion } from '../shared/types/Promotion';
import PromotionFormDialog from './PromotionFormDialog';
import type { Category } from '../shared/types/Category';

function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Promotion | null>(null)

  const [deleting, setDeleting] = useState<Promotion | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  function loadData() {
    Promise.all([
      promotionsApi.getAll(),
      productsApi.getAll(),
      categoriesApi.getAll(),
    ])
      .then(([promotionList, productList, categoryList]) => {
        setPromotions(promotionList)
        setProducts(productList)
        setCategories(categoryList)
        setError('')
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  function describeScope(promotion: Promotion): string {
    if (promotion.productId !== null) {
      const product = products.find((p) => p.id === promotion.productId)
      return `Product: ${product ? product.name : promotion.productId}`
    }
    if (promotion.categoryId !== null) {
      const category = categories.find((c) => c.id === promotion.categoryId)
      return `Category: ${category ? category.name : promotion.categoryId}`
    }
    return 'Whole cart'
  }

  function handleAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function handleEdit(promotion: Promotion) {
    setEditing(promotion)
    setFormOpen(true)
  }

  function handleDeleteClick(promotion: Promotion) {
    setDeleting(promotion)
    setConfirmOpen(true)
  }

  async function handleDelete() {
    if (deleting === null) return
    setConfirmOpen(false)
    try {
      await promotionsApi.remove(deleting.id)
      loadData()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="Promotions"
        actionLabel="Add Promotion"
        onAction={handleAdd}
      />

      {error !== '' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Threshold</TableCell>
                <TableCell>Reward</TableCell>
                <TableCell>Applies to</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {promotions.map((promotion) => (
                <TableRow key={promotion.id} hover>
                  <TableCell>{promotion.name}</TableCell>
                  <TableCell>{promotion.typeLabel}</TableCell>
                  <TableCell>{promotion.threshold}</TableCell>
                  <TableCell>{promotion.rewardLabel}</TableCell>
                  <TableCell>{describeScope(promotion)}</TableCell>
                  <TableCell>{promotion.activeLabel}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(promotion)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(promotion)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {promotions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No promotions yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {formOpen && (
        <PromotionFormDialog
          promotion={editing}
          products={products}
          categories={categories}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false)
            loadData()
          }}
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete promotion"
        description={`Are you sure you want to delete "${deleting?.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Container>
  )
}

export default Promotions