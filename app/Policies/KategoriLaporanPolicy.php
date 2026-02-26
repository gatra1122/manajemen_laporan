<?php

namespace App\Policies;

use App\Models\KategoriLaporan as KLap;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class KategoriLaporanPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, KLap $klap): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Akses ditolak: hanya admin yang dapat membuat Kategori Laporan.');
    }
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, KLap $klap): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Akses ditolak: hanya admin yang dapat mengubah data Kategori Laporan.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, KLap $klap): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Akses ditolak: hanya admin yang dapat menghapus Kategori Laporan.');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, KLap $klap): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Akses ditolak: hanya admin yang dapat memulihkan Kategori Laporan.');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, KLap $klap): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Akses ditolak: hanya admin yang dapat menghapus Kategori Laporan secara permanen.');
    }
}
