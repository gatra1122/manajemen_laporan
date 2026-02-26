<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Pelapor;
use Illuminate\Support\Facades\Gate;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class PelaporController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);
        $search = $request->query('search');

        $query = Pelapor::query()
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('nama', 'ILIKE', "%{$search}%")
                        ->orWhere('telepon', 'ILIKE', "%{$search}%");
                });
            })
            ->orderByDesc('updated_at');

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'message' => 'Semua data pelapor berhasil diambil.',
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
    public function store(Request $request, Pelapor $klap)
    {
        Gate::authorize('create', $klap);

        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'nik' => 'required|string|max:16',
            'telepon' => 'required|string|max:20',
            'alamat' => 'required|string|max:255',
        ]);
        $data = Pelapor::create($validated);

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
        $data = Pelapor::findOrFail($id);
        return response()->json([
            'success' => true,
            'message' => 'Data pelapor berhasil diambil.',
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
    public function update(Request $request, Pelapor $pelapor)
    {
        Gate::authorize('update', $pelapor);

        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'nik' => 'required|string|max:16',
            'telepon' => 'required|string|max:20',
            'alamat' => 'required|string|max:255',
        ]);

        $pelapor->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data pelapor berhasil diubah.',
            'data' => $pelapor,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pelapor $pelapor)
    {
        Gate::authorize('delete', $pelapor);

        $pelapor->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data pelapor berhasil dihapus.',
        ]);
    }
}
