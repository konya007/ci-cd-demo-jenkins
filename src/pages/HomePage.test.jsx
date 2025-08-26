import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import HomePage from './HomePage';
import { mockFetchOnce } from '../setupTests';

describe('HomePage', () => {
  it('hiển thị trạng thái loading ban đầu', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    expect(screen.getByText(/Đang tải danh sách nhà/i)).toBeInTheDocument();
  });

  it('hiển thị danh sách nhà sau khi fetch thành công', async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Đang tải danh sách nhà/i)).not.toBeInTheDocument();
      expect(screen.getByText('Nhà Test 1')).toBeInTheDocument();
      expect(screen.getByText('1.500.000 VNĐ/tháng')).toBeInTheDocument();
      expect(screen.getByText('Nhà Test 2')).toBeInTheDocument();
      expect(screen.getByText('2.000.000 VNĐ/tháng')).toBeInTheDocument();
    });
  });

  it('hiển thị thông báo lỗi nếu fetch thất bại', async () => {
    mockFetchOnce(() =>
      new Response(JSON.stringify({ message: 'Internal Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Lỗi: Không thể tải danh sách nhà. Vui lòng thử lại sau./i)
      ).toBeInTheDocument();
    });
  });
});