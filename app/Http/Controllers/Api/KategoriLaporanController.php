<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\KategoriLaporan as KLap;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Carbon\Carbon;
use Illuminate\Support\Str;

class KategoriLaporanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);
        $search = $request->query('search');

        $query = KLap::query()
            ->when($search, fn($q) => $q->where('nama', 'ILIKE', "%{$search}%"))
            ->orderByDesc('updated_at');
        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'message' => 'Semua data kategori laporan berhasil diambil.',
            'data' => $data,
        ]);
    }

    public function list()
    {
        $data = KLap::select('id', 'nama')->get();
        return response()->json([
            'success' => true,
            'message' => 'Daftar kategori laporan berhasil diambil.',
            'data' => $data,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, KLap $klap)
    {
        Gate::authorize('create', $klap);

        $validated = $request->validate([
            'nama' => 'required|string|max:100',
        ]);
        $data = KLap::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data kategori laporan berhasil ditambahkan.',
            'data' => $data,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = KLap::findOrFail($id);
        return response()->json([
            'success' => true,
            'message' => 'Data kategori laporan berhasil diambil.',
            'data' => $data,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, KLap $klap, string $id)
    {
        Gate::authorize('update', $klap);

        $data = KLap::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'required|string|max:100',
        ]);

        $data->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data kategori laporan berhasil diubah.',
            'data' => $data,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(KLap $klap, string $id)
    {
        Gate::authorize('delete', $klap);

        $data = KLap::findOrFail($id);
        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data kategori laporan berhasil dihapus.',
        ]);
    }
}
