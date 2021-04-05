import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    sumAmount[product.id] = product.amount            //(sumAmount[product.id] || 0) + 1

    return sumAmount

  }, {} as CartItemsAmount)
  // console.log(cartItemsAmount)
  // console.log(cart)

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get<Product[]>('/products')
      const productsResponse = [...response.data ] as ProductFormatted[]
    
      //              poderia usar map
      productsResponse.forEach(product => {
        product.priceFormatted = formatPrice(product.price)
      })

      setProducts(productsResponse)
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    // const foundProduct = products.find(product => product.id === id)
    // if(!foundProduct) return console.log('this product doesnt exist yet, sorry...')
    addProduct(id)
  }

  return (
    <ProductList>
      { products.map(product => (
        <li key={product.id}>
        <img src={ product.image } alt={ product.title } />
        <strong>{ product.title }</strong>
        <span>
          { product.priceFormatted }
        </span>
        <button
          type="button"
          data-testid="add-product-button"
          onClick={() => handleAddProduct(product.id)}
        >
          <div data-testid="cart-product-quantity">
            <MdAddShoppingCart size={16} color="#FFF" />
            {cartItemsAmount[product.id] || 0}
          </div>

          <span>ADICIONAR AO CARRINHO</span>
        </button>
      </li>
      )) }
    </ProductList>
  );
};

export default Home;
