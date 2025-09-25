<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ResponseHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    private int $cookie_expire = 60 * 24;

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            $response = ResponseHelper::error('Credenciais inválidas.', [
                'message' => 'Credenciais inválidas.',
            ]);
            return response()->json($response, 400);
        }

        $isSecur = $request->isSecure();

        $data = ResponseHelper::success('Login realizado!', [
            'user' => auth()->user(),
        ]);

        return response()
            ->json($data)
            ->cookie(
            'ind-token',
            $token,
            $this->cookie_expire,
            '/',
            null,
            $isSecur,
            true,
            false,
            'Strict'
        );
    }

    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(ResponseHelper::success('Deslogado com sucesso.'))->cookie('ind-token', null, -1);
        } catch (\Exception $e) {
            return response()->json(ResponseHelper::error('Falha ao deslogar.'), 500);
        }
    }

    public function refresh()
    {
        $token = JWTAuth::refresh(JWTAuth::getToken());
        return response()->json(compact('token'))->cookie('ind-token', $token, $this->cookie_expire, null, null, false, true);
    }
}
