import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import './UserList.css';

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([
    { id: 1, no: 1, username: '이소은', userId: 'User', name: '남자', phone: '010-3219-0100', registeredDate: '2025-10-27', status: 'active', checked: false },
    { id: 2, no: 2, username: 'Winter1', userId: 'Winter1', name: '-', phone: 'qwda@e1f!asdf', registeredDate: '2025-10-26', status: 'active', checked: false },
    { id: 3, no: 3, username: 'asdf', userId: 'happy', name: '-', phone: 'asdfdas', registeredDate: '2025-10-26', status: 'active', checked: false },
    { id: 4, no: 4, username: 'asdfadsf', userId: 'Winter', name: '-', phone: 'asdfasdf', registeredDate: '2025-10-26', status: 'active', checked: false },
    { id: 5, no: 5, username: 'dsafs', userId: '4321', name: '-', phone: 'edfdasdfasfdsa', registeredDate: '2025-10-26', status: 'active', checked: false },
    { id: 6, no: 6, username: '1234', userId: '1234', name: '-', phone: '1234', registeredDate: '2025-10-26', status: 'active', checked: false },
    { id: 7, no: 7, username: '김타자', userId: 'admin', name: '남자', phone: '010-1111-2222', registeredDate: '2025-10-26', status: 'active', checked: false }
  ]);

  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // API 호출하여 회원 목록 가져오기
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      // 실제 API 호출 구현
      // const response = await adminService.getUsers({ page: currentPage, size: itemsPerPage });
      // setUsers(response.data);
    } catch (error) {
      console.error('회원 목록 조회 실패:', error);
    }
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setUsers(users.map(user => ({ ...user, checked })));
  };

  const handleSelectUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, checked: !user.checked } : user
    ));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // 검색 API 호출
    console.log('검색어:', searchTerm);
  };

  const handleDeleteSelected = () => {
    const selectedUsers = users.filter(user => user.checked);
    if (selectedUsers.length === 0) {
      alert('삭제할 회원을 선택해주세요.');
      return;
    }
    
    if (window.confirm(`선택한 ${selectedUsers.length}명의 회원을 삭제하시겠습니까?`)) {
      // 삭제 API 호출
      console.log('삭제할 회원:', selectedUsers);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  return (
    <div className="admin-user-list">
      <AdminSidebar />
      
      <div className="user-list-main">
        <div className="page-header">
          <h1>User List</h1>
          
          <div className="search-box">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="이름 또는 아이디를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="search-btn">🔍</button>
            </form>
          </div>
        </div>

        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>No</th>
                <th>이름</th>
                <th>ID</th>
                <th>성별</th>
                <th>연락처</th>
                <th>생년월일</th>
                <th>가입일자</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={user.checked}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td>{user.no}</td>
                  <td>{user.username}</td>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
                  <td>-</td>
                  <td>{user.registeredDate}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="no-data">
              <p>등록된 회원이 없습니다.</p>
            </div>
          )}
        </div>

        <div className="table-footer">
          <button className="delete-btn" onClick={handleDeleteSelected}>
            삭제
          </button>
          
          <div className="pagination">
            <button 
              className="page-btn"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              이전
            </button>
            <span className="page-info">{currentPage}</span>
            <button 
              className="page-btn"
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
