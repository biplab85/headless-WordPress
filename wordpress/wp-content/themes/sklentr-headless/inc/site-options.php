<?php
/**
 * Site Options - Custom Admin Pages for Homepage Sections
 *
 * Uses wp_options table to store section data (JSON encoded).
 * No ACF Pro required. Editable from WP Admin > Site Settings.
 */

// =============================================================================
// Register Admin Menu
// =============================================================================

add_action('admin_menu', function () {
    add_menu_page(
        'Site Settings',
        'Site Settings',
        'manage_options',
        'sklentr-settings',
        'sklentr_settings_page',
        'dashicons-admin-settings',
        2
    );

    $subpages = [
        'hero'          => 'Hero Section',
        'problem'       => 'Problem Section',
        'whychoose'     => 'Why Choose Section',
        'stats'         => 'Stats Bar',
        'process'       => 'Process Timeline',
        'startup-visa'  => 'Startup Visa CTA',
        'final-cta'     => 'Final CTA',
        'about-page'    => 'About Page',
        'page-content'  => 'Page Content',
        'footer'        => 'Footer Links',
        'general'       => 'General Settings',
    ];

    foreach ($subpages as $slug => $title) {
        add_submenu_page(
            'sklentr-settings',
            $title,
            $title,
            'manage_options',
            'sklentr-' . $slug,
            'sklentr_section_page_' . str_replace('-', '_', $slug)
        );
    }

    // Remove the duplicate parent link
    remove_submenu_page('sklentr-settings', 'sklentr-settings');
});

// =============================================================================
// Main settings page (redirect to Hero)
// =============================================================================

function sklentr_settings_page() {
    wp_redirect(admin_url('admin.php?page=sklentr-hero'));
    exit;
}

// =============================================================================
// Helper: Get / Set section data
// =============================================================================

function sklentr_get_section($section) {
    $data = get_option('sklentr_section_' . $section, '');
    if (!$data) return [];
    $decoded = json_decode($data, true);
    return is_array($decoded) ? $decoded : [];
}

function sklentr_save_section($section, $data) {
    update_option('sklentr_section_' . $section, wp_json_encode($data, JSON_UNESCAPED_UNICODE));
}

// =============================================================================
// Helper: Render form wrapper
// =============================================================================

function sklentr_form_header($title, $section) {
    $saved = isset($_GET['saved']) && $_GET['saved'] === '1';
    echo '<div class="wrap">';
    echo '<h1>' . esc_html($title) . '</h1>';
    if ($saved) {
        echo '<div class="notice notice-success is-dismissible"><p>Settings saved successfully.</p></div>';
    }
    echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
    echo '<input type="hidden" name="action" value="sklentr_save_' . esc_attr($section) . '">';
    wp_nonce_field('sklentr_save_' . $section, '_sklentr_nonce');
}

function sklentr_form_footer() {
    submit_button('Save Settings');
    echo '</form></div>';
}

function sklentr_text_field($label, $name, $value, $desc = '') {
    echo '<tr><th scope="row"><label for="' . esc_attr($name) . '">' . esc_html($label) . '</label></th>';
    echo '<td><input type="text" id="' . esc_attr($name) . '" name="' . esc_attr($name) . '" value="' . esc_attr($value) . '" class="regular-text">';
    if ($desc) echo '<p class="description">' . esc_html($desc) . '</p>';
    echo '</td></tr>';
}

function sklentr_textarea_field($label, $name, $value, $rows = 3) {
    echo '<tr><th scope="row"><label for="' . esc_attr($name) . '">' . esc_html($label) . '</label></th>';
    echo '<td><textarea id="' . esc_attr($name) . '" name="' . esc_attr($name) . '" rows="' . intval($rows) . '" class="large-text">' . esc_textarea($value) . '</textarea></td></tr>';
}

function sklentr_url_field($label, $name, $value) {
    echo '<tr><th scope="row"><label for="' . esc_attr($name) . '">' . esc_html($label) . '</label></th>';
    echo '<td><input type="url" id="' . esc_attr($name) . '" name="' . esc_attr($name) . '" value="' . esc_url($value) . '" class="regular-text"></td></tr>';
}

// =============================================================================
// HERO SECTION
// =============================================================================

function sklentr_section_page_hero() {
    $d = sklentr_get_section('hero');
    sklentr_form_header('Hero Section', 'hero');
    echo '<table class="form-table">';
    sklentr_text_field('Label', 'hero_label', $d['hero_label'] ?? 'Toronto-based MVP Studio');
    sklentr_textarea_field('Headline', 'hero_headline', $d['hero_headline'] ?? "Launch-ready MVPs\nin weeks, not months.");
    sklentr_text_field('Highlight Word (colored)', 'hero_highlight_word', $d['hero_highlight_word'] ?? 'weeks,');
    sklentr_text_field('Muted Text (italic)', 'hero_muted_text', $d['hero_muted_text'] ?? 'not months.');
    sklentr_textarea_field('Subheading', 'hero_subheading', $d['hero_subheading'] ?? 'We build MVPs that get you funded, validated, and to market — fast.', 2);
    sklentr_text_field('Tagline', 'hero_tagline', $d['hero_tagline'] ?? 'Canadian expertise · Competitive pricing · No excuses');
    sklentr_text_field('Primary CTA Text', 'hero_cta_primary_text', $d['hero_cta_primary_text'] ?? 'Book My Free Consultation');
    sklentr_url_field('Primary CTA URL', 'hero_cta_primary_url', $d['hero_cta_primary_url'] ?? 'https://calendly.com/sklentr');
    sklentr_text_field('Secondary CTA Text', 'hero_cta_secondary_text', $d['hero_cta_secondary_text'] ?? 'See Pricing');
    sklentr_text_field('Secondary CTA URL', 'hero_cta_secondary_url', $d['hero_cta_secondary_url'] ?? '/pricing');
    echo '</table>';

    // Stats repeater
    $stats = $d['hero_stats'] ?? [
        ['value' => '2-Week', 'label' => 'MVPs'],
        ['value' => '50+', 'label' => 'Projects'],
        ['value' => '#1', 'label' => 'SEO Rankings'],
        ['value' => '100%', 'label' => 'Canadian Mgmt'],
    ];
    echo '<h2>Hero Stats</h2>';
    echo '<div id="hero-stats-repeater">';
    foreach ($stats as $i => $stat) {
        echo '<div class="repeater-row" style="display:flex;gap:10px;margin-bottom:8px;">';
        echo '<input type="text" name="hero_stats[' . $i . '][value]" value="' . esc_attr($stat['value']) . '" placeholder="Value" style="width:150px;">';
        echo '<input type="text" name="hero_stats[' . $i . '][label]" value="' . esc_attr($stat['label']) . '" placeholder="Label" style="width:200px;">';
        echo '<button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>';
        echo '</div>';
    }
    echo '</div>';
    echo '<button type="button" class="button" onclick="addHeroStat()">+ Add Stat</button>';
    echo '<script>
    var statIdx = ' . count($stats) . ';
    function addHeroStat(){
        var d=document.createElement("div");d.className="repeater-row";d.style="display:flex;gap:10px;margin-bottom:8px;";
        d.innerHTML=\'<input type="text" name="hero_stats[\'+statIdx+\'][value]" placeholder="Value" style="width:150px;"><input type="text" name="hero_stats[\'+statIdx+\'][label]" placeholder="Label" style="width:200px;"><button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>\';
        document.getElementById("hero-stats-repeater").appendChild(d);statIdx++;
    }
    </script>';

    sklentr_form_footer();
}

add_action('admin_post_sklentr_save_hero', function () {
    check_admin_referer('sklentr_save_hero', '_sklentr_nonce');
    $data = [
        'hero_label'              => sanitize_text_field($_POST['hero_label'] ?? ''),
        'hero_headline'           => sanitize_textarea_field($_POST['hero_headline'] ?? ''),
        'hero_highlight_word'     => sanitize_text_field($_POST['hero_highlight_word'] ?? ''),
        'hero_muted_text'         => sanitize_text_field($_POST['hero_muted_text'] ?? ''),
        'hero_subheading'         => sanitize_textarea_field($_POST['hero_subheading'] ?? ''),
        'hero_tagline'            => sanitize_text_field($_POST['hero_tagline'] ?? ''),
        'hero_cta_primary_text'   => sanitize_text_field($_POST['hero_cta_primary_text'] ?? ''),
        'hero_cta_primary_url'    => esc_url_raw($_POST['hero_cta_primary_url'] ?? ''),
        'hero_cta_secondary_text' => sanitize_text_field($_POST['hero_cta_secondary_text'] ?? ''),
        'hero_cta_secondary_url'  => sanitize_text_field($_POST['hero_cta_secondary_url'] ?? ''),
        'hero_stats'              => [],
    ];
    if (!empty($_POST['hero_stats']) && is_array($_POST['hero_stats'])) {
        foreach ($_POST['hero_stats'] as $stat) {
            if (!empty($stat['value']) || !empty($stat['label'])) {
                $data['hero_stats'][] = [
                    'value' => sanitize_text_field($stat['value'] ?? ''),
                    'label' => sanitize_text_field($stat['label'] ?? ''),
                ];
            }
        }
    }
    sklentr_save_section('hero', $data);
    sklentr_trigger_revalidation();
    wp_redirect(admin_url('admin.php?page=sklentr-hero&saved=1'));
    exit;
});

// =============================================================================
// PROBLEM SECTION
// =============================================================================

function sklentr_section_page_problem() {
    $d = sklentr_get_section('problem');
    sklentr_form_header('Problem Section', 'problem');
    echo '<table class="form-table">';
    sklentr_text_field('Section Label', 'problem_label', $d['problem_label'] ?? 'The Problem');
    sklentr_text_field('Section Title', 'problem_title', $d['problem_title'] ?? 'Your idea deserves better than "coming soon."');
    echo '</table>';

    $items = $d['problem_items'] ?? [
        ['icon' => 'clock', 'title' => 'Slow delivery', 'text' => 'They take months while your window closes.'],
        ['icon' => 'dollar-sign', 'title' => 'Overpriced', 'text' => 'They charge a fortune before you\'ve validated anything.'],
        ['icon' => 'alert-triangle', 'title' => 'Wrong scope', 'text' => 'They deliver what you didn\'t ask for and call it "scope."'],
    ];
    echo '<h2>Problem Items</h2><p class="description">Icons: clock, dollar-sign, alert-triangle</p>';
    echo '<div id="problem-items">';
    foreach ($items as $i => $item) {
        echo '<div class="repeater-row" style="display:flex;gap:8px;margin-bottom:8px;align-items:center;">';
        echo '<input type="text" name="problem_items[' . $i . '][icon]" value="' . esc_attr($item['icon']) . '" placeholder="Icon" style="width:120px;">';
        echo '<input type="text" name="problem_items[' . $i . '][title]" value="' . esc_attr($item['title']) . '" placeholder="Title" style="width:150px;">';
        echo '<input type="text" name="problem_items[' . $i . '][text]" value="' . esc_attr($item['text']) . '" placeholder="Description" style="width:350px;">';
        echo '<button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>';
        echo '</div>';
    }
    echo '</div>';
    echo '<button type="button" class="button" onclick="addProblemItem()">+ Add Item</button>';
    echo '<script>var pi=' . count($items) . ';function addProblemItem(){var d=document.createElement("div");d.className="repeater-row";d.style="display:flex;gap:8px;margin-bottom:8px;align-items:center;";d.innerHTML=\'<input type="text" name="problem_items[\'+pi+\'][icon]" placeholder="Icon" style="width:120px;"><input type="text" name="problem_items[\'+pi+\'][title]" placeholder="Title" style="width:150px;"><input type="text" name="problem_items[\'+pi+\'][text]" placeholder="Description" style="width:350px;"><button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>\';document.getElementById("problem-items").appendChild(d);pi++;}</script>';

    sklentr_form_footer();
}

add_action('admin_post_sklentr_save_problem', function () {
    check_admin_referer('sklentr_save_problem', '_sklentr_nonce');
    $data = [
        'problem_label' => sanitize_text_field($_POST['problem_label'] ?? ''),
        'problem_title' => sanitize_text_field($_POST['problem_title'] ?? ''),
        'problem_items' => [],
    ];
    if (!empty($_POST['problem_items']) && is_array($_POST['problem_items'])) {
        foreach ($_POST['problem_items'] as $item) {
            if (!empty($item['title'])) {
                $data['problem_items'][] = [
                    'icon'  => sanitize_text_field($item['icon'] ?? ''),
                    'title' => sanitize_text_field($item['title'] ?? ''),
                    'text'  => sanitize_text_field($item['text'] ?? ''),
                ];
            }
        }
    }
    sklentr_save_section('problem', $data);
    sklentr_trigger_revalidation();
    wp_redirect(admin_url('admin.php?page=sklentr-problem&saved=1'));
    exit;
});

// =============================================================================
// WHY CHOOSE SECTION
// =============================================================================

function sklentr_section_page_whychoose() {
    $d = sklentr_get_section('whychoose');
    sklentr_form_header('Why Choose Section', 'whychoose');
    echo '<table class="form-table">';
    sklentr_text_field('Section Label', 'why_label', $d['why_label'] ?? 'Why Sklentr');
    sklentr_text_field('Section Title', 'why_title', $d['why_title'] ?? 'We ship while others plan.');
    echo '</table>';

    $items = $d['why_items'] ?? [
        ['icon' => 'zap', 'num' => '01', 'title' => '2-Week MVPs', 'description' => 'Launch fast. Iterate faster.'],
        ['icon' => 'users', 'num' => '02', 'title' => 'One Team, Full Service', 'description' => 'Dev, design, SEO, marketing, video — no juggling vendors.'],
        ['icon' => 'globe', 'num' => '03', 'title' => 'Canadian Quality, Smart Pricing', 'description' => 'Toronto-managed, globally powered.'],
        ['icon' => 'layers', 'num' => '04', 'title' => 'Built to Scale', 'description' => 'Real architecture, not duct tape.'],
    ];
    echo '<h2>Reasons</h2><p class="description">Icons: zap, users, globe, layers</p>';
    echo '<div id="why-items">';
    foreach ($items as $i => $item) {
        echo '<div class="repeater-row" style="background:#f9f9f9;padding:10px;margin-bottom:8px;border:1px solid #ddd;">';
        echo '<div style="display:flex;gap:8px;margin-bottom:6px;">';
        echo '<input type="text" name="why_items[' . $i . '][icon]" value="' . esc_attr($item['icon']) . '" placeholder="Icon" style="width:100px;">';
        echo '<input type="text" name="why_items[' . $i . '][num]" value="' . esc_attr($item['num']) . '" placeholder="Number" style="width:60px;">';
        echo '<input type="text" name="why_items[' . $i . '][title]" value="' . esc_attr($item['title']) . '" placeholder="Title" style="width:250px;">';
        echo '<button type="button" class="button" onclick="this.closest(\'.repeater-row\').remove()">Remove</button>';
        echo '</div>';
        echo '<textarea name="why_items[' . $i . '][description]" placeholder="Description" rows="2" style="width:100%;">' . esc_textarea($item['description']) . '</textarea>';
        echo '</div>';
    }
    echo '</div>';
    echo '<button type="button" class="button" onclick="addWhyItem()">+ Add Reason</button>';
    echo '<script>var wi=' . count($items) . ';function addWhyItem(){var d=document.createElement("div");d.className="repeater-row";d.style="background:#f9f9f9;padding:10px;margin-bottom:8px;border:1px solid #ddd;";d.innerHTML=\'<div style="display:flex;gap:8px;margin-bottom:6px;"><input type="text" name="why_items[\'+wi+\'][icon]" placeholder="Icon" style="width:100px;"><input type="text" name="why_items[\'+wi+\'][num]" placeholder="Number" style="width:60px;"><input type="text" name="why_items[\'+wi+\'][title]" placeholder="Title" style="width:250px;"><button type="button" class="button" onclick="this.closest(\\\'.repeater-row\\\').remove()">Remove</button></div><textarea name="why_items[\'+wi+\'][description]" placeholder="Description" rows="2" style="width:100%;"></textarea>\';document.getElementById("why-items").appendChild(d);wi++;}</script>';

    sklentr_form_footer();
}

add_action('admin_post_sklentr_save_whychoose', function () {
    check_admin_referer('sklentr_save_whychoose', '_sklentr_nonce');
    $data = [
        'why_label' => sanitize_text_field($_POST['why_label'] ?? ''),
        'why_title' => sanitize_text_field($_POST['why_title'] ?? ''),
        'why_items' => [],
    ];
    if (!empty($_POST['why_items']) && is_array($_POST['why_items'])) {
        foreach ($_POST['why_items'] as $item) {
            if (!empty($item['title'])) {
                $data['why_items'][] = [
                    'icon'        => sanitize_text_field($item['icon'] ?? ''),
                    'num'         => sanitize_text_field($item['num'] ?? ''),
                    'title'       => sanitize_text_field($item['title'] ?? ''),
                    'description' => sanitize_textarea_field($item['description'] ?? ''),
                ];
            }
        }
    }
    sklentr_save_section('whychoose', $data);
    sklentr_trigger_revalidation();
    wp_redirect(admin_url('admin.php?page=sklentr-whychoose&saved=1'));
    exit;
});

// =============================================================================
// STATS BAR
// =============================================================================

function sklentr_section_page_stats() {
    $d = sklentr_get_section('stats');
    sklentr_form_header('Stats Bar', 'stats');

    $items = $d['stats_items'] ?? [
        ['value' => '14', 'suffix' => ' days', 'label' => 'Average Delivery'],
        ['value' => '98', 'suffix' => '%', 'label' => 'On-time Rate'],
        ['value' => '50', 'suffix' => '+', 'label' => 'Projects Shipped'],
        ['value' => '98', 'suffix' => '%', 'label' => 'Success Rate'],
    ];
    echo '<h2>Stats</h2>';
    echo '<div id="stats-items">';
    foreach ($items as $i => $item) {
        echo '<div class="repeater-row" style="display:flex;gap:8px;margin-bottom:8px;">';
        echo '<input type="number" name="stats_items[' . $i . '][value]" value="' . esc_attr($item['value']) . '" placeholder="Number" style="width:100px;">';
        echo '<input type="text" name="stats_items[' . $i . '][suffix]" value="' . esc_attr($item['suffix']) . '" placeholder="Suffix (e.g. %, +)" style="width:100px;">';
        echo '<input type="text" name="stats_items[' . $i . '][label]" value="' . esc_attr($item['label']) . '" placeholder="Label" style="width:200px;">';
        echo '<button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>';
        echo '</div>';
    }
    echo '</div>';
    echo '<button type="button" class="button" onclick="addStatItem()">+ Add Stat</button>';
    echo '<script>var si=' . count($items) . ';function addStatItem(){var d=document.createElement("div");d.className="repeater-row";d.style="display:flex;gap:8px;margin-bottom:8px;";d.innerHTML=\'<input type="number" name="stats_items[\'+si+\'][value]" placeholder="Number" style="width:100px;"><input type="text" name="stats_items[\'+si+\'][suffix]" placeholder="Suffix" style="width:100px;"><input type="text" name="stats_items[\'+si+\'][label]" placeholder="Label" style="width:200px;"><button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>\';document.getElementById("stats-items").appendChild(d);si++;}</script>';

    sklentr_form_footer();
}

add_action('admin_post_sklentr_save_stats', function () {
    check_admin_referer('sklentr_save_stats', '_sklentr_nonce');
    $data = ['stats_items' => []];
    if (!empty($_POST['stats_items']) && is_array($_POST['stats_items'])) {
        foreach ($_POST['stats_items'] as $item) {
            if ($item['value'] !== '' || !empty($item['label'])) {
                $data['stats_items'][] = [
                    'value'  => sanitize_text_field($item['value'] ?? ''),
                    'suffix' => sanitize_text_field($item['suffix'] ?? ''),
                    'label'  => sanitize_text_field($item['label'] ?? ''),
                ];
            }
        }
    }
    sklentr_save_section('stats', $data);
    sklentr_trigger_revalidation();
    wp_redirect(admin_url('admin.php?page=sklentr-stats&saved=1'));
    exit;
});

// =============================================================================
// PROCESS TIMELINE
// =============================================================================

function sklentr_section_page_process() {
    $d = sklentr_get_section('process');
    sklentr_form_header('Process Timeline', 'process');
    echo '<table class="form-table">';
    sklentr_text_field('Section Label', 'process_label', $d['process_label'] ?? 'Process');
    sklentr_text_field('Section Title', 'process_title', $d['process_title'] ?? 'From Idea to Launch in 4 Weeks');
    sklentr_text_field('Section Subtitle', 'process_subtitle', $d['process_subtitle'] ?? 'Delivery before your visa deadline. Guaranteed.');
    echo '</table>';

    $steps = $d['process_steps'] ?? [
        ['icon' => 'search', 'week' => 'Week 1', 'title' => 'Discovery & Planning', 'description' => 'We understand your vision and define the MVP scope.'],
        ['icon' => 'pen-tool', 'week' => 'Week 2', 'title' => 'Design & Architecture', 'description' => 'UI/UX design finalization and technical architecture planning.'],
        ['icon' => 'code', 'week' => 'Week 3', 'title' => 'Development Sprint', 'description' => 'Core feature development with regular progress updates.'],
        ['icon' => 'rocket', 'week' => 'Week 4', 'title' => 'Testing & Launch', 'description' => 'Quality assurance, deployment, and product launch.'],
    ];
    echo '<h2>Steps</h2><p class="description">Icons: search, pen-tool, code, rocket</p>';
    echo '<div id="process-steps">';
    foreach ($steps as $i => $step) {
        echo '<div class="repeater-row" style="background:#f9f9f9;padding:10px;margin-bottom:8px;border:1px solid #ddd;">';
        echo '<div style="display:flex;gap:8px;margin-bottom:6px;">';
        echo '<input type="text" name="process_steps[' . $i . '][icon]" value="' . esc_attr($step['icon']) . '" placeholder="Icon" style="width:100px;">';
        echo '<input type="text" name="process_steps[' . $i . '][week]" value="' . esc_attr($step['week']) . '" placeholder="Week" style="width:100px;">';
        echo '<input type="text" name="process_steps[' . $i . '][title]" value="' . esc_attr($step['title']) . '" placeholder="Title" style="width:250px;">';
        echo '<button type="button" class="button" onclick="this.closest(\'.repeater-row\').remove()">Remove</button>';
        echo '</div>';
        echo '<textarea name="process_steps[' . $i . '][description]" placeholder="Description" rows="2" style="width:100%;">' . esc_textarea($step['description']) . '</textarea>';
        echo '</div>';
    }
    echo '</div>';
    echo '<button type="button" class="button" onclick="addProcessStep()">+ Add Step</button>';
    echo '<script>var ps=' . count($steps) . ';function addProcessStep(){var d=document.createElement("div");d.className="repeater-row";d.style="background:#f9f9f9;padding:10px;margin-bottom:8px;border:1px solid #ddd;";d.innerHTML=\'<div style="display:flex;gap:8px;margin-bottom:6px;"><input type="text" name="process_steps[\'+ps+\'][icon]" placeholder="Icon" style="width:100px;"><input type="text" name="process_steps[\'+ps+\'][week]" placeholder="Week" style="width:100px;"><input type="text" name="process_steps[\'+ps+\'][title]" placeholder="Title" style="width:250px;"><button type="button" class="button" onclick="this.closest(\\\'.repeater-row\\\').remove()">Remove</button></div><textarea name="process_steps[\'+ps+\'][description]" placeholder="Description" rows="2" style="width:100%;"></textarea>\';document.getElementById("process-steps").appendChild(d);ps++;}</script>';

    sklentr_form_footer();
}

add_action('admin_post_sklentr_save_process', function () {
    check_admin_referer('sklentr_save_process', '_sklentr_nonce');
    $data = [
        'process_label'    => sanitize_text_field($_POST['process_label'] ?? ''),
        'process_title'    => sanitize_text_field($_POST['process_title'] ?? ''),
        'process_subtitle' => sanitize_text_field($_POST['process_subtitle'] ?? ''),
        'process_steps'    => [],
    ];
    if (!empty($_POST['process_steps']) && is_array($_POST['process_steps'])) {
        foreach ($_POST['process_steps'] as $step) {
            if (!empty($step['title'])) {
                $data['process_steps'][] = [
                    'icon'        => sanitize_text_field($step['icon'] ?? ''),
                    'week'        => sanitize_text_field($step['week'] ?? ''),
                    'title'       => sanitize_text_field($step['title'] ?? ''),
                    'description' => sanitize_textarea_field($step['description'] ?? ''),
                ];
            }
        }
    }
    sklentr_save_section('process', $data);
    sklentr_trigger_revalidation();
    wp_redirect(admin_url('admin.php?page=sklentr-process&saved=1'));
    exit;
});

// =============================================================================
// STARTUP VISA CTA
// =============================================================================

function sklentr_section_page_startup_visa() {
    $d = sklentr_get_section('startup-visa');
    sklentr_form_header('Startup Visa CTA', 'startup-visa');
    echo '<table class="form-table">';
    sklentr_text_field('Label', 'sv_label', $d['sv_label'] ?? 'Startup Visa');
    sklentr_text_field('Title', 'sv_title', $d['sv_title'] ?? 'Need an MVP for your Startup Visa?');
    sklentr_text_field('Highlight Text', 'sv_highlight', $d['sv_highlight'] ?? "We've got you.");
    sklentr_text_field('CTA Text', 'sv_cta_text', $d['sv_cta_text'] ?? 'Learn More');
    sklentr_text_field('CTA URL', 'sv_cta_url', $d['sv_cta_url'] ?? '/startup-visa');
    echo '</table>';

    $benefits = $d['sv_benefits'] ?? [
        ['text' => 'Working Product — Prove business viability'],
        ['text' => 'Meet Deadlines — Timeline that fits your visa process'],
        ['text' => 'Budget Friendly — Pricing that respects your runway'],
    ];
    echo '<h2>Benefits</h2><div id="sv-benefits">';
    foreach ($benefits as $i => $b) {
        echo '<div class="repeater-row" style="display:flex;gap:8px;margin-bottom:8px;">';
        echo '<input type="text" name="sv_benefits[' . $i . '][text]" value="' . esc_attr($b['text']) . '" placeholder="Benefit text" class="regular-text">';
        echo '<button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>';
        echo '</div>';
    }
    echo '</div>';
    echo '<button type="button" class="button" onclick="addSVBenefit()">+ Add Benefit</button>';
    echo '<script>var sb=' . count($benefits) . ';function addSVBenefit(){var d=document.createElement("div");d.className="repeater-row";d.style="display:flex;gap:8px;margin-bottom:8px;";d.innerHTML=\'<input type="text" name="sv_benefits[\'+sb+\'][text]" placeholder="Benefit text" class="regular-text"><button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>\';document.getElementById("sv-benefits").appendChild(d);sb++;}</script>';

    sklentr_form_footer();
}

add_action('admin_post_sklentr_save_startup-visa', function () {
    check_admin_referer('sklentr_save_startup-visa', '_sklentr_nonce');
    $data = [
        'sv_label'     => sanitize_text_field($_POST['sv_label'] ?? ''),
        'sv_title'     => sanitize_text_field($_POST['sv_title'] ?? ''),
        'sv_highlight' => sanitize_text_field($_POST['sv_highlight'] ?? ''),
        'sv_cta_text'  => sanitize_text_field($_POST['sv_cta_text'] ?? ''),
        'sv_cta_url'   => sanitize_text_field($_POST['sv_cta_url'] ?? ''),
        'sv_benefits'  => [],
    ];
    if (!empty($_POST['sv_benefits']) && is_array($_POST['sv_benefits'])) {
        foreach ($_POST['sv_benefits'] as $b) {
            if (!empty($b['text'])) {
                $data['sv_benefits'][] = ['text' => sanitize_text_field($b['text'])];
            }
        }
    }
    sklentr_save_section('startup-visa', $data);
    sklentr_trigger_revalidation();
    wp_redirect(admin_url('admin.php?page=sklentr-startup-visa&saved=1'));
    exit;
});

// =============================================================================
// FINAL CTA
// =============================================================================

function sklentr_section_page_final_cta() {
    $d = sklentr_get_section('final-cta');
    sklentr_form_header('Final CTA', 'final-cta');
    echo '<table class="form-table">';
    sklentr_text_field('Label', 'fcta_label', $d['fcta_label'] ?? 'Get Started');
    sklentr_text_field('Title', 'fcta_title', $d['fcta_title'] ?? 'Ready to launch?');
    sklentr_textarea_field('Description', 'fcta_description', $d['fcta_description'] ?? "Book a free 30-minute consultation. Tell us your idea — we'll tell you how fast we can build it.", 2);
    sklentr_text_field('Primary CTA Text', 'fcta_primary_text', $d['fcta_primary_text'] ?? 'Book My Free Consultation');
    sklentr_url_field('Primary CTA URL', 'fcta_primary_url', $d['fcta_primary_url'] ?? 'https://calendly.com/sklentr');
    sklentr_text_field('Secondary CTA Text', 'fcta_secondary_text', $d['fcta_secondary_text'] ?? 'See Pricing');
    sklentr_text_field('Secondary CTA URL', 'fcta_secondary_url', $d['fcta_secondary_url'] ?? '/pricing');
    echo '</table>';
    sklentr_form_footer();
}

add_action('admin_post_sklentr_save_final-cta', function () {
    check_admin_referer('sklentr_save_final-cta', '_sklentr_nonce');
    $data = [
        'fcta_label'          => sanitize_text_field($_POST['fcta_label'] ?? ''),
        'fcta_title'          => sanitize_text_field($_POST['fcta_title'] ?? ''),
        'fcta_description'    => sanitize_textarea_field($_POST['fcta_description'] ?? ''),
        'fcta_primary_text'   => sanitize_text_field($_POST['fcta_primary_text'] ?? ''),
        'fcta_primary_url'    => esc_url_raw($_POST['fcta_primary_url'] ?? ''),
        'fcta_secondary_text' => sanitize_text_field($_POST['fcta_secondary_text'] ?? ''),
        'fcta_secondary_url'  => sanitize_text_field($_POST['fcta_secondary_url'] ?? ''),
    ];
    sklentr_save_section('final-cta', $data);
    sklentr_trigger_revalidation();
    wp_redirect(admin_url('admin.php?page=sklentr-final-cta&saved=1'));
    exit;
});

// =============================================================================
// ABOUT PAGE
// =============================================================================

function sklentr_section_page_about_page() {
    $d = sklentr_get_section('about-page');
    sklentr_form_header('About Page', 'about-page');

    // Hero section
    echo '<h2>Hero Section</h2>';
    echo '<table class="form-table">';
    sklentr_text_field('Label', 'about_label', $d['about_label'] ?? 'Our Story');
    sklentr_text_field('Title', 'about_title', $d['about_title'] ?? 'About Sklentr');
    sklentr_textarea_field('Description', 'about_description', $d['about_description'] ?? "We started Sklentr because we experienced the pain ourselves. As entrepreneurs, we know how hard it is to find a dependable development partner who truly understands startup needs. We're the alternative to expensive agencies and unreliable freelancers.", 4);
    echo '</table>';

    // Stats
    $stats = $d['about_stats'] ?? [
        ['value' => '50+', 'label' => 'Projects Delivered'],
        ['value' => '15+', 'label' => 'SUV MVPs Built'],
        ['value' => '2', 'label' => 'Offices Worldwide'],
        ['value' => '100%', 'label' => 'Client Satisfaction'],
    ];
    echo '<h2>Stats</h2>';
    echo '<div id="about-stats">';
    foreach ($stats as $i => $stat) {
        echo '<div class="repeater-row" style="display:flex;gap:8px;margin-bottom:8px;">';
        echo '<input type="text" name="about_stats[' . $i . '][value]" value="' . esc_attr($stat['value']) . '" placeholder="Value (e.g. 50+)" style="width:120px;">';
        echo '<input type="text" name="about_stats[' . $i . '][label]" value="' . esc_attr($stat['label']) . '" placeholder="Label" style="width:250px;">';
        echo '<button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>';
        echo '</div>';
    }
    echo '</div>';
    echo '<button type="button" class="button" onclick="addAboutStat()">+ Add Stat</button>';
    echo '<script>var as=' . count($stats) . ';function addAboutStat(){var d=document.createElement("div");d.className="repeater-row";d.style="display:flex;gap:8px;margin-bottom:8px;";d.innerHTML=\'<input type="text" name="about_stats[\'+as+\'][value]" placeholder="Value" style="width:120px;"><input type="text" name="about_stats[\'+as+\'][label]" placeholder="Label" style="width:250px;"><button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>\';document.getElementById("about-stats").appendChild(d);as++;}</script>';

    // Core Values
    echo '<h2>Core Values Section</h2>';
    echo '<table class="form-table">';
    sklentr_text_field('Section Title', 'about_values_title', $d['about_values_title'] ?? 'Our Core Values');
    echo '</table>';
    $values = $d['about_values'] ?? [
        ['icon' => 'zap', 'title' => 'Speed Without Sacrifice', 'description' => 'We move quickly without compromising quality. Every line of code is built to last.'],
        ['icon' => 'heart', 'title' => 'Founder-First Mentality', 'description' => 'We build solutions aligned with startup needs rather than maximizing fees.'],
        ['icon' => 'eye', 'title' => 'Radical Transparency', 'description' => 'No hidden costs or surprises in pricing or delivery.'],
        ['icon' => 'shield', 'title' => 'Ownership & Accountability', 'description' => 'We position ourselves as partners beyond launch. Your success is our success.'],
    ];
    echo '<h2>Core Values</h2><p class="description">Icons: zap, heart, eye, shield, star, target, award, users</p>';
    echo '<div id="about-values">';
    foreach ($values as $i => $item) {
        echo '<div class="repeater-row" style="background:#f9f9f9;padding:10px;margin-bottom:8px;border:1px solid #ddd;">';
        echo '<div style="display:flex;gap:8px;margin-bottom:6px;">';
        echo '<input type="text" name="about_values[' . $i . '][icon]" value="' . esc_attr($item['icon']) . '" placeholder="Icon" style="width:100px;">';
        echo '<input type="text" name="about_values[' . $i . '][title]" value="' . esc_attr($item['title']) . '" placeholder="Title" style="width:250px;">';
        echo '<button type="button" class="button" onclick="this.closest(\'.repeater-row\').remove()">Remove</button>';
        echo '</div>';
        echo '<textarea name="about_values[' . $i . '][description]" placeholder="Description" rows="2" style="width:100%;">' . esc_textarea($item['description']) . '</textarea>';
        echo '</div>';
    }
    echo '</div>';
    echo '<button type="button" class="button" onclick="addAboutValue()">+ Add Value</button>';
    echo '<script>var av=' . count($values) . ';function addAboutValue(){var d=document.createElement("div");d.className="repeater-row";d.style="background:#f9f9f9;padding:10px;margin-bottom:8px;border:1px solid #ddd;";d.innerHTML=\'<div style="display:flex;gap:8px;margin-bottom:6px;"><input type="text" name="about_values[\'+av+\'][icon]" placeholder="Icon" style="width:100px;"><input type="text" name="about_values[\'+av+\'][title]" placeholder="Title" style="width:250px;"><button type="button" class="button" onclick="this.closest(\\\'.repeater-row\\\').remove()">Remove</button></div><textarea name="about_values[\'+av+\'][description]" placeholder="Description" rows="2" style="width:100%;"></textarea>\';document.getElementById("about-values").appendChild(d);av++;}</script>';

    // Team Section
    echo '<h2>Team Section</h2>';
    echo '<table class="form-table">';
    sklentr_text_field('Team Title', 'about_team_title', $d['about_team_title'] ?? 'Our Team');
    sklentr_text_field('Team Subtitle', 'about_team_subtitle', $d['about_team_subtitle'] ?? 'Canadian management, global talent.');
    echo '</table>';

    // Offices
    echo '<h2>Offices Section</h2>';
    echo '<table class="form-table">';
    sklentr_text_field('Section Title', 'about_offices_title', $d['about_offices_title'] ?? 'Our Offices');
    echo '</table>';
    $offices = $d['about_offices'] ?? [
        ['city' => 'Toronto, Canada', 'type' => 'Headquarters', 'description' => 'Client relationships, strategy, and project management.'],
        ['city' => 'Dhaka, Bangladesh', 'type' => 'Development Center', 'description' => 'Engineering, design, and technical implementation.'],
    ];
    echo '<h2>Offices</h2>';
    echo '<div id="about-offices">';
    foreach ($offices as $i => $office) {
        echo '<div class="repeater-row" style="background:#f9f9f9;padding:10px;margin-bottom:8px;border:1px solid #ddd;">';
        echo '<div style="display:flex;gap:8px;margin-bottom:6px;">';
        echo '<input type="text" name="about_offices[' . $i . '][city]" value="' . esc_attr($office['city']) . '" placeholder="City, Country" style="width:200px;">';
        echo '<input type="text" name="about_offices[' . $i . '][type]" value="' . esc_attr($office['type']) . '" placeholder="Type (e.g. Headquarters)" style="width:200px;">';
        echo '<button type="button" class="button" onclick="this.closest(\'.repeater-row\').remove()">Remove</button>';
        echo '</div>';
        echo '<textarea name="about_offices[' . $i . '][description]" placeholder="Description" rows="2" style="width:100%;">' . esc_textarea($office['description']) . '</textarea>';
        echo '</div>';
    }
    echo '</div>';
    echo '<button type="button" class="button" onclick="addAboutOffice()">+ Add Office</button>';
    echo '<script>var ao=' . count($offices) . ';function addAboutOffice(){var d=document.createElement("div");d.className="repeater-row";d.style="background:#f9f9f9;padding:10px;margin-bottom:8px;border:1px solid #ddd;";d.innerHTML=\'<div style="display:flex;gap:8px;margin-bottom:6px;"><input type="text" name="about_offices[\'+ao+\'][city]" placeholder="City, Country" style="width:200px;"><input type="text" name="about_offices[\'+ao+\'][type]" placeholder="Type" style="width:200px;"><button type="button" class="button" onclick="this.closest(\\\'.repeater-row\\\').remove()">Remove</button></div><textarea name="about_offices[\'+ao+\'][description]" placeholder="Description" rows="2" style="width:100%;"></textarea>\';document.getElementById("about-offices").appendChild(d);ao++;}</script>';

    sklentr_form_footer();
}

add_action('admin_post_sklentr_save_about-page', function () {
    check_admin_referer('sklentr_save_about-page', '_sklentr_nonce');
    $data = [
        'about_label'         => sanitize_text_field($_POST['about_label'] ?? ''),
        'about_title'         => sanitize_text_field($_POST['about_title'] ?? ''),
        'about_description'   => sanitize_textarea_field($_POST['about_description'] ?? ''),
        'about_values_title'  => sanitize_text_field($_POST['about_values_title'] ?? 'Our Core Values'),
        'about_team_title'    => sanitize_text_field($_POST['about_team_title'] ?? ''),
        'about_team_subtitle' => sanitize_text_field($_POST['about_team_subtitle'] ?? ''),
        'about_offices_title' => sanitize_text_field($_POST['about_offices_title'] ?? 'Our Offices'),
        'about_stats'         => [],
        'about_values'        => [],
        'about_offices'       => [],
    ];
    if (!empty($_POST['about_stats']) && is_array($_POST['about_stats'])) {
        foreach ($_POST['about_stats'] as $stat) {
            if (!empty($stat['value']) || !empty($stat['label'])) {
                $data['about_stats'][] = [
                    'value' => sanitize_text_field($stat['value'] ?? ''),
                    'label' => sanitize_text_field($stat['label'] ?? ''),
                ];
            }
        }
    }
    if (!empty($_POST['about_values']) && is_array($_POST['about_values'])) {
        foreach ($_POST['about_values'] as $item) {
            if (!empty($item['title'])) {
                $data['about_values'][] = [
                    'icon'        => sanitize_text_field($item['icon'] ?? ''),
                    'title'       => sanitize_text_field($item['title'] ?? ''),
                    'description' => sanitize_textarea_field($item['description'] ?? ''),
                ];
            }
        }
    }
    if (!empty($_POST['about_offices']) && is_array($_POST['about_offices'])) {
        foreach ($_POST['about_offices'] as $office) {
            if (!empty($office['city'])) {
                $data['about_offices'][] = [
                    'city'        => sanitize_text_field($office['city'] ?? ''),
                    'type'        => sanitize_text_field($office['type'] ?? ''),
                    'description' => sanitize_textarea_field($office['description'] ?? ''),
                ];
            }
        }
    }
    sklentr_save_section('about-page', $data);
    sklentr_trigger_revalidation();
    wp_redirect(admin_url('admin.php?page=sklentr-about-page&saved=1'));
    exit;
});

// =============================================================================
// PAGE CONTENT (Services, Portfolio, Blog, Pricing, Startup Visa hero/sections)
// =============================================================================

function sklentr_section_page_page_content() {
    $d = sklentr_get_section('page-content');
    sklentr_form_header('Page Content Settings', 'page-content');

    // Services Page
    echo '<h2>Services Page</h2>';
    echo '<table class="form-table">';
    sklentr_text_field('Label', 'services_label', $d['services_label'] ?? 'What We Do');
    sklentr_text_field('Title', 'services_title', $d['services_title'] ?? 'Our Services');
    sklentr_text_field('Subtitle', 'services_subtitle', $d['services_subtitle'] ?? 'Launch-ready products in weeks, not months. One team for everything you need.');
    echo '</table>';

    // Portfolio Page
    echo '<h2>Portfolio Page</h2>';
    echo '<table class="form-table">';
    sklentr_text_field('Label', 'portfolio_label', $d['portfolio_label'] ?? 'Our Work');
    sklentr_text_field('Title', 'portfolio_title', $d['portfolio_title'] ?? 'Our Portfolio');
    sklentr_text_field('Subtitle', 'portfolio_subtitle', $d['portfolio_subtitle'] ?? 'Real products. Real results. See what we\'ve built for startups across Canada and beyond.');
    echo '</table>';

    // Portfolio Stats
    $portfolio_stats = $d['portfolio_stats'] ?? [
        ['value' => '50+', 'label' => 'Projects Delivered'],
        ['value' => '15+', 'label' => 'SUV MVPs Built'],
        ['value' => '2 weeks', 'label' => 'Fastest Delivery'],
        ['value' => '100%', 'label' => 'Satisfaction'],
    ];
    echo '<h3>Portfolio Stats</h3>';
    echo '<div id="portfolio-stats">';
    foreach ($portfolio_stats as $i => $stat) {
        echo '<div class="repeater-row" style="display:flex;gap:8px;margin-bottom:8px;">';
        echo '<input type="text" name="portfolio_stats[' . $i . '][value]" value="' . esc_attr($stat['value']) . '" placeholder="Value" style="width:120px;">';
        echo '<input type="text" name="portfolio_stats[' . $i . '][label]" value="' . esc_attr($stat['label']) . '" placeholder="Label" style="width:250px;">';
        echo '<button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>';
        echo '</div>';
    }
    echo '</div>';
    echo '<button type="button" class="button" onclick="addPortfolioStat()">+ Add Stat</button>';
    echo '<script>var ps=' . count($portfolio_stats) . ';function addPortfolioStat(){var d=document.createElement("div");d.className="repeater-row";d.style="display:flex;gap:8px;margin-bottom:8px;";d.innerHTML=\'<input type="text" name="portfolio_stats[\'+ps+\'][value]" placeholder="Value" style="width:120px;"><input type="text" name="portfolio_stats[\'+ps+\'][label]" placeholder="Label" style="width:250px;"><button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>\';document.getElementById("portfolio-stats").appendChild(d);ps++;}</script>';

    // Blog Page
    echo '<h2>Blog Page</h2>';
    echo '<table class="form-table">';
    sklentr_text_field('Label', 'blog_label', $d['blog_label'] ?? 'Blog');
    sklentr_text_field('Title', 'blog_title', $d['blog_title'] ?? 'Insights for Founders');
    sklentr_text_field('Subtitle', 'blog_subtitle', $d['blog_subtitle'] ?? 'Strategies, guides, and lessons from building MVPs for startups across Canada.');
    echo '</table>';

    // Pricing Page
    echo '<h2>Pricing Page</h2>';
    echo '<table class="form-table">';
    sklentr_text_field('Label', 'pricing_label', $d['pricing_label'] ?? 'Pricing');
    sklentr_text_field('Title', 'pricing_title', $d['pricing_title'] ?? 'Simple Pricing. No Surprises.');
    sklentr_text_field('Subtitle', 'pricing_subtitle', $d['pricing_subtitle'] ?? 'Every project starts with a free 30-minute consultation. We scope your idea and recommend the right package.');
    sklentr_text_field('Guarantees Title', 'pricing_guarantees_title', $d['pricing_guarantees_title'] ?? 'Our Guarantees');
    sklentr_text_field('FAQ Title', 'pricing_faq_title', $d['pricing_faq_title'] ?? 'Frequently Asked Questions');
    echo '</table>';

    // Startup Visa Full Page
    echo '<h2>Startup Visa Page</h2>';
    echo '<table class="form-table">';
    sklentr_text_field('Hero Title', 'suv_hero_title', $d['suv_hero_title'] ?? 'Your Startup Visa Application Needs');
    sklentr_text_field('Hero Highlight', 'suv_hero_highlight', $d['suv_hero_highlight'] ?? 'More Than an Idea');
    sklentr_text_field('Hero Subtitle', 'suv_hero_subtitle', $d['suv_hero_subtitle'] ?? 'We build launch-ready MVPs that demonstrate business viability, impress designated organizations, and strengthen your pathway to Canadian PR.');
    sklentr_text_field('Hard Truth Title', 'suv_hard_truth_title', $d['suv_hard_truth_title'] ?? 'Ideas Don\'t Get Visas. Products Do.');
    sklentr_text_field('MVP Section Title', 'suv_mvp_title', $d['suv_mvp_title'] ?? 'Complete MVP Package');
    sklentr_text_field('MVP Section Subtitle', 'suv_mvp_subtitle', $d['suv_mvp_subtitle'] ?? 'Everything you need to impress designated organizations and strengthen your visa application.');
    sklentr_text_field('Pricing Title', 'suv_pricing_title', $d['suv_pricing_title'] ?? 'Growth MVP - Recommended for SUV');
    sklentr_text_field('Pricing Price', 'suv_pricing_price', $d['suv_pricing_price'] ?? '$15,000 CAD');
    sklentr_text_field('Pricing Delivery', 'suv_pricing_delivery', $d['suv_pricing_delivery'] ?? '4 weeks delivery');
    sklentr_text_field('Pricing Comparison', 'suv_pricing_comparison', $d['suv_pricing_comparison'] ?? 'Agencies charge $50,000+. Freelancers take 6+ months.');
    sklentr_text_field('Final CTA Title', 'suv_final_title', $d['suv_final_title'] ?? 'Don\'t Let Your Visa Dream Die With Just an Idea');
    sklentr_text_field('Final CTA Subtitle', 'suv_final_subtitle', $d['suv_final_subtitle'] ?? 'Limited spots available each month. We only take on 4 SUV projects at a time.');
    echo '</table>';

    // SUV Hero Stats
    $suv_stats = $d['suv_hero_stats'] ?? [
        ['value' => '15+', 'label' => 'SUV MVPs Built'],
        ['value' => '4-Week', 'label' => 'Delivery'],
        ['value' => '100%', 'label' => 'On-Time'],
    ];
    echo '<h3>SUV Hero Stats</h3>';
    echo '<div id="suv-hero-stats">';
    foreach ($suv_stats as $i => $stat) {
        echo '<div class="repeater-row" style="display:flex;gap:8px;margin-bottom:8px;">';
        echo '<input type="text" name="suv_hero_stats[' . $i . '][value]" value="' . esc_attr($stat['value']) . '" placeholder="Value" style="width:120px;">';
        echo '<input type="text" name="suv_hero_stats[' . $i . '][label]" value="' . esc_attr($stat['label']) . '" placeholder="Label" style="width:250px;">';
        echo '<button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>';
        echo '</div>';
    }
    echo '</div>';
    echo '<button type="button" class="button" onclick="addSuvStat()">+ Add Stat</button>';
    echo '<script>var ss=' . count($suv_stats) . ';function addSuvStat(){var d=document.createElement("div");d.className="repeater-row";d.style="display:flex;gap:8px;margin-bottom:8px;";d.innerHTML=\'<input type="text" name="suv_hero_stats[\'+ss+\'][value]" placeholder="Value" style="width:120px;"><input type="text" name="suv_hero_stats[\'+ss+\'][label]" placeholder="Label" style="width:250px;"><button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>\';document.getElementById("suv-hero-stats").appendChild(d);ss++;}</script>';

    // SUV Hard Truth Points
    $hard_truth_points = $d['suv_hard_truth_points'] ?? [
        'Designated organizations review hundreds of pitch decks monthly',
        'Working products differentiate you from 95% of applicants',
        'IRCC will scrutinize applications harder when the program resumes',
    ];
    echo '<h3>Hard Truth Points</h3>';
    echo '<div id="suv-hard-truth">';
    foreach ($hard_truth_points as $i => $point) {
        echo '<div class="repeater-row" style="display:flex;gap:8px;margin-bottom:8px;">';
        echo '<input type="text" name="suv_hard_truth_points[' . $i . ']" value="' . esc_attr($point) . '" placeholder="Point" style="width:90%;">';
        echo '<button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>';
        echo '</div>';
    }
    echo '</div>';
    echo '<button type="button" class="button" onclick="addHardTruth()">+ Add Point</button>';
    echo '<script>var ht=' . count($hard_truth_points) . ';function addHardTruth(){var d=document.createElement("div");d.className="repeater-row";d.style="display:flex;gap:8px;margin-bottom:8px;";d.innerHTML=\'<input type="text" name="suv_hard_truth_points[\'+ht+\']" placeholder="Point" style="width:90%;"><button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>\';document.getElementById("suv-hard-truth").appendChild(d);ht++;}</script>';

    // SUV MVP Items
    $mvp_items = $d['suv_mvp_items'] ?? [
        'Working web/mobile application',
        'User authentication and core features',
        'Admin dashboard',
        'Technical documentation',
        'Pitch deck assets',
        'Full source code ownership',
        'Production deployment',
        'One month post-launch support',
    ];
    echo '<h3>MVP Package Items</h3>';
    echo '<div id="suv-mvp-items">';
    foreach ($mvp_items as $i => $item) {
        echo '<div class="repeater-row" style="display:flex;gap:8px;margin-bottom:8px;">';
        echo '<input type="text" name="suv_mvp_items[' . $i . ']" value="' . esc_attr($item) . '" placeholder="Item" style="width:90%;">';
        echo '<button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>';
        echo '</div>';
    }
    echo '</div>';
    echo '<button type="button" class="button" onclick="addMvpItem()">+ Add Item</button>';
    echo '<script>var mi=' . count($mvp_items) . ';function addMvpItem(){var d=document.createElement("div");d.className="repeater-row";d.style="display:flex;gap:8px;margin-bottom:8px;";d.innerHTML=\'<input type="text" name="suv_mvp_items[\'+mi+\']" placeholder="Item" style="width:90%;"><button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>\';document.getElementById("suv-mvp-items").appendChild(d);mi++;}</script>';

    sklentr_form_footer();
}

add_action('admin_post_sklentr_save_page-content', function () {
    check_admin_referer('sklentr_save_page-content', '_sklentr_nonce');
    $text_fields = [
        'services_label', 'services_title', 'services_subtitle',
        'portfolio_label', 'portfolio_title', 'portfolio_subtitle',
        'blog_label', 'blog_title', 'blog_subtitle',
        'pricing_label', 'pricing_title', 'pricing_subtitle',
        'pricing_guarantees_title', 'pricing_faq_title',
        'suv_hero_title', 'suv_hero_highlight', 'suv_hero_subtitle',
        'suv_hard_truth_title', 'suv_mvp_title', 'suv_mvp_subtitle',
        'suv_pricing_title', 'suv_pricing_price', 'suv_pricing_delivery',
        'suv_pricing_comparison', 'suv_final_title', 'suv_final_subtitle',
    ];
    $data = [];
    foreach ($text_fields as $field) {
        $data[$field] = sanitize_text_field($_POST[$field] ?? '');
    }

    // Portfolio Stats
    $data['portfolio_stats'] = [];
    if (!empty($_POST['portfolio_stats']) && is_array($_POST['portfolio_stats'])) {
        foreach ($_POST['portfolio_stats'] as $stat) {
            if (!empty($stat['value']) || !empty($stat['label'])) {
                $data['portfolio_stats'][] = [
                    'value' => sanitize_text_field($stat['value'] ?? ''),
                    'label' => sanitize_text_field($stat['label'] ?? ''),
                ];
            }
        }
    }

    // SUV Hero Stats
    $data['suv_hero_stats'] = [];
    if (!empty($_POST['suv_hero_stats']) && is_array($_POST['suv_hero_stats'])) {
        foreach ($_POST['suv_hero_stats'] as $stat) {
            if (!empty($stat['value']) || !empty($stat['label'])) {
                $data['suv_hero_stats'][] = [
                    'value' => sanitize_text_field($stat['value'] ?? ''),
                    'label' => sanitize_text_field($stat['label'] ?? ''),
                ];
            }
        }
    }

    // Hard Truth Points
    $data['suv_hard_truth_points'] = [];
    if (!empty($_POST['suv_hard_truth_points']) && is_array($_POST['suv_hard_truth_points'])) {
        foreach ($_POST['suv_hard_truth_points'] as $point) {
            $point = sanitize_text_field($point);
            if (!empty($point)) {
                $data['suv_hard_truth_points'][] = $point;
            }
        }
    }

    // MVP Items
    $data['suv_mvp_items'] = [];
    if (!empty($_POST['suv_mvp_items']) && is_array($_POST['suv_mvp_items'])) {
        foreach ($_POST['suv_mvp_items'] as $item) {
            $item = sanitize_text_field($item);
            if (!empty($item)) {
                $data['suv_mvp_items'][] = $item;
            }
        }
    }

    sklentr_save_section('page-content', $data);
    sklentr_trigger_revalidation();
    wp_redirect(admin_url('admin.php?page=sklentr-page-content&saved=1'));
    exit;
});

// =============================================================================
// FOOTER LINKS
// =============================================================================

function sklentr_section_page_footer() {
    $d = sklentr_get_section('footer');
    sklentr_form_header('Footer Links', 'footer');

    // Company Links
    $company_links = $d['footer_company_links'] ?? [
        ['label' => 'About', 'href' => '/about'],
        ['label' => 'Portfolio', 'href' => '/portfolio'],
        ['label' => 'Blog', 'href' => '/blog'],
        ['label' => 'Pricing', 'href' => '/pricing'],
    ];
    echo '<h2>Company Links</h2>';
    echo '<div id="company-links">';
    foreach ($company_links as $i => $item) {
        echo '<div class="repeater-row" style="display:flex;gap:8px;margin-bottom:8px;">';
        echo '<input type="text" name="footer_company_links[' . $i . '][label]" value="' . esc_attr($item['label']) . '" placeholder="Label" style="width:150px;">';
        echo '<input type="text" name="footer_company_links[' . $i . '][href]" value="' . esc_attr($item['href']) . '" placeholder="URL path" style="width:200px;">';
        echo '<button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>';
        echo '</div>';
    }
    echo '</div>';
    echo '<button type="button" class="button" onclick="addCompanyLink()">+ Add Link</button>';
    echo '<script>var cl=' . count($company_links) . ';function addCompanyLink(){var d=document.createElement("div");d.className="repeater-row";d.style="display:flex;gap:8px;margin-bottom:8px;";d.innerHTML=\'<input type="text" name="footer_company_links[\'+cl+\'][label]" placeholder="Label" style="width:150px;"><input type="text" name="footer_company_links[\'+cl+\'][href]" placeholder="URL" style="width:200px;"><button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>\';document.getElementById("company-links").appendChild(d);cl++;}</script>';

    // Service Links
    $service_links = $d['footer_service_links'] ?? [
        ['label' => 'MVP Development', 'href' => '/services'],
        ['label' => 'Website Design', 'href' => '/services'],
        ['label' => 'SEO & Marketing', 'href' => '/services'],
        ['label' => 'Paid Ads', 'href' => '/services'],
        ['label' => 'Video Production', 'href' => '/services'],
    ];
    echo '<h2>Service Links</h2>';
    echo '<div id="service-links">';
    foreach ($service_links as $i => $item) {
        echo '<div class="repeater-row" style="display:flex;gap:8px;margin-bottom:8px;">';
        echo '<input type="text" name="footer_service_links[' . $i . '][label]" value="' . esc_attr($item['label']) . '" placeholder="Label" style="width:150px;">';
        echo '<input type="text" name="footer_service_links[' . $i . '][href]" value="' . esc_attr($item['href']) . '" placeholder="URL path" style="width:200px;">';
        echo '<button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>';
        echo '</div>';
    }
    echo '</div>';
    echo '<button type="button" class="button" onclick="addServiceLink()">+ Add Link</button>';
    echo '<script>var sl=' . count($service_links) . ';function addServiceLink(){var d=document.createElement("div");d.className="repeater-row";d.style="display:flex;gap:8px;margin-bottom:8px;";d.innerHTML=\'<input type="text" name="footer_service_links[\'+sl+\'][label]" placeholder="Label" style="width:150px;"><input type="text" name="footer_service_links[\'+sl+\'][href]" placeholder="URL" style="width:200px;"><button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>\';document.getElementById("service-links").appendChild(d);sl++;}</script>';

    // Legal Links
    $legal_links = $d['footer_legal_links'] ?? [
        ['label' => 'Privacy Policy', 'href' => '/privacy-policy'],
        ['label' => 'Terms of Service', 'href' => '/terms-of-service'],
    ];
    echo '<h2>Legal Links</h2>';
    echo '<div id="legal-links">';
    foreach ($legal_links as $i => $item) {
        echo '<div class="repeater-row" style="display:flex;gap:8px;margin-bottom:8px;">';
        echo '<input type="text" name="footer_legal_links[' . $i . '][label]" value="' . esc_attr($item['label']) . '" placeholder="Label" style="width:150px;">';
        echo '<input type="text" name="footer_legal_links[' . $i . '][href]" value="' . esc_attr($item['href']) . '" placeholder="URL path" style="width:200px;">';
        echo '<button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>';
        echo '</div>';
    }
    echo '</div>';
    echo '<button type="button" class="button" onclick="addLegalLink()">+ Add Link</button>';
    echo '<script>var ll=' . count($legal_links) . ';function addLegalLink(){var d=document.createElement("div");d.className="repeater-row";d.style="display:flex;gap:8px;margin-bottom:8px;";d.innerHTML=\'<input type="text" name="footer_legal_links[\'+ll+\'][label]" placeholder="Label" style="width:150px;"><input type="text" name="footer_legal_links[\'+ll+\'][href]" placeholder="URL" style="width:200px;"><button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>\';document.getElementById("legal-links").appendChild(d);ll++;}</script>';

    sklentr_form_footer();
}

add_action('admin_post_sklentr_save_footer', function () {
    check_admin_referer('sklentr_save_footer', '_sklentr_nonce');
    $data = [
        'footer_company_links' => [],
        'footer_service_links' => [],
        'footer_legal_links'   => [],
    ];
    $link_fields = ['footer_company_links', 'footer_service_links', 'footer_legal_links'];
    foreach ($link_fields as $field) {
        if (!empty($_POST[$field]) && is_array($_POST[$field])) {
            foreach ($_POST[$field] as $item) {
                if (!empty($item['label'])) {
                    $data[$field][] = [
                        'label' => sanitize_text_field($item['label']),
                        'href'  => sanitize_text_field($item['href'] ?? ''),
                    ];
                }
            }
        }
    }
    sklentr_save_section('footer', $data);
    sklentr_trigger_revalidation();
    wp_redirect(admin_url('admin.php?page=sklentr-footer&saved=1'));
    exit;
});

// =============================================================================
// GENERAL SETTINGS
// =============================================================================

function sklentr_section_page_general() {
    wp_enqueue_media();
    $d = sklentr_get_section('general');
    $logo_url = $d['site_logo_url'] ?? '';
    sklentr_form_header('General Settings', 'general');
    echo '<table class="form-table">';
    sklentr_text_field('Site Name', 'site_name', $d['site_name'] ?? 'Sklentr');
    sklentr_text_field('Site Description', 'site_description', $d['site_description'] ?? 'Toronto-based MVP studio that ships launch-ready products in weeks.');

    // Logo upload field
    echo '<tr><th scope="row"><label>Site Logo</label></th><td>';
    echo '<div id="logo-preview" style="margin-bottom:10px;">';
    if ($logo_url) {
        echo '<img src="' . esc_url($logo_url) . '" style="max-height:60px;" />';
    }
    echo '</div>';
    echo '<input type="hidden" id="site_logo_url" name="site_logo_url" value="' . esc_url($logo_url) . '">';
    echo '<button type="button" class="button" id="upload-logo-btn">Upload Logo</button> ';
    echo '<button type="button" class="button" id="remove-logo-btn"' . ($logo_url ? '' : ' style="display:none;"') . '>Remove Logo</button>';
    echo '<p class="description">Upload your site logo (SVG, PNG, or JPG). Used in header and footer.</p>';
    echo '</td></tr>';

    // Favicon upload field
    $favicon_url = $d['site_favicon_url'] ?? '';
    echo '<tr><th scope="row"><label>Favicon</label></th><td>';
    echo '<div id="favicon-preview" style="margin-bottom:10px;">';
    if ($favicon_url) {
        echo '<img src="' . esc_url($favicon_url) . '" style="max-height:32px;" />';
    }
    echo '</div>';
    echo '<input type="hidden" id="site_favicon_url" name="site_favicon_url" value="' . esc_url($favicon_url) . '">';
    echo '<button type="button" class="button" id="upload-favicon-btn">Upload Favicon</button> ';
    echo '<button type="button" class="button" id="remove-favicon-btn"' . ($favicon_url ? '' : ' style="display:none;"') . '>Remove Favicon</button>';
    echo '<p class="description">Upload your favicon (ICO, PNG, or SVG, 32x32 recommended).</p>';
    echo '</td></tr>';

    sklentr_text_field('Contact Email', 'contact_email', $d['contact_email'] ?? 'info@sklentr.com');
    sklentr_text_field('Contact Phone', 'contact_phone', $d['contact_phone'] ?? '+1 647-997-0557');
    sklentr_text_field('Location', 'contact_location', $d['contact_location'] ?? 'Toronto, Ontario, Canada');
    sklentr_url_field('Calendly URL', 'calendly_url', $d['calendly_url'] ?? 'https://calendly.com/sklentr');
    sklentr_url_field('LinkedIn URL', 'social_linkedin', $d['social_linkedin'] ?? '');
    sklentr_url_field('Facebook URL', 'social_facebook', $d['social_facebook'] ?? '');
    sklentr_url_field('Instagram URL', 'social_instagram', $d['social_instagram'] ?? '');
    sklentr_url_field('Twitter/X URL', 'social_twitter', $d['social_twitter'] ?? '');
    echo '</table>';

    // Navigation Items
    $nav_items = $d['nav_items'] ?? [
        ['label' => 'Services', 'href' => '/services'],
        ['label' => 'Startup Visa', 'href' => '/startup-visa'],
        ['label' => 'Portfolio', 'href' => '/portfolio'],
        ['label' => 'Pricing', 'href' => '/pricing'],
        ['label' => 'About', 'href' => '/about'],
        ['label' => 'Blog', 'href' => '/blog'],
    ];
    echo '<h2>Navigation Items</h2>';
    echo '<div id="nav-items">';
    foreach ($nav_items as $i => $item) {
        echo '<div class="repeater-row" style="display:flex;gap:8px;margin-bottom:8px;">';
        echo '<input type="text" name="nav_items[' . $i . '][label]" value="' . esc_attr($item['label']) . '" placeholder="Label" style="width:150px;">';
        echo '<input type="text" name="nav_items[' . $i . '][href]" value="' . esc_attr($item['href']) . '" placeholder="URL path" style="width:200px;">';
        echo '<button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>';
        echo '</div>';
    }
    echo '</div>';
    echo '<button type="button" class="button" onclick="addNavItem()">+ Add Nav Item</button>';

    echo '<script>
    var ni=' . count($nav_items) . ';
    function addNavItem(){
        var d=document.createElement("div");d.className="repeater-row";d.style="display:flex;gap:8px;margin-bottom:8px;";
        d.innerHTML=\'<input type="text" name="nav_items[\'+ni+\'][label]" placeholder="Label" style="width:150px;"><input type="text" name="nav_items[\'+ni+\'][href]" placeholder="URL path" style="width:200px;"><button type="button" class="button" onclick="this.parentElement.remove()">Remove</button>\';
        document.getElementById("nav-items").appendChild(d);ni++;
    }
    jQuery(function($){
        var frame;
        $("#upload-logo-btn").on("click",function(e){
            e.preventDefault();
            if(frame){frame.open();return;}
            frame=wp.media({title:"Select Logo",multiple:false,library:{type:"image"},button:{text:"Use as Logo"}});
            frame.on("select",function(){
                var a=frame.state().get("selection").first().toJSON();
                $("#site_logo_url").val(a.url);
                $("#logo-preview").html(\'<img src="\'+a.url+\'" style="max-height:60px;" />\');
                $("#remove-logo-btn").show();
            });
            frame.open();
        });
        $("#remove-logo-btn").on("click",function(e){
            e.preventDefault();
            $("#site_logo_url").val("");
            $("#logo-preview").html("");
            $(this).hide();
        });
        var faviconFrame;
        $("#upload-favicon-btn").on("click",function(e){
            e.preventDefault();
            if(faviconFrame){faviconFrame.open();return;}
            faviconFrame=wp.media({title:"Select Favicon",multiple:false,library:{type:"image"},button:{text:"Use as Favicon"}});
            faviconFrame.on("select",function(){
                var a=faviconFrame.state().get("selection").first().toJSON();
                $("#site_favicon_url").val(a.url);
                $("#favicon-preview").html(\'<img src="\'+a.url+\'" style="max-height:32px;" />\');
                $("#remove-favicon-btn").show();
            });
            faviconFrame.open();
        });
        $("#remove-favicon-btn").on("click",function(e){
            e.preventDefault();
            $("#site_favicon_url").val("");
            $("#favicon-preview").html("");
            $(this).hide();
        });
    });
    </script>';

    sklentr_form_footer();
}

add_action('admin_post_sklentr_save_general', function () {
    check_admin_referer('sklentr_save_general', '_sklentr_nonce');
    $data = [
        'site_name'        => sanitize_text_field($_POST['site_name'] ?? ''),
        'site_description' => sanitize_text_field($_POST['site_description'] ?? ''),
        'site_logo_url'    => esc_url_raw($_POST['site_logo_url'] ?? ''),
        'site_favicon_url' => esc_url_raw($_POST['site_favicon_url'] ?? ''),
        'contact_email'    => sanitize_email($_POST['contact_email'] ?? ''),
        'contact_phone'    => sanitize_text_field($_POST['contact_phone'] ?? ''),
        'contact_location' => sanitize_text_field($_POST['contact_location'] ?? ''),
        'calendly_url'     => esc_url_raw($_POST['calendly_url'] ?? ''),
        'social_linkedin'  => esc_url_raw($_POST['social_linkedin'] ?? ''),
        'social_facebook'  => esc_url_raw($_POST['social_facebook'] ?? ''),
        'social_instagram' => esc_url_raw($_POST['social_instagram'] ?? ''),
        'social_twitter'   => esc_url_raw($_POST['social_twitter'] ?? ''),
        'nav_items'        => [],
    ];
    if (!empty($_POST['nav_items']) && is_array($_POST['nav_items'])) {
        foreach ($_POST['nav_items'] as $item) {
            if (!empty($item['label'])) {
                $data['nav_items'][] = [
                    'label' => sanitize_text_field($item['label']),
                    'href'  => sanitize_text_field($item['href'] ?? ''),
                ];
            }
        }
    }
    sklentr_save_section('general', $data);
    sklentr_trigger_revalidation();
    wp_redirect(admin_url('admin.php?page=sklentr-general&saved=1'));
    exit;
});

// =============================================================================
// REST API Endpoint - Aggregates all section data
// =============================================================================

add_action('rest_api_init', function () {
    register_rest_route('sklentr/v1', '/site-options', [
        'methods'             => 'GET',
        'callback'            => 'sklentr_rest_site_options',
        'permission_callback' => '__return_true',
    ]);
});

function sklentr_rest_site_options() {
    $sections = ['hero', 'problem', 'whychoose', 'stats', 'process', 'startup-visa', 'final-cta', 'about-page', 'page-content', 'footer', 'general'];
    $data = [];

    foreach ($sections as $section) {
        $section_data = sklentr_get_section($section);
        foreach ($section_data as $key => $value) {
            $data[$key] = $value;
        }
    }

    return rest_ensure_response($data);
}

// =============================================================================
// Trigger ISR revalidation helper
// =============================================================================

function sklentr_trigger_revalidation() {
    $frontend_url = defined('HEADLESS_FRONTEND_URL') ? HEADLESS_FRONTEND_URL : 'http://localhost:3000';
    $secret = defined('REVALIDATION_SECRET') ? REVALIDATION_SECRET : 'local-dev-secret-change-in-production';

    wp_remote_post($frontend_url . '/api/revalidate', [
        'headers' => ['Content-Type' => 'application/json', 'x-revalidate-secret' => $secret],
        'body'    => wp_json_encode(['tag' => 'site-options']),
        'timeout' => 5,
    ]);
}
