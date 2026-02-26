<?php

namespace App\Providers;

use App\Models\DataMaster\Barang;
use App\Models\DataMaster\Kategori;
use App\Models\DataMaster\Supplier;
use App\Models\KategoriLaporan as KLap;
use App\Models\Pelapor;
use App\Models\User;
use App\Policies\BarangPolicy;
use App\Policies\KategoriLaporanPolicy;
use App\Policies\PelaporPolicy;
use App\Policies\SupplierPolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     */
    protected $policies = [
        KLap::class => KategoriLaporanPolicy::class,
        Pelapor::class => PelaporPolicy::class,
        // Supplier::class => SupplierPolicy::class,
        // Barang::class => BarangPolicy::class,
        User::class => UserPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
