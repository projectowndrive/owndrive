<?php namespace OwnDrive\Http\Middleware;

use Closure;

class AddCors {

	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
        $response = $next($request);
        $response->headers->set('Access-control-Allow-origin', /*'*');*/\Config::get('app.url') . ':8000');
        $response->headers->set('Access-control-Allow-credentials', 'true');
        //dd($response);
        return $response;
	}




}
