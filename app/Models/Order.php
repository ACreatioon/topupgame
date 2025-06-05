<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'game',
        'user_id',
        'zone_id',
        'product_code',
        'payment_method',
        'price'
    ];
}
