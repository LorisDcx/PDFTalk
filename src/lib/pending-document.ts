const DATABASE_NAME = 'cramdesk-pending-upload'
const STORE_NAME = 'files'
const FILE_KEY = 'document'

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function withStore<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode)
    const request = operation(transaction.objectStore(STORE_NAME))
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => database.close()
    transaction.onerror = () => { database.close(); reject(transaction.error) }
  })
}

export function savePendingDocument(file: File) {
  return withStore('readwrite', store => store.put(file, FILE_KEY))
}

export function loadPendingDocument(): Promise<File | undefined> {
  return withStore('readonly', store => store.get(FILE_KEY))
}

export function clearPendingDocument() {
  return withStore('readwrite', store => store.delete(FILE_KEY))
}
