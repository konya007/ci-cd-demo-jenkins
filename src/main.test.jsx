import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HouseDetailPage from './pages/HouseDetailPage';

const AppWrapper = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/house/:id" element={<HouseDetailPage />} />
    </Routes>
  </BrowserRouter>
);

describe('Routing', () => {
  it('render HomePage ban đầu', async () => {
    render(<AppWrapper />);
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Danh sách nhà cho thuê/i })
      ).toBeInTheDocument();
    });
  });

  it('chuyển sang HouseDetailPage khi click', async () => {
    const user = userEvent.setup();
    render(<AppWrapper />);

    await waitFor(() => {
      expect(screen.getByText('Nhà Test 1')).toBeInTheDocument();
    });

    const link = screen.getByRole('link', { name: /Nhà Test 1/i });
    await user.click(link);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Nhà Test 1/i })).toBeInTheDocument();
    });
    expect(window.location.pathname).toBe('/house/1');
  });
});