import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../utility/firebaseConfig'
//function to add a product to the db
const productCollection = collection(db, 'products')
export default {
  async createProduct(product) {
    const docRef = await addDoc(productCollection, product)
    return { id: docRef.id, ...product }
  },
}
