<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Laporan extends Model
{
    use HasFactory;

    protected $table = 'laporan';
    protected $fillable = ['pelapor_id', 'kategori_id', 'judul', 'isi_laporan', 'status'];

    public function kategori()
    {
        return $this->belongsTo(KategoriLaporan::class, 'kategori_id');
    }

    public function pelapor()
    {
        return $this->belongsTo(Pelapor::class, 'pelapor_id');
    }

    public function tanggapan()
    {
        return $this->hasMany(Tanggapan::class, 'laporan_id');
    }
}
