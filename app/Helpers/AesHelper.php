<?php

namespace App\Helpers;

class AesHelper
{
    public static function encrypt($data)
    {
        $key = env('QRIS_AES_KEY'); 
        $iv = env('QRIS_AES_IV');

        $encrypted = openssl_encrypt(
            $data,
            'AES-256-CBC',
            $key,
            OPENSSL_RAW_DATA,
            $iv
        );

        return base64_encode($encrypted);
    }
}
