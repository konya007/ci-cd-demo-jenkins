import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = "https://konnn04.pythonanywhere.com/api";

const HouseDetailPage = () => {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("ID nhà không được cung cấp.");
      setLoading(false);
      return;
    }

    const fetchHouseDetail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/houses/${id}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHouse(data);
      } catch (err) {
        console.error("Error fetching house detail:", err);
        setError("Không thể tải chi tiết nhà. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchHouseDetail();
  }, [id]);

  if (loading) {
    return <div className="app-container">Đang tải chi tiết nhà...</div>;
  }

  if (error) {
    return (
      <div className="app-container" style={{ color: 'var(--color-failure)' }}>
        Lỗi: {error}
        <Link to="/" className="back-button">Quay lại trang chủ</Link>
      </div>
    );
  }

  if (!house) {
    return (
      <div className="app-container">
        <h1 style={{ color: 'var(--color-failure)' }}>Không tìm thấy nhà!</h1>
        <Link to="/" className="back-button">Quay lại trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Link to="/" className="back-button">Quay lại trang chủ</Link>
      <div className="house-detail-container">
        <h1>{house.title}</h1>
        {house.media && house.media.length > 0 ? (
          <img src={house.media[0].thumbnail} alt={house.title} />
        ) : (
          <img src="https://via.placeholder.com/800x400?text=No+Image" alt="No Image" />
        )}

        <h2>Thông tin cơ bản</h2>
        <p><span className="label">Địa chỉ:</span> {house.address}</p>
        <p><span className="label">Giá thuê:</span> <span className="price-detail">{parseFloat(house.base_price).toLocaleString('vi-VN')} VNĐ/tháng</span></p>
        <p><span className="label">Tiền cọc:</span> {parseFloat(house.deposit).toLocaleString('vi-VN')} VNĐ</p>
        <p><span className="label">Diện tích:</span> {house.area} m²</p>
        <p><span className="label">Loại hình:</span> {house.type === 'house' ? 'Nhà nguyên căn' : 'Phòng trọ'}</p>
        <p><span className="label">Số người tối đa:</span> {house.max_people}</p>
        <p><span className="label">Đang cho thuê:</span> {house.is_renting ? 'Có' : 'Không'}</p>
        <p><span className="label">Đã xác minh:</span> {house.is_verified ? '✅ Có' : '❌ Không'}</p>

        {house.description && (
          <>
            <h2>Mô tả</h2>
            <p>{house.description}</p>
          </>
        )}

        <h2>Chi phí khác (VNĐ/tháng)</h2>
        <p><span className="label">Tiền nước:</span> {parseFloat(house.water_price).toLocaleString('vi-VN')}</p>
        <p><span className="label">Tiền điện:</span> {parseFloat(house.electricity_price).toLocaleString('vi-VN')}</p>
        <p><span className="label">Tiền Internet:</span> {parseFloat(house.internet_price).toLocaleString('vi-VN')}</p>
        <p><span className="label">Tiền rác:</span> {parseFloat(house.trash_price).toLocaleString('vi-VN')}</p>

        <h2>Thông tin chủ nhà</h2>
        <div className="owner-info">
          <img src={house.owner.avatar_thumbnail || "https://via.placeholder.com/60"} alt={house.owner.full_name} />
          <div>
            <p className="owner-name">{house.owner.full_name}</p>
            <p>Vai trò: {house.owner.role}</p>
            <p>Đã xác minh: {house.owner.is_verified ? '✅' : '❌'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseDetailPage;
