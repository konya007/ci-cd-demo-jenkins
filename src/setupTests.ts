 
/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest'; // Import beforeEach từ vitest

// API gốc
const API_BASE_URL = 'https://konnn04.pythonanywhere.com/api';

// Kiểu dữ liệu mô phỏng
interface HouseListItem {
  id: number;
  title: string;
  address: string;
  base_price: string;
  area: number;
  max_people: number;
  thumbnail?: string | null;
  [k: string]: any;
}

interface HouseDetail extends HouseListItem {
  description?: string | null;
  deposit: string;
  water_price: string;
  electricity_price: string;
  internet_price: string;
  trash_price: string;
  is_renting: boolean;
  is_verified: boolean;
  owner: {
    full_name: string;
    role: string;
    avatar_thumbnail?: string;
    is_verified: boolean;
    [k: string]: any;
  };
  media?: { image?: string; thumbnail?: string }[];
}

// Mock dataset đơn giản cho tất cả test
const houses: HouseListItem[] = [
  {
    id: 1,
    title: 'Nhà Test 1',
    address: '123 Đường Test, Quận Test',
    base_price: '1500000.00',
    area: 60,
    max_people: 5,
    thumbnail: 'https://via.placeholder.com/300x200?text=House+1',
  },
  {
    id: 2,
    title: 'Nhà Test 2',
    address: '456 Đường Test, Quận Test',
    base_price: '2000000.00',
    area: 45,
    max_people: 3,
    thumbnail: 'https://via.placeholder.com/300x200?text=House+2',
  },
];

const houseDetails: Record<number, HouseDetail> = {
  1: {
    ...houses[0],
    description: 'Mô tả chi tiết nhà test 1. Đây là một căn nhà đẹp và tiện nghi.',
    deposit: '3000000.00',
    water_price: '100000.00',
    electricity_price: '200000.00',
    internet_price: '50000.00',
    trash_price: '20000.00',
    is_renting: true,
    is_verified: true,
    owner: {
      full_name: 'Test User',
      role: 'owner',
      avatar_thumbnail: '',
      is_verified: true,
    },
    media: [{ image: 'https://via.placeholder.com/800x400?text=House+1+Detail' }],
  },
  2: {
    ...houses[1],
    description: 'Mô tả chi tiết nhà test 2. Căn hộ hiện đại với nhiều tiện ích.',
    deposit: '4000000.00',
    water_price: '120000.00',
    electricity_price: '250000.00',
    internet_price: '70000.00',
    trash_price: '25000.00',
    is_renting: true,
    is_verified: false,
    owner: {
      full_name: 'Test User 2',
      role: 'owner',
      avatar_thumbnail: '',
      is_verified: false,
    },
    media: [{ image: 'https://via.placeholder.com/800x400?text=House+2+Detail' }],
  },
};

// Hàm tiện ích tạo Response mô phỏng
const jsonResponse = (data: any, init?: ResponseInit) =>
  new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

// Mock fetch mặc định
beforeEach(() => { // Đây là beforeEach của Vitest
  vi.restoreAllMocks();
  globalThis.fetch = vi.fn(async (input: RequestInfo | URL) => {
    const url = input.toString();

    // Danh sách nhà có thể có query ?page ?page_size -> ta chỉ trả luôn full (đơn giản)
    if (url.startsWith(`${API_BASE_URL}/houses/`) && !/\/houses\/\d+\//.test(url)) {
      return jsonResponse({
        count: houses.length,
        next: null,
        previous: null,
        results: houses,
      });
    }

    // Chi tiết
    const matchDetail = url.match(/\/houses\/(\d+)\//);
    if (matchDetail) {
      const id = Number(matchDetail[1]);
      const detail = houseDetails[id];
      if (detail) return jsonResponse(detail);
      return jsonResponse({ detail: 'Not found' }, { status: 404 });
    }

    // Fallback
    return jsonResponse({ message: 'Unhandled mock url', url }, { status: 500 });
  }) as any;
});

// Helper để test có thể ghi đè fetch (nếu cần lỗi)
export const mockFetchOnce = (impl: (url: string) => any) => {
  (globalThis.fetch as any) = vi.fn(async (input: RequestInfo | URL) => {
    const url = input.toString();
    return impl(url);
  });
};
