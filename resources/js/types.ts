export type UserType = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  password: string;
  remember_token: string;
  created_at: string;
  updated_at: string;
  role: string;
};

export type PelaporType = {
  id: number;
  nama: string;
  email: string;
  telepon: string;
  created_at: string;
  updated_at: string;
};

export type KategoriLaporanType = {
  id: number;
  nama: string;
  created_at: string;
  updated_at: string;
};

export type SupplierType = {
  id: number;
  supplier: string;
  alamat: string;
  kontak: string;
  email: string;
  deskripsi: string;
  created_at: string;
  updated_at: string;
};