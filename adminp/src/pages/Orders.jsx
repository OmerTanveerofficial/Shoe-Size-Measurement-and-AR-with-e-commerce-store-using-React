import React, { useEffect, useState } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/all`, {

          }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/list`),
        ]);

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        if (ordersData.success) setOrders(ordersData.orders);
        if (productsData.success) setProducts(productsData.products);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAll();
  }, []);

  const getProduct = (productId) => products.find((p) => p._id === productId);

  return (
    <div className="pt-16 border-t">
      <h2 className="mb-6 text-2xl font-semibold">All Orders (Admin View)</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        orders.map((order) =>
          order.items.map((item, index) => {
            const product = getProduct(item.productId);
            return (
              <div
                key={`${order._id}-${index}`}
                className="flex flex-col gap-4 py-4 border-b md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-start gap-6 text-sm">
                  <img
                    src={product?.image?.[0]}
                    alt={product?.name}
                    className="w-16 h-16 object-cover"
                  />
                  <div>
                    <p className="font-medium sm:text-base">{product?.name || 'Unknown Product'}</p>
                    <p className="text-sm text-gray-600">User ID: {order.userId}</p>
                    <div className="flex items-center gap-3 mt-2 text-base">
                      <p>PKR {product?.price || 0}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>Size: {item.size}</p>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Date:{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-green-600">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>{order.status || 'Pending'}</span>
                </div>
              </div>
            );
          })
        )
      )}
    </div>
  );
};

export default Orders;