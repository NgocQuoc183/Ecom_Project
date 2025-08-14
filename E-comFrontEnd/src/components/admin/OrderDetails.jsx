// // src/components/admin/OrderDetails.jsx
// import React, { useState, useEffect } from 'react';
// import { getOrderDetails, updateOrderStatus } from '../../api/adminApi';

// const OrderDetails = ({ orderId, onClose }) => {
//   const [order, setOrder] = useState(null);
//   const [items, setItems] = useState([]);
//   const [status, setStatus] = useState('');

//   useEffect(() => {
//     fetchDetails();
//   }, [orderId]);

//   const fetchDetails = async () => {
//     try {
//       const res = await getOrderDetails(orderId);
//       setOrder(res.data.order);
//       setItems(res.data.items);
//       setStatus(res.data.order.status);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleUpdateStatus = async () => {
//     try {
//       await updateOrderStatus(orderId, status);
//       fetchDetails();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (!order) return <div>Loading...</div>;

//   return (
//     <div>
//       <h3 className="text-lg font-bold mb-4">Chi tiết Đơn hàng #{order.id}</h3>
//       <p>Người mua: {order.user_name} ({order.email})</p>
//       <p>Tổng tiền: {order.total_amount}</p>
//       <p>Trạng thái: {order.status}</p>
//       <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2 mb-2">
//         <option value="pending">Pending</option>
//         <option value="confirmed">Confirmed</option>
//         <option value="shipped">Shipped</option>
//         <option value="delivered">Delivered</option>
//         <option value="cancelled">Cancelled</option>
//       </select>
//       <button onClick={handleUpdateStatus} className="bg-blue-500 text-white px-4 py-2 mb-4">Cập nhật Trạng thái</button>

//       <h4 className="font-bold mb-2">Sản phẩm:</h4>
//       <table className="w-full border-collapse border border-gray-300">
//         <thead>
//           <tr>
//             <th className="border p-2">Sản phẩm</th>
//             <th className="border p-2">Số lượng</th>
//             <th className="border p-2">Giá</th>
//           </tr>
//         </thead>
//         <tbody>
//           {items.map((item) => (
//             <tr key={item.id}>
//               <td className="border p-2">{item.product_name}</td>
//               <td className="border p-2">{item.quantity}</td>
//               <td className="border p-2">{item.price}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="flex justify-end mt-4">
//         <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2">Đóng</button>
//       </div>
//     </div>
//   );
// };

// export default OrderDetails;
// src/components/admin/OrderDetails.jsx
import React, { useState, useEffect } from 'react';
import { getOrderDetails, updateOrderStatus } from '../../api/adminApi';

const OrderDetails = ({ orderId, onClose }) => {
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchDetails();
  }, [orderId]);

  const fetchDetails = async () => {
    try {
      const res = await getOrderDetails(orderId);
      setOrder(res.data.order);
      setItems(res.data.items);
      setStatus(res.data.order.status);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await updateOrderStatus(orderId, status);
      fetchDetails();
    } catch (err) {
      console.error(err);
    }
  };

  if (!order) return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">Chi tiết Đơn hàng #{order.id}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <p className="text-gray-700"><span className="font-medium">Người mua:</span> {order.user_name} ({order.email})</p>
        <p className="text-gray-700"><span className="font-medium">Tổng tiền:</span> {order.total_amount} VND</p>
        <p className="text-gray-700"><span className="font-medium">Trạng thái:</span> 
          <span className={`ml-2 px-3 py-1 rounded-full text-sm ${order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : order.status === 'delivered' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>
            {order.status}
          </span>
        </p>
      </div>
      <div className="flex items-center mb-8">
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 mr-4"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button 
          onClick={handleUpdateStatus} 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Cập nhật Trạng thái
        </button>
      </div>

      <h4 className="text-xl font-semibold mb-4 text-gray-800">Sản phẩm:</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 p-4 text-left">Sản phẩm</th>
              <th className="border border-gray-300 p-4 text-left">Số lượng</th>
              <th className="border border-gray-300 p-4 text-left">Giá</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition duration-150">
                <td className="border border-gray-300 p-4">{item.product_name}</td>
                <td className="border border-gray-300 p-4">{item.quantity}</td>
                <td className="border border-gray-300 p-4">{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-8">
        <button 
          onClick={onClose} 
          className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition duration-200"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;