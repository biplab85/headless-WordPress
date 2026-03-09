<?php
/**
 * ACF Field Groups for all Custom Post Types
 *
 * Registers field groups programmatically so they appear
 * in the admin editor for each CPT.
 */

add_action('acf/init', function () {
    if (!function_exists('acf_add_local_field_group')) return;

    // =========================================================================
    // Portfolio Fields
    // =========================================================================
    acf_add_local_field_group([
        'key'    => 'group_portfolio',
        'title'  => 'Portfolio Details',
        'fields' => [
            [
                'key'   => 'field_portfolio_industry',
                'label' => 'Industry',
                'name'  => 'industry',
                'type'  => 'text',
                'instructions' => 'e.g. Healthcare / AI, FinTech, AgriTech',
                'required' => 1,
            ],
            [
                'key'   => 'field_portfolio_client_challenge',
                'label' => 'Client Challenge',
                'name'  => 'client_challenge',
                'type'  => 'textarea',
                'rows'  => 3,
            ],
            [
                'key'   => 'field_portfolio_our_solution',
                'label' => 'Our Solution',
                'name'  => 'our_solution',
                'type'  => 'textarea',
                'rows'  => 3,
            ],
            [
                'key'   => 'field_portfolio_results',
                'label' => 'Results Summary',
                'name'  => 'results_summary',
                'type'  => 'textarea',
                'rows'  => 2,
            ],
            [
                'key'   => 'field_portfolio_dev_time',
                'label' => 'Development Time',
                'name'  => 'dev_time',
                'type'  => 'text',
                'instructions' => 'e.g. 3 weeks',
            ],
            [
                'key'        => 'field_portfolio_tech_stack',
                'label'      => 'Tech Stack',
                'name'       => 'tech_stack',
                'type'       => 'repeater',
                'layout'     => 'table',
                'sub_fields' => [
                    [
                        'key'   => 'field_portfolio_tech_item',
                        'label' => 'Technology',
                        'name'  => 'technology',
                        'type'  => 'text',
                    ],
                ],
            ],
            [
                'key'   => 'field_portfolio_project_url',
                'label' => 'Project URL',
                'name'  => 'project_url',
                'type'  => 'url',
            ],
            [
                'key'        => 'field_portfolio_gallery',
                'label'      => 'Project Gallery',
                'name'       => 'gallery_images',
                'type'       => 'repeater',
                'layout'     => 'block',
                'instructions' => 'Upload additional project screenshots/images',
                'sub_fields' => [
                    [
                        'key'           => 'field_portfolio_gallery_image',
                        'label'         => 'Image',
                        'name'          => 'image',
                        'type'          => 'image',
                        'return_format' => 'array',
                        'preview_size'  => 'medium',
                    ],
                    [
                        'key'   => 'field_portfolio_gallery_caption',
                        'label' => 'Caption',
                        'name'  => 'caption',
                        'type'  => 'text',
                    ],
                ],
            ],
            [
                'key'           => 'field_portfolio_featured',
                'label'         => 'Featured on Homepage',
                'name'          => 'featured_home',
                'type'          => 'true_false',
                'default_value' => 0,
                'ui'            => 1,
            ],
            [
                'key'           => 'field_portfolio_order',
                'label'         => 'Display Order',
                'name'          => 'display_order',
                'type'          => 'number',
                'default_value' => 0,
            ],
        ],
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'portfolio']]],
        'position' => 'normal',
        'style'    => 'default',
    ]);

    // =========================================================================
    // Service Fields
    // =========================================================================
    acf_add_local_field_group([
        'key'    => 'group_service',
        'title'  => 'Service Details',
        'fields' => [
            [
                'key'          => 'field_service_icon',
                'label'        => 'Service Icon',
                'name'         => 'service_icon',
                'type'         => 'image',
                'return_format' => 'array',
                'preview_size' => 'thumbnail',
                'instructions' => 'Upload a small icon image (SVG or PNG)',
            ],
            [
                'key'   => 'field_service_icon_name',
                'label' => 'Icon Name (Lucide)',
                'name'  => 'icon_name',
                'type'  => 'select',
                'choices' => [
                    'monitor'    => 'Monitor (Web/Mobile)',
                    'palette'    => 'Palette (Design)',
                    'search'     => 'Search (SEO)',
                    'megaphone'  => 'Megaphone (Ads)',
                    'video'      => 'Video (Production)',
                    'bar-chart'  => 'Bar Chart (Consultation)',
                    'code'       => 'Code (Development)',
                    'globe'      => 'Globe (International)',
                    'zap'        => 'Zap (Fast)',
                    'shield'     => 'Shield (Security)',
                ],
                'default_value' => 'monitor',
                'instructions'  => 'Choose a Lucide icon for the frontend',
            ],
            [
                'key'   => 'field_service_timeline',
                'label' => 'Timeline',
                'name'  => 'timeline',
                'type'  => 'text',
                'instructions' => 'e.g. 2-8 weeks, Ongoing',
            ],
            [
                'key'   => 'field_service_price',
                'label' => 'Starting Price',
                'name'  => 'starting_price',
                'type'  => 'text',
                'instructions' => 'e.g. From $5,000 CAD',
            ],
            [
                'key'        => 'field_service_sub_services',
                'label'      => 'Sub-Services',
                'name'       => 'sub_services',
                'type'       => 'repeater',
                'layout'     => 'table',
                'sub_fields' => [
                    [
                        'key'   => 'field_service_sub_name',
                        'label' => 'Name',
                        'name'  => 'name',
                        'type'  => 'text',
                    ],
                ],
            ],
            [
                'key'        => 'field_service_details',
                'label'      => 'Detailed Features',
                'name'       => 'detailed_features',
                'type'       => 'repeater',
                'layout'     => 'table',
                'instructions' => 'Full feature list for the services page',
                'sub_fields' => [
                    [
                        'key'   => 'field_service_detail_item',
                        'label' => 'Feature',
                        'name'  => 'item',
                        'type'  => 'text',
                    ],
                ],
            ],
            [
                'key'           => 'field_service_order',
                'label'         => 'Display Order',
                'name'          => 'display_order',
                'type'          => 'number',
                'default_value' => 0,
            ],
        ],
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'service']]],
        'position' => 'normal',
        'style'    => 'default',
    ]);

    // =========================================================================
    // Testimonial Fields
    // =========================================================================
    acf_add_local_field_group([
        'key'    => 'group_testimonial',
        'title'  => 'Testimonial Details',
        'fields' => [
            [
                'key'      => 'field_testimonial_quote',
                'label'    => 'Quote',
                'name'     => 'quote',
                'type'     => 'textarea',
                'rows'     => 4,
                'required' => 1,
            ],
            [
                'key'      => 'field_testimonial_client_name',
                'label'    => 'Client Name',
                'name'     => 'client_name',
                'type'     => 'text',
                'required' => 1,
            ],
            [
                'key'   => 'field_testimonial_client_role',
                'label' => 'Client Role',
                'name'  => 'client_role',
                'type'  => 'text',
                'instructions' => 'e.g. CEO, CTO, Founder',
            ],
            [
                'key'   => 'field_testimonial_company',
                'label' => 'Company Name',
                'name'  => 'company_name',
                'type'  => 'text',
            ],
            [
                'key'          => 'field_testimonial_photo',
                'label'        => 'Client Photo',
                'name'         => 'client_photo',
                'type'         => 'image',
                'return_format' => 'array',
                'preview_size' => 'thumbnail',
            ],
            [
                'key'           => 'field_testimonial_order',
                'label'         => 'Display Order',
                'name'          => 'display_order',
                'type'          => 'number',
                'default_value' => 0,
            ],
        ],
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'testimonial']]],
        'position' => 'normal',
        'style'    => 'default',
    ]);

    // =========================================================================
    // Team Member Fields
    // =========================================================================
    acf_add_local_field_group([
        'key'    => 'group_team_member',
        'title'  => 'Team Member Details',
        'fields' => [
            [
                'key'      => 'field_team_position',
                'label'    => 'Position / Role',
                'name'     => 'position',
                'type'     => 'text',
                'required' => 1,
                'instructions' => 'e.g. Founder & CEO, Lead Developer',
            ],
            [
                'key'   => 'field_team_department',
                'label' => 'Department',
                'name'  => 'department',
                'type'  => 'select',
                'choices' => [
                    'leadership'  => 'Leadership',
                    'engineering' => 'Engineering',
                    'design'      => 'Design',
                    'marketing'   => 'Marketing',
                    'operations'  => 'Operations',
                ],
            ],
            [
                'key'   => 'field_team_location',
                'label' => 'Location',
                'name'  => 'location',
                'type'  => 'text',
                'instructions' => 'e.g. Toronto, Canada',
            ],
            [
                'key'   => 'field_team_bio',
                'label' => 'Bio',
                'name'  => 'bio',
                'type'  => 'textarea',
                'rows'  => 3,
            ],
            [
                'key'   => 'field_team_linkedin',
                'label' => 'LinkedIn URL',
                'name'  => 'linkedin_url',
                'type'  => 'url',
            ],
            [
                'key'           => 'field_team_order',
                'label'         => 'Display Order',
                'name'          => 'display_order',
                'type'          => 'number',
                'default_value' => 0,
            ],
        ],
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'team_member']]],
        'position' => 'normal',
        'style'    => 'default',
    ]);

    // =========================================================================
    // Pricing Plan Fields
    // =========================================================================
    acf_add_local_field_group([
        'key'    => 'group_pricing_plan',
        'title'  => 'Pricing Plan Details',
        'fields' => [
            [
                'key'      => 'field_pricing_price',
                'label'    => 'Price',
                'name'     => 'price',
                'type'     => 'text',
                'required' => 1,
                'instructions' => 'e.g. $5,000 CAD',
            ],
            [
                'key'   => 'field_pricing_price_range',
                'label' => 'Price Range',
                'name'  => 'price_range',
                'type'  => 'text',
                'instructions' => 'e.g. $5,000-$10,000',
            ],
            [
                'key'   => 'field_pricing_timeline',
                'label' => 'Timeline',
                'name'  => 'timeline',
                'type'  => 'text',
                'instructions' => 'e.g. 2 weeks',
            ],
            [
                'key'           => 'field_pricing_popular',
                'label'         => 'Is Popular (featured)',
                'name'          => 'is_popular',
                'type'          => 'true_false',
                'default_value' => 0,
                'ui'            => 1,
            ],
            [
                'key'   => 'field_pricing_features_count',
                'label' => 'Features Count',
                'name'  => 'features_count',
                'type'  => 'text',
                'instructions' => 'e.g. 1-3 features, Full product',
            ],
            [
                'key'   => 'field_pricing_design_type',
                'label' => 'Design Type',
                'name'  => 'design_type',
                'type'  => 'text',
                'instructions' => 'e.g. Template-based, Custom UI/UX',
            ],
            [
                'key'   => 'field_pricing_pages',
                'label' => 'Pages/Screens',
                'name'  => 'pages_screens',
                'type'  => 'text',
                'instructions' => 'e.g. Up to 5, Unlimited',
            ],
            [
                'key'   => 'field_pricing_revisions',
                'label' => 'Revisions',
                'name'  => 'revisions',
                'type'  => 'text',
                'instructions' => 'e.g. 2 rounds, Unlimited',
            ],
            [
                'key'   => 'field_pricing_support',
                'label' => 'Support Duration',
                'name'  => 'support_duration',
                'type'  => 'text',
                'instructions' => 'e.g. 2 weeks, 3 months',
            ],
            [
                'key'        => 'field_pricing_inclusions',
                'label'      => 'Inclusions',
                'name'       => 'inclusions',
                'type'       => 'repeater',
                'layout'     => 'table',
                'sub_fields' => [
                    [
                        'key'   => 'field_pricing_inclusion_item',
                        'label' => 'Item',
                        'name'  => 'item',
                        'type'  => 'text',
                    ],
                ],
            ],
            [
                'key'        => 'field_pricing_exclusions',
                'label'      => 'Exclusions',
                'name'       => 'exclusions',
                'type'       => 'repeater',
                'layout'     => 'table',
                'sub_fields' => [
                    [
                        'key'   => 'field_pricing_exclusion_item',
                        'label' => 'Item',
                        'name'  => 'item',
                        'type'  => 'text',
                    ],
                ],
            ],
            [
                'key'           => 'field_pricing_cta_text',
                'label'         => 'CTA Button Text',
                'name'          => 'cta_text',
                'type'          => 'text',
                'default_value' => 'Get Started',
            ],
            [
                'key'           => 'field_pricing_cta_link',
                'label'         => 'CTA Button Link',
                'name'          => 'cta_link',
                'type'          => 'url',
                'default_value' => 'https://calendly.com/sklentr',
            ],
            [
                'key'           => 'field_pricing_order',
                'label'         => 'Display Order',
                'name'          => 'display_order',
                'type'          => 'number',
                'default_value' => 0,
            ],
        ],
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'pricing_plan']]],
        'position' => 'normal',
        'style'    => 'default',
    ]);

    // =========================================================================
    // FAQ Fields
    // =========================================================================
    acf_add_local_field_group([
        'key'    => 'group_faq',
        'title'  => 'FAQ Details',
        'fields' => [
            [
                'key'      => 'field_faq_question',
                'label'    => 'Question',
                'name'     => 'question',
                'type'     => 'text',
                'required' => 1,
            ],
            [
                'key'      => 'field_faq_answer',
                'label'    => 'Answer',
                'name'     => 'answer',
                'type'     => 'wysiwyg',
                'toolbar'  => 'basic',
                'media_upload' => 0,
            ],
            [
                'key'     => 'field_faq_context',
                'label'   => 'Page Context',
                'name'    => 'page_context',
                'type'    => 'select',
                'choices' => [
                    'pricing'      => 'Pricing Page',
                    'startup-visa' => 'Startup Visa Page',
                    'general'      => 'General',
                ],
                'default_value' => 'general',
                'instructions'  => 'Which page should this FAQ appear on?',
            ],
            [
                'key'           => 'field_faq_order',
                'label'         => 'Display Order',
                'name'          => 'display_order',
                'type'          => 'number',
                'default_value' => 0,
            ],
        ],
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'faq']]],
        'position' => 'normal',
        'style'    => 'default',
    ]);

    // =========================================================================
    // Gallery Fields
    // =========================================================================
    acf_add_local_field_group([
        'key'    => 'group_gallery',
        'title'  => 'Gallery Details',
        'fields' => [
            [
                'key'   => 'field_gallery_category',
                'label' => 'Gallery Category',
                'name'  => 'gallery_category',
                'type'  => 'select',
                'choices' => [
                    'portfolio'  => 'Portfolio',
                    'team'       => 'Team',
                    'office'     => 'Office',
                    'events'     => 'Events',
                    'general'    => 'General',
                ],
                'default_value' => 'general',
            ],
            [
                'key'        => 'field_gallery_images',
                'label'      => 'Gallery Images',
                'name'       => 'gallery_images',
                'type'       => 'repeater',
                'layout'     => 'block',
                'sub_fields' => [
                    [
                        'key'           => 'field_gallery_image',
                        'label'         => 'Image',
                        'name'          => 'image',
                        'type'          => 'image',
                        'return_format' => 'array',
                        'preview_size'  => 'medium',
                    ],
                    [
                        'key'   => 'field_gallery_caption',
                        'label' => 'Caption',
                        'name'  => 'caption',
                        'type'  => 'text',
                    ],
                    [
                        'key'   => 'field_gallery_link',
                        'label' => 'Link URL',
                        'name'  => 'link_url',
                        'type'  => 'url',
                    ],
                ],
            ],
            [
                'key'           => 'field_gallery_order',
                'label'         => 'Display Order',
                'name'          => 'display_order',
                'type'          => 'number',
                'default_value' => 0,
            ],
        ],
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'gallery']]],
        'position' => 'normal',
        'style'    => 'default',
    ]);
});
