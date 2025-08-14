// // src/components/admin/OrderList.jsx
// import React, { useState, useEffect } from 'react';
// import { getAllOrders } from '../../api/adminApi';
// import OrderDetails from './OrderDetails';

// const OrderList = () => {
//   const [orders, setOrders] = useState([]);
//   const [showDetails, setShowDetails] = useState(false);
//   const [selectedOrderId, setSelectedOrderId] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const res = await getAllOrders();
//       setOrders(res.data.orders);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleViewDetails = (id) => {
//     setSelectedOrderId(id);
//     setShowDetails(true);
//   };

//   const handleCloseDetails = () => {
//     setShowDetails(false);
//     setSelectedOrderId(null);
//     fetchOrders();
//   };

//   return (
//     <div>
//       <table className="w-full border-collapse border border-gray-300">
//         <thead>
//           <tr>
//             <th className="border p-2">ID</th>
//             <th className="border p-2">Người mua</th>
//             <th className="border p-2">Tổng tiền</th>
//             <th className="border p-2">Trạng thái</th>
//             <th className="border p-2">Hành động</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map((order) => (
//             <tr key={order.id}>
//               <td className="border p-2">{order.id}</td>
//               <td className="border p-2">{order.user_name}</td>
//               <td className="border p-2">{order.total_amount}</td>
//               <td className="border p-2">{order.status}</td>
//               <td className="border p-2">
//                 <button onClick={() => handleViewDetails(order.id)} className="bg-green-500 text-white px-2 py-1">Chi tiết</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {showDetails && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow-lg w-3/4">
//             <OrderDetails orderId={selectedOrderId} onClose={handleCloseDetails} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderList;
// src/components/admin/OrderList.jsx
import React, { useState, useEffect } from 'react';
import { getAllOrders } from '../../api/adminApi';
import OrderDetails from './OrderDetails';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewDetails = (id) => {
    setSelectedOrderId(id);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedOrderId(null);
    fetchOrders();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 p-4 text-left">ID</th>
              <th className="border border-gray-300 p-4 text-left">Người mua</th>
              <th className="border border-gray-300 p-4 text-left">Tổng tiền</th>
              <th className="border border-gray-300 p-4 text-left">Trạng thái</th>
              <th className="border border-gray-300 p-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition duration-150">
                <td className="border border-gray-300 p-4">{order.id}</td>
                <td className="border border-gray-300 p-4">{order.user_name}</td>
                <td className="border border-gray-300 p-4">{order.total_amount}</td>
                <td className="border border-gray-300 p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : order.status === 'delivered' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="border border-gray-300 p-4">
                  <button 
                    onClick={() => handleViewDetails(order.id)} 
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-3/4 max-w-4xl transform transition-all duration-300 scale-100">
            <OrderDetails orderId={selectedOrderId} onClose={handleCloseDetails} />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;