import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import './ProductList.css';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([
    {
      id: 1,
      productCode: 'TV-001',
      productName: '삼성 QLED TV 75인치',
      category: 'TV/모니터',
      price: 2590000,
      stock: 15,
      status: '판매중',
      registeredDate: '2025-10-20'
    },
    {
      id: 2,
      productCode: 'AC-002',
      productName: 'LG 에어컨 FQ27GASMA2 일반벽걸',
      category: '에어컨',
      price: 1600000,
      stock: 8,
      status: '판매중',
      registeredDate: '2025-10-18'
    },
    {
      id: 3,
      productCode: 'REF-003',
      productName: '삼성 비스포크 냉장고 4도어',
      category: '냉장고',
      price: 3200000,
      stock: 0,
      status: '품절',
      registeredDate: '2025-10-15'
    },
    {
      id: 4,
      productCode: 'WM-004',
      productName: 'LG 트롬 드럼세탁기 21kg',
      category: '세탁기',
      price: 1450000,
      stock: 12,
      status: '판매중',
      registeredDate: '2025-10-12'
    },
    {
      id: 5,
      productCode: 'MIC-005',
      productName: '삼성 비스포크 전자레인지',
      category: '주방가전',
      price: 189000,
      stock: 25,
      status: '판매중',
      registeredDate: '2025-10-10'
    }
  ]);

  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const categories = ['all', 'TV/모니터', '에어컨', '냉장고', '세탁기', '주방가전'];
  const statuses = ['all', '판매중', '품절', '판매중지'];

  useEffect(() => {
    // API 호출하여 상품 목록 가져오기
    fetchProducts();
  }, [filterCategory, filterStatus]);

  const fetchProducts = async () => {
    try {
      // 실제 API 호출 구현
      // const response = await adminService.getProducts({ 
      //   category: filterCategory,
      //   status: filterStatus
      // });
      // setProducts(response.data);
    } catch (error) {
      console.error('상품 목록 조회 실패:', error);
    }
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setProducts(products.map(product => ({ ...product, checked })));
  };

  const handleSelectProduct = (productId) => {
    setProducts(products.map(product => 
      product.id === productId ? { ...product, checked: !product.checked } : product
    ));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // 검색 API 호출
    console.log('검색어:', searchTerm);
  };

  const handleAddProduct = () => {
    navigate('/admin/products/create');
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/products/${productId}/edit`);
  };

  const handleDeleteSelected = () => {
    const selectedProducts = products.filter(product => product.checked);
    if (selectedProducts.length === 0) {
      alert('삭제할 상품을 선택해주세요.');
      return;
    }
    
    if (window.confirm(`선택한 ${selectedProducts.length}개의 상품을 삭제하시겠습니까?`)) {
      // 삭제 API 호출
      console.log('삭제할 상품:', selectedProducts);
      setProducts(products.filter(product => !product.checked));
    }
  };

  const handleStatusChange = (productId, newStatus) => {
    // 상태 변경 API 호출
    setProducts(products.map(product => 
      product.id === productId ? { ...product, status: newStatus } : product
    ));
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case '판매중':
        return 'status-active';
      case '품절':
        return 'status-outofstock';
      case '판매중지':
        return 'status-inactive';
      default:
        return '';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.productCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="admin-product-list">
      <AdminSidebar />
      
      <div className="product-list-main">
        <div className="page-header">
          <h1>Product List</h1>
          
          <div className="header-controls">
            <button className="add-btn" onClick={handleAddProduct}>
              + 상품 등록
            </button>
          </div>
        </div>

        <div className="filter-section">
          <div className="filters">
            <select 
              className="filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? '전체 카테고리' : category}
                </option>
              ))}
            </select>
            
            <select 
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? '전체 상태' : status}
                </option>
              ))}
            </select>
          </div>
          
          <div className="search-box">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="상품명 또는 상품코드를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="search-btn">🔍</button>
            </form>
          </div>
        </div>

        <div className="product-table-container">
          <table className="product-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>상품코드</th>
                <th>상품명</th>
                <th>카테고리</th>
                <th>판매가격</th>
                <th>재고</th>
                <th>상태</th>
                <th>등록일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={product.checked || false}
                      onChange={() => handleSelectProduct(product.id)}
                    />
                  </td>
                  <td className="product-code">{product.productCode}</td>
                  <td className="product-name">{product.productName}</td>
                  <td>{product.category}</td>
                  <td className="price">{product.price.toLocaleString()}원</td>
                  <td className={`stock ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                    {product.stock}개
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>{product.registeredDate}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn" 
                        onClick={() => handleEditProduct(product.id)}
                      >
                        수정
                      </button>
                      <button 
                        className="status-change-btn"
                        onClick={() => handleStatusChange(product.id, 
                          product.status === '판매중' ? '판매중지' : '판매중'
                        )}
                      >
                        {product.status === '판매중' ? '중지' : '재개'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="no-data">
              <p>등록된 상품이 없습니다.</p>
            </div>
          )}
        </div>

        <div className="table-footer">
          <button className="delete-btn" onClick={handleDeleteSelected}>
            선택 삭제
          </button>
          
          <div className="product-summary">
            <span>총 {filteredProducts.length}개 상품</span>
            <span className="separator">|</span>
            <span>판매중: {filteredProducts.filter(p => p.status === '판매중').length}개</span>
            <span className="separator">|</span>
            <span>품절: {filteredProducts.filter(p => p.status === '품절').length}개</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
