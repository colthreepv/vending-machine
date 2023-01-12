import { useQuery } from 'react-query'
import { Product } from 'shared-types/src/crud'

const fetchProducts = async () => {
  const response = await fetch('/api/product')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return await response.json() as Product[]
}


const ProductList = () => {
  const { isError, data } = useQuery('products', fetchProducts)

  return <div>
    {isError && <div>Something went wrong</div>}
    {data && data.map((product) => <div key={product.name}>{product.name}</div>)}
  </div>
}

export default ProductList
