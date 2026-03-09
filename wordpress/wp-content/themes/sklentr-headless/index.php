<?php
/**
 * Sklentr Headless Theme
 *
 * This theme is intentionally minimal — it provides no frontend.
 * All rendering is handled by the Next.js frontend application.
 * WordPress is used exclusively as a headless CMS.
 *
 * However, this template must exist and render content for:
 * - Elementor editor preview
 * - Elementor Canvas template
 * - WordPress preview mode
 */

// If Elementor preview or WP preview, let WordPress render normally
if (
    isset($_GET['elementor-preview']) ||
    isset($_GET['preview']) ||
    isset($_GET['preview_id']) ||
    (isset($_GET['action']) && $_GET['action'] === 'elementor')
) {
    get_header();
    while (have_posts()) {
        the_post();
        the_content();
    }
    get_footer();
    exit;
}

// Otherwise redirect to the Next.js frontend
$frontend_url = defined('HEADLESS_FRONTEND_URL') ? HEADLESS_FRONTEND_URL : 'http://localhost:3000';
wp_redirect($frontend_url);
exit;
