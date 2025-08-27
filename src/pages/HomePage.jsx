import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const API_BASE_URL = "https://konnn04.pythonanywhere.com/api";

const DEFAULT_PAGE_SIZE = 12;

const HomePage = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0); 
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const sizeParam = parseInt(searchParams.get("page_size") || `${DEFAULT_PAGE_SIZE}`, 10);

  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const pageSize = isNaN(sizeParam) || sizeParam < 1 ? DEFAULT_PAGE_SIZE : sizeParam;

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  const updateQuery = (newPage, newSize = pageSize) => {
    const params = {};
    params.page = String(newPage);
    params.page_size = String(newSize);
    setSearchParams(params);
  };

  const fetchHouses = useCallback(async (currentPage, currentSize) => {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    try {
      const url = `${API_BASE_URL}/houses/?page=${currentPage}&page_size=${currentSize}`;
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();
      setHouses(data.results);
      setCount(data.count);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error fetching houses:", err);
        setError("Không thể tải danh sách nhà. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      updateQuery(1, pageSize);
      return;
    }
    fetchHouses(page, pageSize);
  }, [page, pageSize, fetchHouses, totalPages]);

  const handlePrev = () => {
    if (page > 1) updateQuery(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages) updateQuery(page + 1);
  };
  const handlePageSizeChange = (e) => {
    updateQuery(1, parseInt(e.target.value, 10));
  };

  const gotoPage = (p) => {
    if (p >= 1 && p <= totalPages && p !== page) updateQuery(p);
  };

  // Simple page window
  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, page - half);
  const end = Math.min(totalPages, start + windowSize - 1);
  if (end - start + 1 < windowSize) start = Math.max(1, end - windowSize + 1);

  if (loading) {
    return <div className="app-container">Đang tải danh sách nhà...</div>;
  }

  if (error) {
    return <div className="app-container" style={{ color: 'var(--color-failure)' }}>Lỗi: {error}</div>;
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>Danh sách nhà cho thuê</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            Hiển thị:
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              style={{ marginLeft: 8 }}
            >
              {[6, 12, 20, 30, 50].map(sz => (
                <option key={sz} value={sz}>{sz}/trang</option>
              ))}
            </select>
          </div>
          <div>
            Tổng: {count} nhà (Trang {page}/{totalPages})
          </div>
        </div>
      </header>

      <div className="house-list-container">
        {houses.map((house) => (
          <Link to={`/house/${house.id}`} key={house.id} className="house-card">
            {house?.thumbnail ? (
              <img src={house?.thumbnail} alt={house.title} />
            ) : (
              <img src="https://via.placeholder.com/300x200?text=No+Image" alt="No Image" />
            )}
            <div className="house-card-content">
              <h3>{house.title}</h3>
              <p>{house.address}</p>
              <p className="price">
                {Number(house.base_price).toLocaleString('vi-VN')} VNĐ/tháng
              </p>
              <p>Diện tích: {house.area} m²</p>
              <p>Số người tối đa: {house.max_people}</p>
            </div>
          </Link>
        ))}
        {houses.length === 0 && (
          <div style={{ padding: '2rem', width: '100%', textAlign: 'center' }}>
            Không có dữ liệu.
          </div>
        )}
      </div>

      <div className="pagination" style={{ marginTop: '2rem', display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => gotoPage(1)} disabled={page === 1}>⏮</button>
        <button onClick={handlePrev} disabled={page === 1}>Trước</button>

        {start > 1 && <button onClick={() => gotoPage(1)}>1</button>}
        {start > 2 && <span style={{ padding: '0 4px' }}>...</span>}

        {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(p => (
          <button
            key={p}
            onClick={() => gotoPage(p)}
            disabled={p === page}
            style={p === page ? { fontWeight: 'bold', background: 'var(--color-primary)', color: '#fff' } : {}}
          >
            {p}
          </button>
        ))}

        {end < totalPages - 1 && <span style={{ padding: '0 4px' }}>...</span>}
        {end < totalPages && <button onClick={() => gotoPage(totalPages)}>{totalPages}</button>}

        <button onClick={handleNext} disabled={page === totalPages}>Sau</button>
        <button onClick={() => gotoPage(totalPages)} disabled={page === totalPages}>⏭</button>
      </div>
    </div>
  );
};

export default HomePage;
