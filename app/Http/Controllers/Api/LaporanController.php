<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Laporan;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);
        $search = $request->query('search');

        $query = Laporan::with(['pelapor', 'kategori'])
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('judul', 'ILIKE', "%{$search}%")
                        ->orWhere('isi_laporan', 'ILIKE', "%{$search}%");
                });
            })
            ->orderByDesc('updated_at');

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'message' => 'Semua data laporan berhasil diambil.',
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
    public function store(Request $request, Laporan $lapo)
    {
        Gate::authorize('create', $lapo);

        $validated = $request->validate([
            'pelapor_id'   => 'required|exists:pelapor,id',
            'kategori_id'  => 'required|exists:kategori_laporan,id',
            'judul'        => 'required|string|max:255',
            'isi_laporan'  => 'required|string',
            'status'       => 'nullable|in:Diajukan,Diproses,Selesai,Ditolak',
        ]);
        $data = Laporan::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data pelapor berhasil ditambahkan.',
            'data' => $data,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = Laporan::findOrFail($id);
        return response()->json([
            'success' => true,
            'message' => 'Data laporan berhasil diambil.',
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
    public function update(Request $request, Laporan $lapo)
    {
        Gate::authorize('update', $lapo);

        $validated = $request->validate([
            'pelapor_id'   => 'required|exists:pelapor,id',
            'kategori_id'  => 'required|exists:kategori_laporan,id',
            'judul'        => 'required|string|max:255',
            'isi_laporan'  => 'required|string',
            'status'       => 'nullable|in:Diajukan,Diproses,Selesai,Ditolak',
        ]);

        $lapo->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data laporan berhasil diubah.',
            'data' => $lapo,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Laporan $lapo)
    {
        Gate::authorize('delete', $lapo);

        $lapo->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data laporan berhasil dihapus.',
        ]);
    }
}
