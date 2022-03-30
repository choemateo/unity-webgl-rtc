<?php

namespace App\Http\Middleware;

use Closure;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
  /*  public function handle($request, Closure $next)
    {
        return $next($request);
    }
	*/
	public function handle($request, Closure $next)
	{
		return $next($request)
			->header('Access-Control-Allow-Origin', '*')
			->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
			->header('Access-Control-Allow-Headers', 'Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control, X-Requested-With,  X-Token-Auth, Authorization');
	}

}
