import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Replace with your actual backend URL
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const List = () => {
  const [list, setList] = useState([]);

  // Fetch product list
  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch product list');
    }
  };

  // Remove product (no token required)
  const removeProduct = async (id) => {
    try {
      const response = await axios.post(`${backendUrl}/api/product/remove`, { id });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList(); // refresh the list after deletion
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to remove product');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2 font-semibold">ALL PRODUCTS LIST</p>

      <div className="flex flex-col gap-2">
        {/* Table header for larger screens */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {/* Product list */}
        {list.length > 0 ? (
          list.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
              key={index}
            >
              <img className="object-cover w-12 h-12 rounded-md" src={item.image[0]} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>Rs. {item.price}</p>
              <p
                onClick={() => removeProduct(item._id)}
                className="text-lg text-right text-red-500 cursor-pointer md:text-center"
              >
                X
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No products found.</p>
        )}
      </div>
    </>
  );
};

export default List;