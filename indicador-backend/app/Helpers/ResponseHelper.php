<?php
namespace App\Helpers;

class ResponseHelper {
    public static function success(string $msg, mixed $data = []): array {
        return [
            "message" => $msg,
            "status" => 'success',
            "data" => $data
        ];
    }
    public static function error(string $msg, $data = null): array {
        return [
            "message" => $msg,
            "status" => 'error',
            "data" => $data
        ];
    }
}
