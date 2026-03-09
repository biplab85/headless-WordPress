<?php
/**
 * Sklentr Headless Theme Functions
 *
 * Configures WordPress as a headless CMS:
 * - Registers Custom Post Types
 * - Enables CORS for the Next.js frontend
 * - Registers navigation menus
 * - Triggers ISR revalidation on content updates
 */

// Load Custom Post Types
require_once get_template_directory() . '/inc/custom-post-types.php';

// =============================================================================
// CORS Headers for REST API
// =============================================================================

add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');

    add_filter('rest_pre_serve_request', function ($value) {
        $origin = get_http_origin();
        $allowed_origins = [
            'http://localhost:3000',
            'https://www.sklentr.com',
        ];

        if ($origin && in_array($origin, $allowed_origins, true)) {
            header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
        }

        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Credentials: true');

        return $value;
    });
});

// =============================================================================
// Register Navigation Menu Locations
// =============================================================================

add_action('after_setup_theme', function () {
    register_nav_menus([
        'primary'         => __('Primary Menu', 'sklentr-headless'),
        'footer-company'  => __('Footer Company', 'sklentr-headless'),
        'footer-services' => __('Footer Services', 'sklentr-headless'),
        'footer-legal'    => __('Footer Legal', 'sklentr-headless'),
    ]);

    // Enable featured images
    add_theme_support('post-thumbnails');

    // Enable title tag
    add_theme_support('title-tag');
});

// =============================================================================
// ISR Revalidation on Content Save
// =============================================================================

add_action('save_post', function ($post_id, $post) {
    // Skip revisions and autosaves
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
        return;
    }

    // Skip non-published posts
    if ($post->post_status !== 'publish') {
        return;
    }

    $frontend_url = defined('HEADLESS_FRONTEND_URL')
        ? HEADLESS_FRONTEND_URL
        : 'http://localhost:3000';

    $revalidation_secret = defined('REVALIDATION_SECRET')
        ? REVALIDATION_SECRET
        : 'local-dev-secret-change-in-production';

    // Map post types to cache tags
    $tag_map = [
        'post'         => 'posts',
        'page'         => 'pages',
        'portfolio'    => 'portfolio',
        'service'      => 'services',
        'testimonial'  => 'testimonials',
        'team_member'  => 'team',
        'pricing_plan' => 'pricing',
        'faq'          => 'faqs',
    ];

    $tag = isset($tag_map[$post->post_type])
        ? $tag_map[$post->post_type]
        : 'pages';

    // Send revalidation request to Next.js
    wp_remote_post($frontend_url . '/api/revalidate', [
        'headers' => [
            'Content-Type'        => 'application/json',
            'x-revalidate-secret' => $revalidation_secret,
        ],
        'body'    => wp_json_encode(['tag' => $tag]),
        'timeout' => 5,
    ]);
}, 10, 2);

// =============================================================================
// Add ACF fields to REST API (fallback if ACF to REST API plugin not active)
// =============================================================================

add_action('rest_api_init', function () {
    $post_types = ['portfolio', 'service', 'testimonial', 'team_member', 'pricing_plan', 'faq'];

    foreach ($post_types as $post_type) {
        register_rest_field($post_type, 'acf', [
            'get_callback' => function ($object) {
                if (function_exists('get_fields')) {
                    return get_fields($object['id']);
                }
                return null;
            },
            'schema' => null,
        ]);
    }

    // Also for standard posts and pages
    foreach (['post', 'page'] as $type) {
        register_rest_field($type, 'acf', [
            'get_callback' => function ($object) {
                if (function_exists('get_fields')) {
                    return get_fields($object['id']);
                }
                return null;
            },
            'schema' => null,
        ]);
    }
});

// =============================================================================
// Customize REST API response - add Yoast data
// =============================================================================

add_action('rest_api_init', function () {
    $all_types = ['post', 'page', 'portfolio', 'service', 'testimonial', 'team_member', 'pricing_plan', 'faq'];

    foreach ($all_types as $type) {
        register_rest_field($type, 'yoast_head_json', [
            'get_callback' => function ($object) {
                if (!class_exists('WPSEO_Meta')) {
                    return null;
                }

                $post_id = $object['id'];
                return [
                    'title'          => get_post_meta($post_id, '_yoast_wpseo_title', true),
                    'description'    => get_post_meta($post_id, '_yoast_wpseo_metadesc', true),
                    'og_title'       => get_post_meta($post_id, '_yoast_wpseo_opengraph-title', true),
                    'og_description' => get_post_meta($post_id, '_yoast_wpseo_opengraph-description', true),
                ];
            },
            'schema' => null,
        ]);
    }
});

// =============================================================================
// Disable default WordPress frontend (redirect to Next.js)
// =============================================================================

add_action('template_redirect', function () {
    if (is_admin() || wp_doing_ajax() || (defined('REST_REQUEST') && REST_REQUEST)) {
        return;
    }

    $frontend_url = defined('HEADLESS_FRONTEND_URL')
        ? HEADLESS_FRONTEND_URL
        : 'http://localhost:3000';

    wp_redirect($frontend_url);
    exit;
});
