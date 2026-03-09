<?php
/**
 * WordPress Configuration - Sklentr Headless
 */

// Database settings
define( 'DB_NAME', 'sklentr_headless' );
define( 'DB_USER', 'root' );
define( 'DB_PASSWORD', '' );
define( 'DB_HOST', 'localhost' );
define( 'DB_CHARSET', 'utf8mb4' );
define( 'DB_COLLATE', '' );

// Authentication keys and salts
define('AUTH_KEY',         ' EH@3*}[@ WU*_ve80WG]fd*hw@I]l4/ eQ7Q1t4F@!8x^]?4an9pS83[tQ( ocl');
define('SECURE_AUTH_KEY',  'h3w9X9]i:*x#m]@^j+XzS,-g|^h>t6d?NuVd|r<Yc;*.@z~e7%s*5iL+;a{pPh<*');
define('LOGGED_IN_KEY',    '3[R.y-{+DhZ(:|GFoB[&]_Zh!%_+3`-zITO]|[`~+/9+[.Nkrv}:e!K<kZ# F;Ru');
define('NONCE_KEY',        'M48_c7`59R?WE`*76ZyG*Bdu$%5!Lk^2hxL;`E(k<U%Nm-&bMq4|m9C9XMzV-{)x');
define('AUTH_SALT',        'j#Bx$ajdh+`s%3tVR1MEU!G(SC}<!g0:uU;#dfJ%CeW^G+gI?xRPsD7h++t#.uBA');
define('SECURE_AUTH_SALT', 'YRc|5/Z>q49m0ty%k9JV-Vz/DSukqS[EgVz-+8k-?)GgVtet!9nSw=)<c_hutN/%');
define('LOGGED_IN_SALT',   'Z+jrl,%MI@k#iu=^E=`fJM#+-9T5PZ!SJC|x3;Dh?A__8VA  HG^]wJm~|`X2H(}');
define('NONCE_SALT',       'fqc<Ks<D:BXbt`,4cP}p)S_n$[y.^g]^4-Ua` wJT<VSkzLI|do.re7S@4C+ycHW');

// Table prefix
$table_prefix = 'wp_';

// Headless mode settings
define( 'HEADLESS_FRONTEND_URL', 'http://localhost:3000' );
define( 'HEADLESS_REVALIDATION_SECRET', 'local-dev-secret-change-in-production' );

// Debug (disable in production)
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );

// Allow REST API from frontend
define( 'WP_HOME', 'http://localhost/sklentr/headless-WordPress/wordpress' );
define( 'WP_SITEURL', 'http://localhost/sklentr/headless-WordPress/wordpress' );

// Absolute path to the WordPress directory
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

// Sets up WordPress vars and included files
require_once ABSPATH . 'wp-settings.php';
