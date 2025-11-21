import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import axios from 'axios';
import './ProductForm.css';

const ProductCreate = () => {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subCategory: '',
    productCode: '',
    manufacturer: '',
    country: '',
    price: '',
    salePrice: '',
    stock: '',
    thumbnailImage: null,
    detailImage: null,
    size: '',
    weight: '',
    power: '',
    material: '',
    additionalFeatures: '',
    productCode2: ''
  });

  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [detailPreview, setDetailPreview] = useState(null);

  const categories = {
    'TV': ['선택2'],
    '전자레인지': ['선택2'],
    '에어컨': ['선택2'],
    '냉장고': ['선택2'],
    '세탁기': ['선택2'],
    '오디오': ['선택2'],
    '청소기': ['선택2']
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [type]: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'thumbnailImage') {
          setThumbnailPreview(reader.result);
        } else {
          setDetailPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: null
    }));
    if (type === 'thumbnailImage') {
      setThumbnailPreview(null);
    } else {
      setDetailPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price) {
      alert('상품명, 카테고리, 정상가격은 필수 입력 항목입니다.');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      submitData.append('name', formData.name);
      submitData.append('category', formData.category);
      submitData.append('productCode', formData.productCode || '');
      submitData.append('manufacturer', formData.manufacturer || '');
      submitData.append('country', formData.country || '');
      submitData.append('price', formData.price || 0);
      submitData.append('salePrice', formData.salePrice || formData.price);
      submitData.append('stock', formData.stock || 0);
      
      submitData.append('description', JSON.stringify({
        size: formData.size,
        weight: formData.weight,
        power: formData.power,
        material: formData.material,
        additionalFeatures: formData.additionalFeatures
      }));

      if (formData.thumbnailImage) {
        submitData.append('thumbnailImage', formData.thumbnailImage);
      }
      if (formData.detailImage) {
        submitData.append('detailImage', formData.detailImage);
      }

      console.log('Submitting product data...');

      const response = await axios.post(
        `${API_BASE_URL}/api/admin/products`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Product created:', response.data);
      alert('상품이 등록되었습니다.');
      navigate('/admin/products');

    } catch (error) {
      console.error('상품 등록 실패:', error);
      
      if (error.response?.data?.message) {
        alert(`상품 등록 실패: ${error.response.data.message}`);
      } else {
        alert('상품 등록 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 삭제됩니다. 취소하시겠습니까?')) {
      navigate('/admin/products');
    }
  };

  return (
    <div className="admin-product-form">
      <AdminSidebar />
      
      <div className="product-form-main">
        <h1>Product Create</h1>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner">등록 중...</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <table className="form-table">
              <tbody>
                <tr>
                  <th>상품명</th>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="상품명을 입력하세요"
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <th>카테고리</th>
                  <td>
                    <div className="category-select">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">선택1</option>
                        {Object.keys(categories).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <select
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleInputChange}
                        disabled={!formData.category}
                      >
                        <option value="">선택2</option>
                        {formData.category && categories[formData.category]?.map(subCat => (
                          <option key={subCat} value={subCat}>{subCat}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>제고수량</th>
                  <td>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="재고 수량"
                      min="0"
                    />
                  </td>
                </tr>
                <tr>
                  <th>목록이미지</th>
                  <td>
                    <div className="file-upload-container">
                      <label className="file-upload-btn">
                        파일첨부
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'thumbnailImage')}
                          style={{ display: 'none' }}
                        />
                      </label>
                      {thumbnailPreview && (
                        <div className="file-preview">
                          <img src={thumbnailPreview} alt="Thumbnail" />
                          <button
                            type="button"
                            className="remove-file-btn"
                            onClick={() => handleRemoveFile('thumbnailImage')}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>상세페이지</th>
                  <td>
                    <div className="file-upload-container">
                      <label className="file-upload-btn">
                        파일첨부
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'detailImage')}
                          style={{ display: 'none' }}
                        />
                      </label>
                      {detailPreview && (
                        <div className="file-preview">
                          <img src={detailPreview} alt="Detail" />
                          <button
                            type="button"
                            className="remove-file-btn"
                            onClick={() => handleRemoveFile('detailImage')}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>제조사</th>
                  <td>
                    <input
                      type="text"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      placeholder="제조사"
                    />
                  </td>
                </tr>
                <tr>
                  <th>제조국</th>
                  <td>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="제조국"
                    />
                  </td>
                </tr>
                <tr>
                  <th>정상가격</th>
                  <td>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="정상가격"
                      required
                      min="0"
                    />
                  </td>
                </tr>
                <tr>
                  <th>할인가격</th>
                  <td>
                    <input
                      type="number"
                      name="salePrice"
                      value={formData.salePrice}
                      onChange={handleInputChange}
                      placeholder="할인가격"
                      min="0"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="form-buttons">
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                목록
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                등록
              </button>
            </div>
          </div>

          <div className="form-section">
            <h2>상세스펙</h2>
            <table className="form-table">
              <tbody>
                <tr>
                  <th>크기</th>
                  <td>
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      placeholder="크기"
                    />
                  </td>
                </tr>
                <tr>
                  <th>무게</th>
                  <td>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="무게"
                    />
                  </td>
                </tr>
                <tr>
                  <th>전압</th>
                  <td>
                    <input
                      type="text"
                      name="power"
                      value={formData.power}
                      onChange={handleInputChange}
                      placeholder="전압"
                    />
                  </td>
                </tr>
                <tr>
                  <th>재질</th>
                  <td>
                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      placeholder="재질"
                    />
                  </td>
                </tr>
                <tr>
                  <th>추가상품</th>
                  <td>
                    <input
                      type="text"
                      name="additionalFeatures"
                      value={formData.additionalFeatures}
                      onChange={handleInputChange}
                      placeholder="추가상품"
                    />
                  </td>
                </tr>
                <tr>
                  <th>제고수량</th>
                  <td>
                    <input
                      type="text"
                      name="productCode2"
                      value={formData.productCode2}
                      onChange={handleInputChange}
                      placeholder="상품코드"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="form-buttons">
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                목록
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                등록
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreate;
