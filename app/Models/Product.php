<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $guarded = ["id"];

    protected $with = ["kategori"];

    public function Kategori () {
        return $this->belongsTo(Kategori::class);
    }

    public function Variant () {
        return $this->hasMany(Variant::class);
    }

}
