const { test, expect } = require('../../fixtures/testFixtures');
const { ProductApi } = require('../../api/ProductApi');

test.describe('API cart @smoke', () => {
  test('creates a cart, adds a product, and returns the item on GET @smoke', async ({
    productApi,
    cartApi,
  }) => {
    const productsResponse = await productApi.listProducts();
    expect(productsResponse.status()).toBe(200);
    const products = ProductApi.extractProducts(await productsResponse.json());
    expect(products.length).toBeGreaterThan(0);
    const productId = products[0].id;
    const quantity = 2;

    const createResponse = await cartApi.createCart();
    expect(createResponse.status()).toBe(201);
    const created = await createResponse.json();
    expect(created.id).toBeTruthy();
    const cartId = created.id;

    const addResponse = await cartApi.addProduct(cartId, productId, quantity);
    expect(addResponse.status()).toBe(200);
    const addBody = await addResponse.json();
    expect(addBody.result).toBe('item added or updated');

    const getResponse = await cartApi.getCart(cartId);
    expect(getResponse.status()).toBe(200);
    const cart = await getResponse.json();
    expect(cart.id).toBe(cartId);

    // OpenAPI CartResponse only documents `id`; cart_items is observed at runtime.
    expect(Array.isArray(cart.cart_items)).toBeTruthy();
    const matchingItem = cart.cart_items.find((item) => item.product_id === productId);
    expect(matchingItem).toBeTruthy();
    expect(matchingItem.quantity).toBe(quantity);
  });
});
