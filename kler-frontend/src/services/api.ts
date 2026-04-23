import type { LocationData, Device } from '../types/types';
import { jwtDecode } from 'jwt-decode';

// A backend URL-jét állítja be
export const ROOT_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
  : (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:3000` : 'http://localhost:3000');

export const API_BASE_URL = `${ROOT_URL}/api`;

// A token beállítása a header-be
const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// A token beolvasása a JWT-ből
const getUserRole = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.role || null;
  } catch {
    return null;
  }
};

// A felhasználónév beolvasása a JWT-ből
export const getUsername = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.username || null;
  } catch {
    return null;
  }
};


const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }

    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.message) errorMessage = errorData.message;
    } catch (e) {
      // Ignoráljuk
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
};

const fetchSafely = async <T>(endpoint: string, fallback: T): Promise<T> => {
  try {
    return await apiClient<T>(endpoint);
  } catch (error) {
    return fallback;
  }
};

export const fetchLocations = async (): Promise<LocationData[]> => {
  return fetchSafely<LocationData[]>('/sites/dashboard', []);
};

export const fetchDevicesData = async (): Promise<Device[]> => {
  try {
    const role = getUserRole();
    if (role !== 'ADMIN') return [];

    const devices = await fetchSafely<any[]>('/devices', []);

    if (!devices || devices.length === 0) return [];

    return devices.map((d: any) => {
      let status: 'active' | 'inactive' | 'maintenance' = 'inactive';
      if (['active', 'inactive', 'maintenance'].includes(d.status)) {
        status = d.status as any;
      }
      return {
        id: d.id.toString(),
        name: d.name || `Eszköz ${d.id}`,
        location: d.site ? d.site.name : 'Nincs helyhez rendelve',
        status,
        lastSeen: d.last_seen
          ? new Date(d.last_seen).toLocaleString('sv-SE').replace('T', ' ')
          : '-',
      };
    });
  } catch (error) {
    console.error('Hiba az eszközök betöltésekor:', error);
    return [];
  }
};

export const createDevice = async (data: any) => {
  return apiClient('/devices', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateDevice = async (id: number, data: any) => {
  return apiClient(`/devices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteDevice = async (id: number) => {
  return apiClient(`/devices/${id}`, {
    method: 'DELETE',
  });
};

export const createSite = async (data: any) => {
  return apiClient('/sites', {
    method: 'POST',
    body: JSON.stringify({ ...data, lat: parseFloat(data.lat), lon: parseFloat(data.lon) }),
  });
};

export const updateSite = async (id: number, data: any) => {
  return apiClient(`/sites/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, lat: parseFloat(data.lat), lon: parseFloat(data.lon) }),
  });
};

export const deleteSite = async (id: number) => {
  return apiClient(`/sites/${id}`, {
    method: 'DELETE',
  });
};

export const fetchAdminStats = async () => {
  const role = getUserRole();
  if (role !== 'ADMIN') return { totalUsers: 0, totalDevices: 0, activeDevices: 0 };
  return fetchSafely<any>(`${ROOT_URL}/admin/stats`, { totalUsers: 0, totalDevices: 0, activeDevices: 0 });
};

export const fetchUsers = async () => {
  const role = getUserRole();
  if (role !== 'ADMIN') return [];
  return fetchSafely<any[]>(`${ROOT_URL}/admin/users`, []);
};

export const updateUserRole = async (userId: number, newRole: string) => {
  return apiClient(`${ROOT_URL}/admin/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role: newRole }),
  });
};

export const deleteUser = async (userId: number) => {
  return apiClient(`${ROOT_URL}/admin/users/${userId}`, {
    method: 'DELETE',
  });
};

export const login = async (values: any) => {
  return apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: values.email,
      password: values.password
    }),
  });
};

export const register = async (values: any) => {
  return apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      username: values.username,
      email: values.email,
      password: values.password,
      role: values.role || 'USER',
    }),
  });
};
