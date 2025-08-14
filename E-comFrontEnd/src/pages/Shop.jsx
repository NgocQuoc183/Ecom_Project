
// import React, { useEffect, useState } from 'react';
// import { getAllProducts } from '../api/productsApi';
// import ProductCard from '../components/ProductCard';
// import HeroSection from '../components/home/HeroSection'
// import axios from 'axios';

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [limit, _setLimit] = useState(8);
//   const [category, setCategory] = useState('');
//   const [keyword, setKeyword] = useState('');
//   const [sort, setSort] = useState('');
//   const [totalPages, setTotalPages] = useState(0);
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const data = await getAllProducts(page, limit, category, keyword, sort);
//       setProducts(data.data);
//       setTotalPages(Math.ceil(data.total / limit));
//     };

//     const fetchCategories = async () => {
//       const res = await axios.get('http://localhost:5000/api/categories');
//       setCategories(res.data);
//     };

//     fetchProducts();
//     fetchCategories();
//   }, [page, limit, category, keyword, sort]);

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setPage(1);
//   };

//   return (
//     <div className="container mx-auto py-16 px-4 md:px-8 bg-[#f4f7de] font-vintage text-olive-800">
//       {/* Tiêu đề */}
//       <h2 className="text-4xl font-bold text-center mb-12 text-bronze-700 tracking-wide uppercase border-b-2 border-bronze-300 pb-4">
//         Tất Cả Sản Phẩm
//       </h2>

//       {/* Tìm kiếm & Lọc */}
//       <div className="max-w-5xl mx-auto bg-cream-50 p-6 rounded-xl shadow-lg mb-14 border border-bronze-200">
//         <form
//           onSubmit={handleSearch}
//           className="flex flex-col md:flex-row justify-center items-center gap-6 mb-6"
//         >
//           <input
//             type="text"
//             value={keyword}
//             onChange={(e) => setKeyword(e.target.value)}
//             placeholder="Tìm kiếm sản phẩm..."
//             className="p-4 border border-bronze-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-bronze-400 bg-white text-olive-800 placeholder-olive-400 w-full md:w-2/3 transition-all duration-300"
//           />
//           <button
//             type="submit"
//             className="bg-bronze-600 text-cream-50 py-3 px-8 rounded-lg shadow-md hover:bg-gradient-to-r from-bronze-700 to-bronze-500 hover:shadow-xl transition-all duration-300"
//           >
//             Tìm kiếm
//           </button>
//         </form>

//         <div className="flex flex-col md:flex-row justify-center gap-6">
//           <select
//             value={category}
//             onChange={(e) => {
//               setCategory(e.target.value);
//               setPage(1);
//             }}
//             className="p-4 border border-bronze-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-bronze-400 text-olive-800 transition-all duration-300 w-full md:w-1/3"
//           >
//             <option value="">Tất cả danh mục</option>
//             {categories.map((cat) => (
//               <option key={cat.id} value={cat.id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>

//           <select
//             value={sort}
//             onChange={(e) => {
//               setSort(e.target.value);
//               setPage(1);
//             }}
//             className="p-4 border border-bronze-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-bronze-400 text-olive-800 transition-all duration-300 w-full md:w-1/3"
//           >
//             <option value="">Sắp xếp</option>
//             <option value="price_asc">Giá thấp đến cao</option>
//             <option value="price_desc">Giá cao đến thấp</option>
//           </select>
//         </div>
//       </div>

//       {/* Danh sách sản phẩm */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
//         {products.map((product) => (
//           <div
//             key={product.id}
//           >
//             <ProductCard product={product} />
//           </div>
//         ))}
//       </div>

//       {/* Phân trang */}
//       <div className="flex justify-center items-center mt-14 gap-6">
//         <button
//           onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
//           className="bg-bronze-600 text-cream-50 py-3 px-6 rounded-lg shadow-md hover:bg-gradient-to-r from-bronze-700 to-bronze-500 hover:shadow-xl transition-all duration-300"
//         >
//           Trước
//         </button>
//         <span className="text-xl font-medium text-olive-800">{`Trang ${page} / ${totalPages}`}</span>
//         <button
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
//           className="bg-bronze-600 text-cream-50 py-3 px-6 rounded-lg shadow-md hover:bg-gradient-to-r from-bronze-700 to-bronze-500 hover:shadow-xl transition-all duration-300"
//         >
//           Sau
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductList;
import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../api/productsApi';
import ProductCard from '../components/ProductCard';
import HeroSection from '../components/home/HeroSection';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, _setLimit] = useState(8);
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(page, limit, category, keyword, sort),
          axios.get('http://localhost:5000/api/categories')
        ]);
        
        setProducts(productsData.data);
        setTotalPages(Math.ceil(productsData.total / limit));
        setCategories(categoriesData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, limit, category, keyword, sort]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const resetFilters = () => {
    setCategory('');
    setKeyword('');
    setSort('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection 
        title="Khám Phá Bộ Sưu Tập"
        subtitle="Những sản phẩm chất lượng cao dành cho bạn"
        backgroundClass="bg-gradient-to-r from-teal-500 to-blue-600"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Tìm Kiếm & Lọc</h3>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Nhập từ khóa tìm kiếm..."
                  className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 shadow-md"
              >
                Tìm kiếm
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp</label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Mặc định</option>
                <option value="price_asc">Giá: Thấp đến cao</option>
                <option value="price_desc">Giá: Cao đến thấp</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-8 flex justify-between items-center">
              <h3 className="text-2xl font-semibold text-gray-800">
                {products.length} sản phẩm được tìm thấy
              </h3>
              <div className="text-sm text-gray-500">
                Trang {page} / {totalPages}
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="mt-4 text-lg font-medium text-gray-700">Không tìm thấy sản phẩm nào</h4>
                <p className="mt-2 text-gray-500">Hãy thử thay đổi tiêu chí tìm kiếm của bạn</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-12">
                  <nav className="inline-flex rounded-md shadow">
                    <button
                      onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
                      disabled={page === 1}
                      className={`px-4 py-2 rounded-l-md border ${page === 1 ? 'bg-gray-100 text-gray-400 border-gray-300' : 'bg-white text-blue-600 border-gray-300 hover:bg-gray-50'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 border-t border-b ${page === pageNum ? 'bg-blue-50 text-blue-600 border-blue-200 font-medium' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
                      disabled={page === totalPages}
                      className={`px-4 py-2 rounded-r-md border ${page === totalPages ? 'bg-gray-100 text-gray-400 border-gray-300' : 'bg-white text-blue-600 border-gray-300 hover:bg-gray-50'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;
