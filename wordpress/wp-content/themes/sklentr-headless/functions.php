<?php
/**
 * Sklentr Headless Theme Functions
 *
 * Configures WordPress as a headless CMS:
 * - Registers Custom Post Types
 * - Registers ACF field groups for all CPTs
 * - Custom admin settings pages for homepage sections
 * - Enables CORS for the Next.js frontend
 * - Registers navigation menus
 * - Triggers ISR revalidation on content updates
 */

// Load Custom Post Types
require_once get_template_directory() . '/inc/custom-post-types.php';

// Load ACF Field Groups for CPTs
require_once get_template_directory() . '/inc/acf-field-groups.php';

// Load Site Options (custom settings pages)
require_once get_template_directory() . '/inc/site-options.php';

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

    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');

    // Elementor support
    add_theme_support('elementor');
    add_theme_support('header-footer-elementor');
});

// =============================================================================
// Elementor Configuration
// =============================================================================

// Enable Elementor for pages and posts
add_action('init', function () {
    $cpt_support = get_option('elementor_cpt_support');
    if (!is_array($cpt_support) || !in_array('page', $cpt_support)) {
        update_option('elementor_cpt_support', ['page', 'post']);
    }

    // Disable Elementor default colors/fonts to avoid conflicts
    update_option('elementor_disable_color_schemes', 'yes');
    update_option('elementor_disable_typography_schemes', 'yes');
}, 5);

// =============================================================================
// ISR Revalidation on Content Save
// =============================================================================

add_action('save_post', function ($post_id, $post) {
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
        return;
    }

    if ($post->post_status !== 'publish') {
        return;
    }

    $frontend_url = defined('HEADLESS_FRONTEND_URL')
        ? HEADLESS_FRONTEND_URL
        : 'http://localhost:3000';

    $revalidation_secret = defined('REVALIDATION_SECRET')
        ? REVALIDATION_SECRET
        : 'local-dev-secret-change-in-production';

    $tag_map = [
        'post'              => 'posts',
        'page'              => 'pages',
        'portfolio'         => 'portfolio',
        'service'           => 'services',
        'testimonial'       => 'testimonials',
        'team_member'       => 'team',
        'pricing_plan'      => 'pricing',
        'faq'               => 'faqs',
        'gallery'           => 'galleries',
        'elementor_library' => 'theme-templates',
    ];

    $tag = isset($tag_map[$post->post_type])
        ? $tag_map[$post->post_type]
        : 'pages';

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
// Add ACF fields to REST API
// =============================================================================

function sklentr_get_acf_data($post_id, $post_type) {
    if (function_exists('get_fields')) {
        $fields = get_fields($post_id);
        if ($fields && is_array($fields)) {
            return $fields;
        }
    }

    // Fallback: read postmeta directly when ACF plugin is not active
    $field_map = [
        'portfolio'     => ['industry', 'client_challenge', 'our_solution', 'results_summary', 'dev_time', 'project_url', 'featured_home', 'display_order'],
        'service'       => ['icon_name', 'timeline', 'starting_price', 'display_order'],
        'testimonial'   => ['quote', 'client_name', 'client_role', 'company_name', 'display_order'],
        'team_member'   => ['position', 'department', 'location', 'bio', 'linkedin_url', 'display_order'],
        'pricing_plan'  => ['price', 'price_range', 'timeline', 'is_popular', 'features_count', 'design_type', 'pages_screens', 'revisions', 'support_duration', 'cta_text', 'cta_link', 'display_order'],
        'faq'           => ['question', 'answer', 'page_context', 'display_order'],
    ];

    // Repeater field definitions: meta_key => [count_key, sub_fields]
    $repeater_map = [
        'portfolio'    => ['tech_stack' => ['technology'], 'gallery_images' => ['image', 'caption']],
        'service'      => ['sub_services' => ['name'], 'detailed_features' => ['item']],
        'pricing_plan' => ['inclusions' => ['item'], 'exclusions' => ['item']],
    ];

    $keys = $field_map[$post_type] ?? null;
    if (!$keys) return null;

    $meta = get_post_meta($post_id);
    if (empty($meta)) return null;

    $data = [];
    $has_data = false;

    foreach ($keys as $key) {
        if (isset($meta[$key][0])) {
            $val = $meta[$key][0];
            // Cast numeric-looking values
            if ($key === 'display_order' || $key === 'is_popular' || $key === 'featured_home') {
                $val = intval($val);
            }
            $data[$key] = $val;
            $has_data = true;
        }
    }

    // Handle repeater fields - check for serialized arrays or ACF indexed format
    $repeaters = $repeater_map[$post_type] ?? [];
    foreach ($repeaters as $repeater_key => $sub_fields) {
        if (isset($meta[$repeater_key][0])) {
            $raw = $meta[$repeater_key][0];
            // Try PHP serialized array first
            $unserialized = @unserialize($raw);
            if (is_array($unserialized)) {
                $data[$repeater_key] = $unserialized;
                $has_data = true;
                continue;
            }
            // Try ACF indexed format (count stored as integer)
            $count = intval($raw);
            if ($count > 0) {
                $items = [];
                for ($i = 0; $i < $count; $i++) {
                    $item = [];
                    foreach ($sub_fields as $sf) {
                        $mk = "{$repeater_key}_{$i}_{$sf}";
                        $item[$sf] = $meta[$mk][0] ?? '';
                    }
                    $items[] = $item;
                }
                $data[$repeater_key] = $items;
                $has_data = true;
            }
        }
    }

    return $has_data ? $data : null;
}

add_action('rest_api_init', function () {
    $all_types = ['portfolio', 'service', 'testimonial', 'team_member', 'pricing_plan', 'faq', 'gallery', 'post', 'page'];

    foreach ($all_types as $post_type) {
        register_rest_field($post_type, 'acf', [
            'get_callback' => function ($object) use ($post_type) {
                return sklentr_get_acf_data($object['id'], $post_type);
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
// REST API: Page content with Elementor CSS paths
// =============================================================================

add_action('rest_api_init', function () {
    // Add Elementor CSS URL to page responses
    register_rest_field('page', 'elementor_css_url', [
        'get_callback' => function ($object) {
            $post_id = $object['id'];
            $upload_dir = wp_upload_dir();
            $css_file = $upload_dir['basedir'] . '/elementor/css/post-' . $post_id . '.css';
            if (file_exists($css_file)) {
                return $upload_dir['baseurl'] . '/elementor/css/post-' . $post_id . '.css';
            }
            return null;
        },
        'schema' => ['type' => 'string'],
    ]);

    // Add featured image URL to pages
    register_rest_field('page', 'featured_image_url', [
        'get_callback' => function ($object) {
            $image_id = get_post_thumbnail_id($object['id']);
            if ($image_id) {
                return wp_get_attachment_image_url($image_id, 'full');
            }
            return null;
        },
        'schema' => ['type' => 'string'],
    ]);

    // Custom endpoint: fetch page by slug with Elementor assets
    register_rest_route('sklentr/v1', '/page/(?P<slug>[a-zA-Z0-9-]+)', [
        'methods'             => 'GET',
        'callback'            => 'sklentr_get_page_by_slug',
        'permission_callback' => '__return_true',
    ]);
});

function sklentr_get_page_by_slug($request) {
    $slug = $request->get_param('slug');

    $pages = get_posts([
        'name'        => $slug,
        'post_type'   => 'page',
        'post_status' => 'publish',
        'numberposts' => 1,
    ]);

    if (empty($pages)) {
        return new WP_Error('not_found', 'Page not found', ['status' => 404]);
    }

    $page = $pages[0];
    $post_id = $page->ID;

    // Determine if this is a real Elementor page (has mode AND data)
    $elementor_mode = get_post_meta($post_id, '_elementor_edit_mode', true);
    $elementor_data = get_post_meta($post_id, '_elementor_data', true);
    $is_elementor = ($elementor_mode === 'builder') && !empty($elementor_data);

    $content = '';
    $css_urls = [];

    if ($is_elementor && class_exists('\Elementor\Plugin')) {
        // Use Elementor's own rendering for proper output
        $document = \Elementor\Plugin::$instance->documents->get($post_id);
        if ($document) {
            // Ensure Elementor CSS is generated
            $css = \Elementor\Core\Files\CSS\Post::create($post_id);
            $css->enqueue();

            // Get the rendered content through Elementor
            $content = \Elementor\Plugin::$instance->frontend->get_builder_content_for_display($post_id);
        }

        if (empty($content)) {
            // Fallback to the_content filters
            $content = apply_filters('the_content', $page->post_content);
        }
    } else {
        // Standard WordPress content
        $content = apply_filters('the_content', $page->post_content);
    }

    // Rewrite internal WordPress URLs to frontend paths
    $wp_url = untrailingslashit(home_url());
    if (!empty($content)) {
        $content = str_replace(
            'href="' . $wp_url . '"',
            'href="/"',
            $content
        );
        $content = preg_replace_callback(
            '#href=["\']' . preg_quote($wp_url, '#') . '(/[^"\']*?)["\']#',
            function ($matches) {
                $path = rtrim($matches[1], '/');
                if (empty($path)) $path = '/';
                return 'href="' . $path . '"';
            },
            $content
        );
    }

    // Collect all Elementor CSS file URLs
    $upload_dir = wp_upload_dir();

    // Post-specific Elementor CSS
    $post_css_file = $upload_dir['basedir'] . '/elementor/css/post-' . $post_id . '.css';
    $post_css_url = file_exists($post_css_file)
        ? $upload_dir['baseurl'] . '/elementor/css/post-' . $post_id . '.css'
        : null;

    // Global Elementor CSS
    $global_css_file = $upload_dir['basedir'] . '/elementor/css/global.css';
    $global_css_url = file_exists($global_css_file)
        ? $upload_dir['baseurl'] . '/elementor/css/global.css'
        : null;

    // Elementor frontend CSS
    $elementor_frontend_css = null;
    if (defined('ELEMENTOR_URL')) {
        $elementor_frontend_css = ELEMENTOR_URL . 'assets/css/frontend.min.css';
    }

    // Elementor Pro frontend CSS
    $elementor_pro_css = null;
    if (defined('ELEMENTOR_PRO_URL')) {
        $elementor_pro_css = ELEMENTOR_PRO_URL . 'assets/css/frontend.min.css';
    }

    // Collect inline CSS from Elementor (custom styles embedded in page)
    $inline_css = '';
    if ($is_elementor) {
        $css_meta = get_post_meta($post_id, '_elementor_css', true);
        if (!empty($css_meta) && isset($css_meta['value'])) {
            // Elementor caches CSS in meta
        }
        // Also try to read the generated CSS file content for inline embedding
        if (file_exists($post_css_file)) {
            $inline_css = file_get_contents($post_css_file);
        }
    }

    return rest_ensure_response([
        'id'              => $post_id,
        'slug'            => $page->post_name,
        'title'           => $page->post_title,
        'content'         => $content,
        'excerpt'         => $page->post_excerpt,
        'status'          => $page->post_status,
        'featured_image'  => get_the_post_thumbnail_url($post_id, 'full') ?: null,
        'elementor_css'   => $post_css_url,
        'global_css'      => $global_css_url,
        'frontend_css'    => $elementor_frontend_css,
        'pro_css'         => $elementor_pro_css,
        'inline_css'      => $inline_css,
        'is_elementor'    => $is_elementor,
        'modified'        => $page->post_modified_gmt,
    ]);
}

// =============================================================================
// REST API: Elementor Theme Builder templates (header/footer)
// =============================================================================

add_action('rest_api_init', function () {
    register_rest_route('sklentr/v1', '/theme-template/(?P<type>header|footer)', [
        'methods'             => 'GET',
        'callback'            => 'sklentr_get_theme_template',
        'permission_callback' => '__return_true',
    ]);
});

function sklentr_get_theme_template($request) {
    $type = $request->get_param('type'); // 'header' or 'footer'

    if (!class_exists('\Elementor\Plugin')) {
        return rest_ensure_response([
            'content'      => '',
            'inline_css'   => '',
            'frontend_css' => null,
            'pro_css'      => null,
            'global_css'   => null,
            'elementor_css' => null,
            'found'        => false,
        ]);
    }

    // Find the active Elementor Theme Builder template for this type
    $template_id = null;

    // Method 1: Query elementor_library for the template type
    $templates = get_posts([
        'post_type'   => 'elementor_library',
        'post_status' => 'publish',
        'numberposts' => 10,
        'meta_query'  => [
            [
                'key'   => '_elementor_template_type',
                'value' => $type,
            ],
        ],
        'orderby'     => 'date',
        'order'       => 'DESC',
    ]);

    if (!empty($templates)) {
        // Check for active display conditions via Elementor Pro Theme Builder
        if (class_exists('\ElementorPro\Modules\ThemeBuilder\Module')) {
            $theme_builder = \ElementorPro\Modules\ThemeBuilder\Module::instance();
            $conditions_manager = $theme_builder->get_conditions_manager();

            foreach ($templates as $template) {
                // Check if this template has an "include/entire_site" condition
                $conditions = get_post_meta($template->ID, '_elementor_conditions', true);
                if (!empty($conditions) && is_array($conditions)) {
                    $template_id = $template->ID;
                    break;
                }
            }
        }

        // Fallback: use the most recent template of this type
        if (!$template_id) {
            $template_id = $templates[0]->ID;
        }
    }

    if (!$template_id) {
        return rest_ensure_response([
            'content'      => '',
            'inline_css'   => '',
            'frontend_css' => null,
            'pro_css'      => null,
            'global_css'   => null,
            'elementor_css' => null,
            'found'        => false,
        ]);
    }

    // Ensure Elementor frontend is initialized
    if (!\Elementor\Plugin::$instance->frontend->has_elementor_in_page()) {
        \Elementor\Plugin::$instance->frontend->register_styles();
        \Elementor\Plugin::$instance->frontend->enqueue_styles();
    }

    // Generate CSS for this template
    $css = \Elementor\Core\Files\CSS\Post::create($template_id);
    $css->enqueue();

    // Render the template content
    $content = \Elementor\Plugin::$instance->frontend->get_builder_content_for_display($template_id);

    // Rewrite internal WordPress URLs to frontend paths
    $wp_url = untrailingslashit(home_url());
    $frontend_url = defined('HEADLESS_FRONTEND_URL')
        ? untrailingslashit(HEADLESS_FRONTEND_URL)
        : 'http://localhost:3000';

    if (!empty($content)) {
        // Replace href links pointing to WordPress pages with frontend paths
        // e.g. http://localhost/.../wordpress/about/ → /about
        // Also handle the bare WordPress URL (home link) → /
        $content = str_replace(
            'href="' . $wp_url . '"',
            'href="/"',
            $content
        );
        $content = preg_replace_callback(
            '#href=["\']' . preg_quote($wp_url, '#') . '(/[^"\']*?)["\']#',
            function ($matches) {
                $path = rtrim($matches[1], '/');
                if (empty($path)) $path = '/';
                return 'href="' . $path . '"';
            },
            $content
        );

        // Rewrite srcset URLs to keep images pointing to WordPress
        // (images should NOT be rewritten — they live on WP server)
    }

    // Collect CSS assets
    $upload_dir = wp_upload_dir();

    $post_css_file = $upload_dir['basedir'] . '/elementor/css/post-' . $template_id . '.css';
    $post_css_url = file_exists($post_css_file)
        ? $upload_dir['baseurl'] . '/elementor/css/post-' . $template_id . '.css'
        : null;

    $global_css_file = $upload_dir['basedir'] . '/elementor/css/global.css';
    $global_css_url = file_exists($global_css_file)
        ? $upload_dir['baseurl'] . '/elementor/css/global.css'
        : null;

    $elementor_frontend_css = defined('ELEMENTOR_URL')
        ? ELEMENTOR_URL . 'assets/css/frontend.min.css'
        : null;

    $elementor_pro_css = defined('ELEMENTOR_PRO_URL')
        ? ELEMENTOR_PRO_URL . 'assets/css/frontend.min.css'
        : null;

    $inline_css = '';
    if (file_exists($post_css_file)) {
        $inline_css = file_get_contents($post_css_file);
    }

    // Collect JS assets for interactive widgets (nav menu toggle, sticky, etc.)
    $elementor_frontend_js = defined('ELEMENTOR_URL')
        ? ELEMENTOR_URL . 'assets/js/frontend.min.js'
        : null;
    $elementor_pro_js = defined('ELEMENTOR_PRO_URL')
        ? ELEMENTOR_PRO_URL . 'assets/js/frontend.min.js'
        : null;

    return rest_ensure_response([
        'content'       => $content ?: '',
        'inline_css'    => $inline_css,
        'frontend_css'  => $elementor_frontend_css,
        'pro_css'       => $elementor_pro_css,
        'global_css'    => $global_css_url,
        'elementor_css' => $post_css_url,
        'frontend_js'   => $elementor_frontend_js,
        'pro_js'        => $elementor_pro_js,
        'template_id'   => $template_id,
        'found'         => !empty($content),
    ]);
}

// =============================================================================
// Disable default WordPress frontend (redirect to Next.js)
// =============================================================================

add_action('template_redirect', function () {
    // Don't redirect in admin, AJAX, REST API, or Elementor contexts
    if (is_admin() || wp_doing_ajax() || (defined('REST_REQUEST') && REST_REQUEST)) {
        return;
    }

    // Allow Elementor preview & editor to render normally
    if (
        isset($_GET['elementor-preview']) ||
        isset($_GET['preview']) ||
        isset($_GET['preview_id']) ||
        (isset($_GET['action']) && $_GET['action'] === 'elementor') ||
        (class_exists('\Elementor\Plugin') && \Elementor\Plugin::$instance->preview->is_preview_mode())
    ) {
        return;
    }

    $frontend_url = defined('HEADLESS_FRONTEND_URL')
        ? HEADLESS_FRONTEND_URL
        : 'http://localhost:3000';

    wp_redirect($frontend_url);
    exit;
});
