<?php
/**
 * Sklentr Headless Theme
 *
 * This theme is intentionally minimal — it provides no frontend.
 * All rendering is handled by the Next.js frontend application.
 * WordPress is used exclusively as a headless CMS.
 */

// Redirect to the Next.js frontend
$frontend_url = defined('HEADLESS_FRONTEND_URL') ? HEADLESS_FRONTEND_URL : 'http://localhost:3000';
wp_redirect($frontend_url);
exit;
