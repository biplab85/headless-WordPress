<?php
/**
 * Custom Post Types for Sklentr Headless CMS
 *
 * Registers: Portfolio, Services, Testimonials, Team Members, Pricing Plans, FAQs
 * All CPTs have show_in_rest = true for REST API access.
 */

// =============================================================================
// Portfolio Projects
// =============================================================================

add_action('init', function () {
    register_post_type('portfolio', [
        'labels' => [
            'name'               => __('Portfolio', 'sklentr-headless'),
            'singular_name'      => __('Project', 'sklentr-headless'),
            'add_new'            => __('Add New Project', 'sklentr-headless'),
            'add_new_item'       => __('Add New Project', 'sklentr-headless'),
            'edit_item'          => __('Edit Project', 'sklentr-headless'),
            'all_items'          => __('All Projects', 'sklentr-headless'),
            'search_items'       => __('Search Projects', 'sklentr-headless'),
            'not_found'          => __('No projects found', 'sklentr-headless'),
        ],
        'public'             => true,
        'has_archive'        => true,
        'rewrite'            => ['slug' => 'portfolio'],
        'show_in_rest'       => true,
        'rest_base'          => 'portfolio',
        'supports'           => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
        'menu_icon'          => 'dashicons-portfolio',
        'menu_position'      => 5,
    ]);
});

// =============================================================================
// Services
// =============================================================================

add_action('init', function () {
    register_post_type('service', [
        'labels' => [
            'name'               => __('Services', 'sklentr-headless'),
            'singular_name'      => __('Service', 'sklentr-headless'),
            'add_new'            => __('Add New Service', 'sklentr-headless'),
            'add_new_item'       => __('Add New Service', 'sklentr-headless'),
            'edit_item'          => __('Edit Service', 'sklentr-headless'),
            'all_items'          => __('All Services', 'sklentr-headless'),
            'search_items'       => __('Search Services', 'sklentr-headless'),
            'not_found'          => __('No services found', 'sklentr-headless'),
        ],
        'public'             => true,
        'has_archive'        => true,
        'rewrite'            => ['slug' => 'services'],
        'show_in_rest'       => true,
        'rest_base'          => 'services',
        'supports'           => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
        'menu_icon'          => 'dashicons-clipboard',
        'menu_position'      => 6,
    ]);
});

// =============================================================================
// Testimonials
// =============================================================================

add_action('init', function () {
    register_post_type('testimonial', [
        'labels' => [
            'name'               => __('Testimonials', 'sklentr-headless'),
            'singular_name'      => __('Testimonial', 'sklentr-headless'),
            'add_new'            => __('Add New Testimonial', 'sklentr-headless'),
            'add_new_item'       => __('Add New Testimonial', 'sklentr-headless'),
            'edit_item'          => __('Edit Testimonial', 'sklentr-headless'),
            'all_items'          => __('All Testimonials', 'sklentr-headless'),
            'search_items'       => __('Search Testimonials', 'sklentr-headless'),
            'not_found'          => __('No testimonials found', 'sklentr-headless'),
        ],
        'public'             => true,
        'has_archive'        => false,
        'show_in_rest'       => true,
        'rest_base'          => 'testimonials',
        'supports'           => ['title', 'custom-fields'],
        'menu_icon'          => 'dashicons-format-quote',
        'menu_position'      => 7,
    ]);
});

// =============================================================================
// Team Members
// =============================================================================

add_action('init', function () {
    register_post_type('team_member', [
        'labels' => [
            'name'               => __('Team Members', 'sklentr-headless'),
            'singular_name'      => __('Team Member', 'sklentr-headless'),
            'add_new'            => __('Add New Member', 'sklentr-headless'),
            'add_new_item'       => __('Add New Team Member', 'sklentr-headless'),
            'edit_item'          => __('Edit Team Member', 'sklentr-headless'),
            'all_items'          => __('All Team Members', 'sklentr-headless'),
            'search_items'       => __('Search Members', 'sklentr-headless'),
            'not_found'          => __('No members found', 'sklentr-headless'),
        ],
        'public'             => true,
        'has_archive'        => false,
        'show_in_rest'       => true,
        'rest_base'          => 'team-members',
        'supports'           => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'menu_icon'          => 'dashicons-groups',
        'menu_position'      => 8,
    ]);
});

// =============================================================================
// Pricing Plans
// =============================================================================

add_action('init', function () {
    register_post_type('pricing_plan', [
        'labels' => [
            'name'               => __('Pricing Plans', 'sklentr-headless'),
            'singular_name'      => __('Pricing Plan', 'sklentr-headless'),
            'add_new'            => __('Add New Plan', 'sklentr-headless'),
            'add_new_item'       => __('Add New Pricing Plan', 'sklentr-headless'),
            'edit_item'          => __('Edit Plan', 'sklentr-headless'),
            'all_items'          => __('All Plans', 'sklentr-headless'),
            'search_items'       => __('Search Plans', 'sklentr-headless'),
            'not_found'          => __('No plans found', 'sklentr-headless'),
        ],
        'public'             => true,
        'has_archive'        => false,
        'show_in_rest'       => true,
        'rest_base'          => 'pricing-plans',
        'supports'           => ['title', 'custom-fields'],
        'menu_icon'          => 'dashicons-money-alt',
        'menu_position'      => 9,
    ]);
});

// =============================================================================
// FAQs
// =============================================================================

add_action('init', function () {
    register_post_type('faq', [
        'labels' => [
            'name'               => __('FAQs', 'sklentr-headless'),
            'singular_name'      => __('FAQ', 'sklentr-headless'),
            'add_new'            => __('Add New FAQ', 'sklentr-headless'),
            'add_new_item'       => __('Add New FAQ', 'sklentr-headless'),
            'edit_item'          => __('Edit FAQ', 'sklentr-headless'),
            'all_items'          => __('All FAQs', 'sklentr-headless'),
            'search_items'       => __('Search FAQs', 'sklentr-headless'),
            'not_found'          => __('No FAQs found', 'sklentr-headless'),
        ],
        'public'             => true,
        'has_archive'        => false,
        'show_in_rest'       => true,
        'rest_base'          => 'faqs',
        'supports'           => ['title', 'custom-fields'],
        'menu_icon'          => 'dashicons-editor-help',
        'menu_position'      => 10,
    ]);
});
