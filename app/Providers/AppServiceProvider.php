<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Storage;
use App\Services\SettingService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(SettingService::class, function ($app) {
            return new SettingService();
        });

        // Shortcut alias
        $this->app->singleton('settings', function ($app) {
            return new SettingService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        try {
            // Only attempt to share settings if DB is available
            View::share('settings', app('settings')->all());
        } catch (\Exception $e) {
            // Skip settings during build or when DB is not ready
            View::share('settings', []);
            // Optionally log for debugging:
            // \Log::warning("Settings unavailable during boot: " . $e->getMessage());
        }
    }
}
