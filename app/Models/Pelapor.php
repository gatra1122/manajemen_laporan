<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pelapor extends Model
{
    use HasFactory;

    protected $table = 'pelapor';
    protected $fillable = ['nama', 'nik', 'telepon', 'alamat'];

    public function laporan()
    {
        return $this->hasMany(Laporan::class, 'pelapor_id');
    }
}
