import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  type DocumentData,
  type QueryConstraint,
  type DocumentReference,
  type CollectionReference,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'

export const firestoreService = {
  // Get a single document
  async get<T>(collectionName: string, docId: string): Promise<T | null> {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T
    }
    return null
  },

  // Get all documents from a collection
  async getAll<T>(collectionName: string, constraints: QueryConstraint[] = []): Promise<T[]> {
    const collectionRef = collection(db, collectionName)
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef)
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T))
  },

  // Get documents with pagination
  async getPaginated<T>(
    collectionName: string,
    constraints: QueryConstraint[] = [],
    pageSize: number = 20,
    lastDoc?: DocumentData
  ): Promise<{ items: T[]; lastDoc: DocumentData | null; hasMore: boolean }> {
    const collectionRef = collection(db, collectionName)
    const baseConstraints = [...constraints, limit(pageSize + 1)]

    if (lastDoc) {
      baseConstraints.push(startAfter(lastDoc))
    }

    const q = query(collectionRef, ...baseConstraints)
    const snapshot = await getDocs(q)
    const docs = snapshot.docs

    const hasMore = docs.length > pageSize
    const items = docs.slice(0, pageSize).map(doc => ({ id: doc.id, ...doc.data() } as T))
    const newLastDoc = docs.length > 0 ? docs[Math.min(docs.length - 1, pageSize - 1)] : null

    return { items, lastDoc: newLastDoc, hasMore }
  },

  // Create a new document
  async create<T extends { id?: string }>(
    collectionName: string,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    const collectionRef = collection(db, collectionName)
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return docRef.id
  },

  // Create with specific ID
  async createWithId<T>(
    collectionName: string,
    docId: string,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<void> {
    const docRef = doc(db, collectionName, docId)
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  },

  // Update a document
  async update<T>(
    collectionName: string,
    docId: string,
    data: Partial<T>
  ): Promise<void> {
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    })
  },

  // Delete a document
  async delete(collectionName: string, docId: string): Promise<void> {
    const docRef = doc(db, collectionName, docId)
    await deleteDoc(docRef)
  },

  // Batch write operations
  async batchWrite(
    operations: Array<{
      type: 'set' | 'update' | 'delete'
      collection: string
      id: string
      data?: DocumentData
    }>
  ): Promise<void> {
    const batch = writeBatch(db)

    for (const op of operations) {
      const docRef = doc(db, op.collection, op.id)
      switch (op.type) {
        case 'set':
          batch.set(docRef, { ...op.data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
          break
        case 'update':
          batch.update(docRef, { ...op.data, updatedAt: serverTimestamp() })
          break
        case 'delete':
          batch.delete(docRef)
          break
      }
    }

    await batch.commit()
  },

  // Subscribe to a document
  subscribeToDoc<T>(
    collectionName: string,
    docId: string,
    callback: (data: T | null) => void
  ): () => void {
    const docRef = doc(db, collectionName, docId)
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...snap.data() } as T)
      } else {
        callback(null)
      }
    })
  },

  // Subscribe to a collection
  subscribeToCollection<T>(
    collectionName: string,
    constraints: QueryConstraint[],
    callback: (data: T[]) => void
  ): () => void {
    const collectionRef = collection(db, collectionName)
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef)

    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T))
      callback(items)
    })
  },

  // Helper to get nested collection
  getNestedCollection(parentCollection: string, parentId: string, childCollection: string): CollectionReference {
    return collection(db, parentCollection, parentId, childCollection)
  },

  // Create in nested collection
  async createInNested<T>(
    parentCollection: string,
    parentId: string,
    childCollection: string,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    const collectionRef = collection(db, parentCollection, parentId, childCollection)
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return docRef.id
  },

  // Get from nested collection
  async getFromNested<T>(
    parentCollection: string,
    parentId: string,
    childCollection: string,
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    const collectionRef = collection(db, parentCollection, parentId, childCollection)
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef)
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T))
  },

  // Convert Date to Firestore Timestamp
  toTimestamp(date: Date): Timestamp {
    return Timestamp.fromDate(date)
  },

  // Get server timestamp
  serverTimestamp() {
    return serverTimestamp()
  }
}

// Export query helpers
export { where, orderBy, limit, startAfter, query, collection, doc, Timestamp }
