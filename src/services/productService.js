import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../utility/firebaseConfig'
//function to add a product to the db
const productCollection = collection(db, 'products')
export default {
  async createProduct(product) {
    const docRef = await addDoc(productCollection, product)
    return { id: docRef.id, ...product }
  },

  async getAllProducts() {
    const querySnapshot = await getDocs(productCollection)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  async getProductById(id) {
    const docRef = doc(db, 'products', id)
    const snapshot = await getDoc(docRef)
    return { id: snapshot.id, ...snapshot.data() }
  },

  async updateProduct(id, productData) {
    const docRef = doc(db, 'products', id)
    await updateDoc(docRef, productData)
    return { id, ...productData }
  },

  async deleteProduct(id) {
    const docRef = doc(db, 'products', id)
    await deleteDoc(docRef)
  },
}
