<?php

namespace App\Policies;

use App\Models\Pelapor;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PelaporPolicy
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
    public function view(User $user, Pelapor $pelapor): bool
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
            : Response::deny('Akses ditolak: hanya admin yang dapat menambah data.');
    }
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Pelapor $pelapor): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Akses ditolak: hanya admin yang dapat mengubah data.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Pelapor $pelapor): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Akses ditolak: hanya admin yang dapat menghapus data.');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Pelapor $pelapor): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Akses ditolak: hanya admin yang dapat memulihkan data.');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Pelapor $pelapor): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Akses ditolak: hanya admin yang dapat menghapus data secara permanen.');
    }
}
