import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import HouseDetailPage from './HouseDetailPage';
import { mockFetchOnce } from '../setupTests';

const renderWithRoute = (route = '/house/1') => {
  window.history.pushState({}, 'Test', route);
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/house/:id" element={<HouseDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
};

describe('HouseDetailPage', () => {
  it('loading ban đầu', () => {
    renderWithRoute('/house/1');
    expect(screen.getByText(/Đang tải chi tiết nhà/i)).toBeInTheDocument();
  });

  it('hiển thị dữ liệu sau fetch thành công', async () => {
    renderWithRoute('/house/1');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Nhà Test 1/i })).toBeInTheDocument();
      expect(screen.getByText(/1.500.000 VNĐ\/tháng/i)).toBeInTheDocument();
      expect(screen.getByText(/Mô tả chi tiết nhà test 1/i)).toBeInTheDocument();
    });
  });

  it('hiển thị thông báo lỗi nếu fetch thất bại (ví dụ 404)', async () => {
    mockFetchOnce((url) => {
      if (url.includes('/houses/999/')) {
        return new Response(JSON.stringify({ detail: 'Not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({}), { status: 500 });
    });

    renderWithRoute('/house/999');

    await waitFor(() => {
      expect(screen.getByText(/Lỗi: Không thể tải chi tiết nhà. Vui lòng thử lại sau./i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Quay lại trang chủ/i })).toBeInTheDocument();
    });
  });
});