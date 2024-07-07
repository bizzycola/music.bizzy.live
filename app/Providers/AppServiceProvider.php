<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\CdnService;
use App\Services\DOCdnService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Bind DigitalOcean CDN service
        $this->app->bind(CdnService::class, DOCdnService::class);
    }
}
