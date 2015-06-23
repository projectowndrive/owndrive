<?php namespace OwnDrive\Http\Middleware;

use Closure;

class Auth {

	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
        if ($this->auth->guest())
        {
            return response('Unauthorized.', 401);
        }

		return $next($request);
	}

}
