\
<template>
  <div class="container">
    <div class="row border p-4 my-5 rounded">
      <div class="col-9">
        <form v-on:submit.prevent="onSubmit">
          <div class="h2 text-center text-success">
            {{ productIdForUpdate ? 'Update' : 'Create' }} Product
          </div>
          <hr />
          <div v-if="errorList.length > 0" class="alert alert-danger pb-0">
            Please fix the following errors:
            <ul>
              <li v-for="error in errorList" :key="error">{{ error }}</li>
            </ul>
          </div>

          <div class="mt-3">
            <span class="text-muted">Name</span>
            <input v-model.trim="productData.name" type="text" class="form-control" />
          </div>
          <div class="mt-3">
            <span class="text-muted">Description</span>
            <textarea v-model="productData.description" type="text" class="form-control"></textarea>
          </div>
          <div class="mt-3">
            <span class="text-muted">Price</span>
            <input v-model.number="productData.price" type="number" class="form-control" />
          </div>

          <div class="mt-3">
            <span class="text-muted">Sale Price</span>
            <input v-model.number="productData.salePrice" type="number" class="form-control" />
          </div>
          <div class="mt-3">
            <span class="text-muted">Tags (comma-seperated)</span>
            <input
              v-model="productData.tags"
              type="text"
              class="form-control"
              placeholder="e.g., modern, classic, luxury"
            />
          </div>
          <div class="form-check form-switch pt-3">
            <input
              v-model="productData.bestseller"
              class="form-check-input"
              type="checkbox"
              role="switch"
            />

            <label class="form-check-label" for="bestseller"> Bestseller </label>
          </div>
          <div class="mt-3">
            <label class="text-muted">Category</label>
            <select class="form-select" v-model="productData.category">
              <option v-for="option in PRODUCT_CATEGORIES" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Image</label>
            <div class="input-group">
              <input type="file" class="form-control" />
            </div>
          </div>
          <div class="pt-3">
            <button class="btn btn-success m-2 w-25" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>Submit
            </button>
            <router-link
              :to="{ name: APP_ROUTE_NAMES.PRODUCT_LIST }"
              class="btn btn-secondary m-2 w-25"
            >
              Cancel
            </router-link>
          </div>
        </form>
      </div>
      <div class="col-3">
        <img
          :src="productData.imageUrl"
          class="img-fluid w-100 m-3 p-3 rounded"
          alt="Product
        preview"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { APP_ROUTE_NAMES } from '../../constants/routeNames'
import { ref, reactive, onMounted } from 'vue'
import { PRODUCT_CATEGORIES } from '@/constants/appConstants'
import { useSwal } from '@/utility/useSwal'
import productService from '@/services/productService'
import { useRoute, useRouter } from 'vue-router'

const { showSuccess, showError } = useSwal()
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const errorList = reactive([])
const productData = reactive({
  name: '',
  description: '',
  price: 0,
  salePrice: 0,
  tags: [],
  bestseller: false,
  category: '',
  imageUrl: 'https://via.placeholder.com/150',
})

const productIdForUpdate = route.params.id

onMounted(async () => {
  if (!productIdForUpdate) return
  loading.value = true

  try {
    const product = await productService.getProductById(productIdForUpdate)
    Object.assign(productData, {
      ...product,
      tags: product.tags.join(', '),
    })
  } catch (e) {
    console.log('Error fetching product:', e)
    showError('An error occurred while fetching the product details.')
  } finally {
    loading.value = false
  }
})

async function onSubmit() {
  try {
    loading.value = true
    errorList.length = 0
    if (productData.name.length < 3) {
      errorList.push('Name should be greater than 3')
    }
    if (productData.price <= 0) {
      errorList.push('Price should be greater than 0')
    }
    if (productData.category === '') {
      errorList.push('please select a category')
    }
    if (!errorList.length) {
      const productObj = {
        ...productData,
        price: Number(productData.price),
        salePrice: Number(productData.salePrice),
        bestseller: Boolean(productData.bestseller),
        tags:
          productData.tags.length > 0 ? productData.tags.split(',').map((tag) => tag.trim()) : [],
      }
      //   await new Promise((resolve) => setTimeout(resolve, 2000))
      if (productIdForUpdate) {
        await productService.updateProduct(productIdForUpdate, productObj)
        showSuccess('Product Updated successfully')
      } else {
        await productService.createProduct(productObj)
        showSuccess('Product Create successfully')
      }

      console.log('Product Created:', productObj)
      router.push({ name: APP_ROUTE_NAMES.PRODUCT_LIST })
    }
  } catch (error) {
    console.log('Error creating product:', error)
    showError('An error occurred while creating the product.')
  } finally {
    loading.value = false
  }
  console.log('Product Data:', productData)
}
</script>
