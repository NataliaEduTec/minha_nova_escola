<?php

namespace App\Http\Middleware;

use App\Helpers\ResponseHelper;
use Closure;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->cookie('ind-token');

        if ($token) {
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }

        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json(ResponseHelper::error('Usuário não encontrado', ["error" => "401"]), 401);
            }

        } catch (TokenInvalidException $e) {
            return response()->json(ResponseHelper::error('Credenciais inválidas! Faça login para prosseguir.', ["error" => "401"]), 401);
        } catch (TokenExpiredException $e) {
            return response()->json(ResponseHelper::error('Sua sessão expirou! Faça login novamente.', ["error" => "401"]), 401);
        } catch (Exception $e) {
            return response()->json(ResponseHelper::error('Faça login para acessar este recurso.', ["error" => "401"]), 401);
        }

        return $next($request);
    }
}
