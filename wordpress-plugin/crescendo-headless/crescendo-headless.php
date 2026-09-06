<?php
/**
 * Plugin Name: Crescendo Headless
 * Description: Landing page, branded login, price-editing UX, taxonomy/meta and CORS for the Next.js storefront.
 * Version: 2.2.3
 * Author: Tangison Studio
 */

if (!defined('ABSPATH')) {
    exit;
}

define('CRESCENDO_PUBLIC_SITE', 'https://www.crescendona.com');
define('CRESCENDO_SUPPORT_URL', 'https://studio.tangison.com');
define('CRESCENDO_LOGO_URL', 'https://www.crescendona.com/branding/crescendo-logo.webp');
define('CRESCENDO_ICON_URL', 'https://www.crescendona.com/favicon.ico');
define('CRESCENDO_BRAND', '#0ea5b7');
define('CRESCENDO_BRAND_DARK', '#0d92a3');

/* -------------------------------------------------------------------------
 * 1. Product taxonomy + meta (visible in REST + GraphQL)
 *    Priority 100: must run AFTER CPT UI registers the 'product' type,
 *    otherwise register_post_meta('product', ...) silently fails.
 * ---------------------------------------------------------------------- */
add_action('init', function () {
    register_taxonomy('product_category', ['product'], [
        'labels' => [
            'name'          => 'Product Categories',
            'singular_name' => 'Product Category',
        ],
        'public'           => true,
        'hierarchical'     => true,
        'show_ui'          => true,
        'show_in_rest'     => true,
        'rest_base'        => 'product_categories',
        'show_in_graphql'  => true,
        'graphql_single_name' => 'productCategory',
        'graphql_plural_name' => 'productCategories',
        'rewrite'          => ['slug' => 'product-category'],
    ]);

    $meta = [
        'price_cents'    => ['type' => 'integer', 'default' => 0],
        'currency'       => ['type' => 'string',  'default' => 'NAD'],
        'sku'            => ['type' => 'string',  'default' => ''],
        'category_slug'  => ['type' => 'string',  'default' => ''],
        'image_url'      => ['type' => 'string',  'default' => ''],
        'image_url_vercel' => ['type' => 'string', 'default' => ''],
        'brand'          => ['type' => 'string',  'default' => ''],
        'is_published'   => ['type' => 'boolean', 'default' => true],
        'stock_status'   => ['type' => 'string',  'default' => 'instock'],
    ];
    $probe = [];
    foreach ($meta as $key => $args) {
        $reg = register_post_meta('product', $key, [
            'type'            => $args['type'],
            'single'          => true,
            'show_in_rest'    => true,
            'show_in_graphql' => true,
            'auth_callback'   => function () {
                return current_user_can('edit_posts');
            },
            'default'         => $args['default'],
        ]);
        if (!$reg) {
            // Capture WHY (register_meta surfaces a WP_Error where the
            // register_post_meta wrapper hides it).
            $direct = register_meta('post', $key, array_merge($args, [
                'object_subtype'  => 'product',
                'single'          => true,
                'show_in_rest'    => true,
                'show_in_graphql' => true,
                'auth_callback'   => function () {
                    return current_user_can('edit_posts');
                },
            ]));
            $probe[$key] = is_wp_error($direct) ? $direct->get_error_message() : ($direct ? 'retry-ok' : 'silent-false');
        }
    }
    if ($probe) {
        update_option('crescendo_meta_probe', ['at' => time(), 'fails' => $probe], false);
    } else {
        delete_option('crescendo_meta_probe');
    }
}, 100);

/* -------------------------------------------------------------------------
 * 1b. Dedicated `crescendo` REST + GraphQL field (immune to meta-API quirks)
 * ---------------------------------------------------------------------- */
function crescendo_meta_snapshot($post_id) {
    $cents = (int) get_post_meta($post_id, 'price_cents', true);
    return [
        'price_cents'   => $cents,
        'price'         => round($cents / 100, 2),
        'currency'      => (string) get_post_meta($post_id, 'currency', true) ?: 'NAD',
        'sku'           => (string) get_post_meta($post_id, 'sku', true),
        'category_slug' => (string) get_post_meta($post_id, 'category_slug', true),
        'image_url'     => (string) get_post_meta($post_id, 'image_url', true),
        'image_url_vercel' => (string) get_post_meta($post_id, 'image_url_vercel', true),
        'brand'         => (string) get_post_meta($post_id, 'brand', true),
        'stock_status'  => (string) get_post_meta($post_id, 'stock_status', true) ?: 'instock',
        'is_published'  => (bool) get_post_meta($post_id, 'is_published', true),
    ];
}

add_action('rest_api_init', function () {
    register_rest_field('product', 'crescendo', [
        'get_callback' => function ($post) {
            return crescendo_meta_snapshot($post['id']);
        },
        'update_callback' => function ($value, $post) {
            if (!current_user_can('edit_post', $post->ID)) {
                return new WP_Error('rest_forbidden', 'Cannot edit product data.', ['status' => 403]);
            }
            $map = [
                'price_cents'      => 'intval',
                'currency'         => 'sanitize_text_field',
                'sku'              => 'sanitize_text_field',
                'category_slug'    => 'sanitize_key',
                'image_url'        => 'esc_url_raw',
                'image_url_vercel' => 'esc_url_raw',
                'brand'            => 'sanitize_text_field',
                'stock_status'     => 'sanitize_key',
            ];
            if (isset($value['is_published'])) {
                update_post_meta($post->ID, 'is_published', $value['is_published'] ? '1' : '0');
            }
            foreach ($map as $key => $sanitizer) {
                if (isset($value[$key])) {
                    update_post_meta($post->ID, $key, call_user_func($sanitizer, $value[$key]));
                }
            }
            return true;
        },
        'schema' => [
            'description' => 'Crescendo catalogue fields',
            'type'        => 'object',
            'context'     => ['view', 'edit'],
        ],
    ]);
});

/* -------------------------------------------------------------------------
 * 2. CORS for the Next.js storefront (REST + GraphQL)
 * ---------------------------------------------------------------------- */
function crescendo_allowed_origins() {
    return [
        'https://www.crescendona.com',
        'https://crescendona.com',
        'https://crescendona.vercel.app',
        'http://localhost:3000',
    ];
}

add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        $origin = get_http_origin();
        if ($origin && in_array($origin, crescendo_allowed_origins(), true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Credentials: true');
        }
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
        header('Vary: Origin');
        return $value;
    });
});

add_filter('graphql_response_headers_to_send', function ($headers) {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    if ($origin && in_array($origin, crescendo_allowed_origins(), true)) {
        $headers['Access-Control-Allow-Origin']      = $origin;
        $headers['Access-Control-Allow-Credentials'] = 'true';
    }
    return $headers;
});

/* -------------------------------------------------------------------------
 * 3. Landing page (front page of the backend)
 * ---------------------------------------------------------------------- */
function crescendo_render_landing() {
    $published = 0;
    $counts = wp_count_posts('product');
    if ($counts && isset($counts->publish)) {
        $published = (int) $counts->publish;
    }
    $cat_count = wp_count_terms(['taxonomy' => 'product_category', 'hide_empty' => false]);
    $cats = is_wp_error($cat_count) ? 0 : (int) $cat_count;
    $login = wp_login_url();
    $year  = gmdate('Y');

    $html = '<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Crescendo Namibia — Staff Backend</title>
<link rel="icon" href="' . esc_url(CRESCENDO_ICON_URL) . '" sizes="any">
<link rel="apple-touch-icon" href="' . esc_url(wp_upload_dir()['baseurl'] . '/2026/08/crescendo-apple-icon.png') . '">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    min-height:100vh; display:flex; align-items:center; justify-content:center;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background:#0b1220; color:#e6edf3; padding:24px; position:relative; overflow-x:hidden;
  }
  body::before {
    content:""; position:fixed; width:60vw; height:60vw; top:-20vw; right:-15vw; border-radius:50%;
    background:radial-gradient(circle, rgba(14,165,183,.22), transparent 65%); pointer-events:none;
  }
  body::after {
    content:""; position:fixed; width:50vw; height:50vw; bottom:-18vw; left:-12vw; border-radius:50%;
    background:radial-gradient(circle, rgba(56,189,248,.12), transparent 65%); pointer-events:none;
  }
  .card {
    position:relative; z-index:1; width:100%; max-width:560px; text-align:center;
    background:rgba(17,24,39,.82); border:1px solid rgba(148,163,184,.16);
    border-radius:24px; padding:48px 40px 36px;
    box-shadow:0 24px 80px rgba(2,8,20,.6); backdrop-filter:blur(6px);
  }
  .logo { width:96px; height:96px; margin:0 auto 20px; display:block; filter:drop-shadow(0 8px 24px rgba(14,165,183,.35)); }
  h1 { font-size:28px; letter-spacing:.02em; margin-bottom:6px; }
  .sub { color:#94a3b8; font-size:15px; margin-bottom:26px; }
  .stats { display:flex; gap:12px; justify-content:center; margin-bottom:30px; }
  .stat { background:rgba(14,165,183,.08); border:1px solid rgba(14,165,183,.25); border-radius:14px; padding:12px 20px; min-width:110px; }
  .stat b { display:block; font-size:22px; color:#22d3ee; }
  .stat span { font-size:11px; text-transform:uppercase; letter-spacing:.08em; color:#94a3b8; }
  .btns { display:flex; flex-direction:column; gap:12px; }
  .btn { display:flex; align-items:center; justify-content:center; gap:10px; padding:15px 22px; border-radius:12px;
         font-weight:700; font-size:15px; text-decoration:none; transition:transform .15s ease, filter .15s ease; }
  .btn:hover { transform:translateY(-2px); filter:brightness(1.08); }
  .btn-primary { background:linear-gradient(135deg, #0ea5b7, #0284c7); color:#fff; box-shadow:0 10px 30px rgba(14,165,183,.35); }
  .btn-light { background:#f1f5f9; color:#0f172a; }
  .btn-ghost { background:transparent; color:#94a3b8; border:1px solid rgba(148,163,184,.3); }
  .btn-ghost:hover { color:#e2e8f0; border-color:rgba(148,163,184,.6); }
  .foot { margin-top:30px; padding-top:22px; border-top:1px solid rgba(148,163,184,.14);
          font-size:12.5px; color:#64748b; line-height:1.7; }
  .foot a { color:#22d3ee; text-decoration:none; }
  .foot a:hover { text-decoration:underline; }
  .tagline { color:#22d3ee; font-weight:700; letter-spacing:.14em; text-transform:uppercase; font-size:11px; }
  @media (max-width:480px) { .card { padding:36px 22px 28px; } .stats { flex-wrap:wrap; } }
</style>
</head>
<body>
  <main class="card">
    <img class="logo" src="' . esc_url(CRESCENDO_LOGO_URL) . '" alt="Crescendo Namibia logo">
    <h1>Crescendo Namibia</h1>
    <p class="sub">Staff backend &middot; catalogue, pricing &amp; content control</p>
    <div class="stats">
      <div class="stat"><b>' . esc_html(number_format_i18n($published)) . '</b><span>Products</span></div>
      <div class="stat"><b>' . esc_html(number_format_i18n($cats)) . '</b><span>Categories</span></div>
      <div class="stat"><b>REST + GraphQL</b><span>API online</span></div>
    </div>
    <div class="btns">
      <a class="btn btn-primary" href="' . esc_url(CRESCENDO_PUBLIC_SITE) . '" target="_blank" rel="noopener">View Public Site &#8599;</a>
      <a class="btn btn-light" href="' . esc_url($login) . '">Staff Login</a>
      <a class="btn btn-ghost" href="' . esc_url(CRESCENDO_SUPPORT_URL) . '" target="_blank" rel="noopener">Support &mdash; Tangison Studio</a>
    </div>
    <div class="foot">
      <div class="tagline">Strive for Excellence</div>
      Shop 19, Old Power Station, Southern Industrial, Windhoek<br>
      &copy; ' . esc_html($year) . ' <a href="' . esc_url(CRESCENDO_SUPPORT_URL) . '" target="_blank" rel="noopener">Tangison Studio</a> &middot; <a href="mailto:hello@crescendona.com">hello@crescendona.com</a>
    </div>
  </main>
</body>
</html>';

    return $html;
}

add_action('template_redirect', function () {
    if (is_front_page() && !is_admin() && !is_feed()) {
        header('Content-Type: text/html; charset=utf-8');
        header('X-Robots-Tag: noindex, nofollow');
        nocache_headers();
        echo crescendo_render_landing(); // phpcs:ignore WordPress.Security.EscapeOutput -- fully escaped in renderer
        exit;
    }
});

/* -------------------------------------------------------------------------
 * 4. Branded login page
 * ---------------------------------------------------------------------- */
add_action('login_head', function () {
    $icon_apple = wp_upload_dir()['baseurl'] . '/2026/08/crescendo-apple-icon.png';
    ?>
<link rel="icon" href="<?php echo esc_url(CRESCENDO_ICON_URL); ?>" sizes="any">
<link rel="apple-touch-icon" href="<?php echo esc_url($icon_apple); ?>">
<style>
  body.login {
    background:#0b1220;
    background-image:
      radial-gradient(50vw 50vw at 85% 0%, rgba(14,165,183,.20), transparent 65%),
      radial-gradient(45vw 45vw at 0% 100%, rgba(56,189,248,.12), transparent 65%);
  }
  body.login #login { padding-top: 7vh; width: 340px; }
  body.login h1 a {
    background-image: url('<?php echo esc_url(CRESCENDO_LOGO_URL); ?>') !important;
    background-size: contain !important;
    background-position: center bottom !important;
    width: 150px !important; height: 150px !important; margin: 0 auto 8px !important;
    filter: drop-shadow(0 8px 24px rgba(14,165,183,.35));
  }
  body.login form {
    border-radius: 16px; border: 1px solid rgba(148,163,184,.25);
    box-shadow: 0 18px 60px rgba(2,8,20,.55) !important; padding: 30px 26px 28px;
  }
  body.login form .input, body.login input[type="text"] { border-radius: 8px; }
  body.login .button-primary {
    background: <?php echo esc_attr(CRESCENDO_BRAND); ?> !important;
    border-color: <?php echo esc_attr(CRESCENDO_BRAND); ?> !important;
    text-shadow: none !important; border-radius: 8px !important; font-weight: 600;
    min-height: 40px;
  }
  body.login .button-primary:hover, body.login .button-primary:focus {
    background: <?php echo esc_attr(CRESCENDO_BRAND_DARK); ?> !important;
    border-color: <?php echo esc_attr(CRESCENDO_BRAND_DARK); ?> !important;
  }
  body.login #nav a, body.login #backtoblog a { color: rgba(226,232,240,.75) !important; }
  body.login #nav a:hover, body.login #backtoblog a:hover { color: #22d3ee !important; }
  body.login .language-switcher { border-top: 0; }
  body.login #login_error, body.login .message { border-radius: 8px; }
</style>
    <?php
});

add_filter('login_logo_url', function () {
    return CRESCENDO_PUBLIC_SITE;
});
add_filter('login_logo_url_title', function () {
    return 'Crescendo Namibia — view the public site';
});
add_filter('login_backtourl', function () {
    return CRESCENDO_PUBLIC_SITE;
});

/* -------------------------------------------------------------------------
 * 5. Admin branding: favicon, footer credit, public-site link, welcome widget
 * ---------------------------------------------------------------------- */
add_action('admin_head', function () {
    $icon_apple = wp_upload_dir()['baseurl'] . '/2026/08/crescendo-apple-icon.png';
    echo '<link rel="icon" href="' . esc_url(CRESCENDO_ICON_URL) . '" sizes="any">' . "\n";
    echo '<link rel="apple-touch-icon" href="' . esc_url($icon_apple) . '">' . "\n";
});

add_filter('admin_footer_text', function () {
    return 'Crescendo Namibia backend &middot; built by <a href="' . esc_url(CRESCENDO_SUPPORT_URL) . '" target="_blank" rel="noopener">Tangison Studio</a> &middot; <a href="' . esc_url(CRESCENDO_SUPPORT_URL) . '" target="_blank" rel="noopener">Support</a>';
});

add_action('admin_bar_menu', function ($bar) {
    $bar->add_node([
        'id'    => 'crescendo-public-site',
        'title' => 'Public Site &#8599;',
        'href'  => CRESCENDO_PUBLIC_SITE,
        'meta'  => ['target' => '_blank'],
    ]);
}, 100);

function crescendo_dashboard_widget() {
    $published = 0;
    $counts = wp_count_posts('product');
    if ($counts && isset($counts->publish)) {
        $published = (int) $counts->publish;
    }
    $cat_count = wp_count_terms(['taxonomy' => 'product_category', 'hide_empty' => false]);
    $cats = is_wp_error($cat_count) ? 0 : (int) $cat_count;
    ?>
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px;">
        <img src="<?php echo esc_url(CRESCENDO_LOGO_URL); ?>" alt="" style="width:44px;height:44px;">
        <div>
            <strong>Crescendo Namibia</strong><br>
            <span style="color:#64748b;font-size:12px;">Staff backend &middot; Strive for Excellence</span>
        </div>
    </div>
    <p style="margin:0 0 10px;">
        <span style="font-size:20px;font-weight:700;color:#0ea5b7;"><?php echo esc_html(number_format_i18n($published)); ?></span>
        products &middot;
        <span style="font-size:20px;font-weight:700;color:#0ea5b7;"><?php echo esc_html(number_format_i18n($cats)); ?></span>
        categories
    </p>
    <p style="margin:0 0 6px;"><a class="button button-primary" href="<?php echo esc_url(CRESCENDO_PUBLIC_SITE); ?>" target="_blank" rel="noopener">View Public Site &#8599;</a>
    <a class="button" href="<?php echo esc_url(admin_url('edit.php?post_type=product')); ?>">Product catalogue</a></p>
    <p style="margin:0;color:#64748b;font-size:12px;">
        Issues or new features? <a href="<?php echo esc_url(CRESCENDO_SUPPORT_URL); ?>" target="_blank" rel="noopener">Tangison Studio support &#8599;</a>
    </p>
    <?php
}

add_action('wp_dashboard_setup', function () {
    wp_add_dashboard_widget('crescendo_welcome', 'Crescendo Namibia — Quick Links', 'crescendo_dashboard_widget');
});

/* -------------------------------------------------------------------------
 * 6. Price & product-data editing UX
 * ---------------------------------------------------------------------- */
add_action('add_meta_boxes', function () {
    add_meta_box('crescendo_product_data', 'Crescendo Product Data', 'crescendo_product_data_box', 'product', 'normal', 'high');
});

function crescendo_product_data_box($post) {
    wp_nonce_field('crescendo_product_data_save', 'crescendo_product_data_nonce');

    $price_cents = (int) get_post_meta($post->ID, 'price_cents', true);
    $price       = number_format($price_cents / 100, 2, '.', '');
    $sku         = (string) get_post_meta($post->ID, 'sku', true);
    $brand       = (string) get_post_meta($post->ID, 'brand', true);
    $stock       = (string) get_post_meta($post->ID, 'stock_status', true);
    if ('' === $stock) {
        $stock = 'instock';
    }
    $category_slug = (string) get_post_meta($post->ID, 'category_slug', true);
    $image_url     = (string) get_post_meta($post->ID, 'image_url', true);
    ?>
    <style>
        .crescendo-grid { display:grid; grid-template-columns: 1fr 1fr; gap: 16px 24px; max-width: 980px; }
        .crescendo-grid .full { grid-column: 1 / -1; }
        .crescendo-grid label { display:block; font-weight:600; margin-bottom:4px; }
        .crescendo-grid .desc { color:#64748b; font-size:12px; margin-top:4px; }
        .crescendo-price-field { font-size:20px !important; max-width:220px; font-weight:700; color:#0e7490; }
        .crescendo-price-prefix { font-size:16px; font-weight:700; vertical-align:middle; margin-right:4px; }
        .crescendo-img-preview { max-width:180px; max-height:180px; border:1px solid #dcdcde; border-radius:10px; padding:6px; background:#fff; }
        @media (max-width: 782px) { .crescendo-grid { grid-template-columns: 1fr; } }
    </style>
    <div class="crescendo-grid">
        <div>
            <label for="crescendo_price">Price (N$)</label>
            <span class="crescendo-price-prefix">N$</span>
            <input type="text" id="crescendo_price" name="crescendo_price" value="<?php echo esc_attr($price); ?>" placeholder="0.00" class="crescendo-price-field" inputmode="decimal">
            <p class="desc">Namibian dollars, e.g. <code>16375.00</code>. Saved automatically as cents for the storefront.</p>
        </div>
        <div>
            <label for="crescendo_stock">Stock status</label>
            <select id="crescendo_stock" name="crescendo_stock" style="width:100%;max-width:240px;">
                <option value="instock"     <?php selected($stock, 'instock'); ?>>In stock</option>
                <option value="lowstock"    <?php selected($stock, 'lowstock'); ?>>Low stock</option>
                <option value="outofstock"  <?php selected($stock, 'outofstock'); ?>>Out of stock</option>
            </select>
        </div>
        <div>
            <label for="crescendo_sku">SKU</label>
            <input type="text" id="crescendo_sku" name="crescendo_sku" value="<?php echo esc_attr($sku); ?>" class="regular-text" placeholder="e.g. ADV-EAR-BLK">
        </div>
        <div>
            <label for="crescendo_brand">Brand</label>
            <input type="text" id="crescendo_brand" name="crescendo_brand" value="<?php echo esc_attr($brand); ?>" class="regular-text" placeholder="e.g. Roland">
        </div>
        <div class="full">
            <label for="crescendo_category_slug">Category slug</label>
            <input type="text" id="crescendo_category_slug" name="crescendo_category_slug" value="<?php echo esc_attr($category_slug); ?>" class="regular-text" placeholder="accessories / drums / keyboards / pro-audio / strings / wind">
        </div>
        <div class="full">
            <label for="crescendo_image_url">Image URL (served from the public site)</label>
            <input type="url" id="crescendo_image_url" name="crescendo_image_url" value="<?php echo esc_attr($image_url); ?>" class="large-text code" placeholder="https://www.crescendona.com/products/&lt;category&gt;/&lt;slug&gt;.webp">
            <?php if ($image_url) : ?>
                <p><img class="crescendo-img-preview" src="<?php echo esc_url($image_url); ?>" alt="Product image preview"></p>
            <?php endif; ?>
            <p class="desc">Images stay on crescendona.com (Vercel) — never upload catalogue photos to this server.</p>
        </div>
    </div>
    <?php
}

/**
 * Accepts messy human price input and normalises it to a float of N$.
 * Handles: "16375", "16375.00", "16,375", "16 375,50", "N$1,234.56".
 * Returns [ok(bool), price(float), error(string)].
 */
function crescendo_parse_price($raw) {
    $clean = preg_replace('/[^\d.,]/', '', (string) $raw);
    if ('' === $clean) {
        return [false, 0.0, 'Price contained no digits.'];
    }
    $has_comma = false !== strpos($clean, ',');
    $has_dot   = false !== strpos($clean, '.');

    if ($has_comma && $has_dot) {
        // Whichever separator comes last is the decimal mark.
        if (strrpos($clean, ',') > strrpos($clean, '.')) {
            $clean = str_replace('.', '', $clean);
            $clean = str_replace(',', '.', $clean);
        } else {
            $clean = str_replace(',', '', $clean);
        }
    } elseif ($has_comma) {
        // Comma-only input: "16,375" / "1,234,567" are thousands groups;
        // "16,38" / "16375,50" / "0,5" use the comma as a decimal mark.
        $parts       = explode(',', $clean);
        $tail_groups = array_slice($parts, 1);
        $all_three   = true;
        foreach ($tail_groups as $g) {
            if (3 !== strlen($g)) {
                $all_three = false;
                break;
            }
        }
        if ($all_three) {
            $clean = str_replace(',', '', $clean);
        } else {
            $last_comma = strrpos($clean, ',');
            $clean      = substr_replace($clean, '.', $last_comma, 1);
            $clean      = str_replace(',', '', $clean);
        }
    }

    if (!is_numeric($clean)) {
        return [false, 0.0, 'Could not read the price "' . $raw . '".'];
    }
    $price = (float) $clean;
    if ($price < 0) {
        return [false, 0.0, 'Price cannot be negative.'];
    }
    if ($price > 1000000) {
        return [false, 0.0, 'Price over N$ 1,000,000 — refusing to save, probably a typo.'];
    }
    return [true, $price, ''];
}

add_action('save_post_product', function ($post_id, $post, $update) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (wp_is_post_revision($post_id)) {
        return;
    }
    if (!isset($_POST['crescendo_product_data_nonce'])) {
        return;
    }
    if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['crescendo_product_data_nonce'])), 'crescendo_product_data_save')) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $user_id = get_current_user_id();

    if (isset($_POST['crescendo_price'])) {
        $raw = sanitize_text_field(wp_unslash($_POST['crescendo_price']));
        if ('' !== $raw) {
            [$ok, $price, $err] = crescendo_parse_price($raw);
            if ($ok) {
                update_post_meta($post_id, 'price_cents', (int) round($price * 100));
                delete_transient('crescendo_price_error_' . $user_id);
            } else {
                set_transient('crescendo_price_error_' . $user_id, $err, 60);
            }
        }
    }

    $fields = [
        'sku'            => 'sanitize_text_field',
        'brand'          => 'sanitize_text_field',
        'category_slug'  => 'sanitize_key',
    ];
    foreach ($fields as $key => $sanitizer) {
        if (isset($_POST['crescendo_' . $key])) {
            update_post_meta($post_id, $key, call_user_func($sanitizer, wp_unslash($_POST['crescendo_' . $key])));
        }
    }

    if (isset($_POST['crescendo_stock'])) {
        $stock = sanitize_key(wp_unslash($_POST['crescendo_stock']));
        if (in_array($stock, ['instock', 'lowstock', 'outofstock'], true)) {
            update_post_meta($post_id, 'stock_status', $stock);
        }
    }

    if (isset($_POST['crescendo_image_url'])) {
        $url = esc_url_raw(wp_unslash($_POST['crescendo_image_url']));
        update_post_meta($post_id, 'image_url', $url);
    }
}, 10, 3);

add_action('admin_notices', function () {
    $user_id = get_current_user_id();
    $err = get_transient('crescendo_price_error_' . $user_id);
    if ($err) {
        delete_transient('crescendo_price_error_' . $user_id);
        printf(
            '<div class="notice notice-error is-dismissible"><p><strong>Price not saved:</strong> %s</p></div>',
            esc_html($err)
        );
    }
});

/* -------------------------------------------------------------------------
 * 7. Product list table: image, price, SKU, brand columns
 * ---------------------------------------------------------------------- */
add_filter('manage_product_posts_columns', function ($columns) {
    $new = [];
    foreach ($columns as $key => $label) {
        $new[$key] = $label;
        if ('title' === $key) {
            $new['crescendo_thumb'] = 'Image';
            $new['crescendo_price'] = 'Price (N$)';
            $new['crescendo_sku']   = 'SKU';
            $new['crescendo_brand'] = 'Brand';
        }
    }
    return $new;
});

add_action('manage_product_posts_custom_column', function ($column, $post_id) {
    if ('crescendo_thumb' === $column) {
        $url = (string) get_post_meta($post_id, 'image_url', true);
        if ($url) {
            printf('<img src="%s" alt="" style="width:44px;height:44px;object-fit:contain;border-radius:6px;border:1px solid #dcdcde;background:#fff;">', esc_url($url));
        } else {
            echo '<span style="color:#a7aaad;">—</span>';
        }
    } elseif ('crescendo_price' === $column) {
        $cents = (int) get_post_meta($post_id, 'price_cents', true);
        printf('<strong style="color:#0e7490;">N$ %s</strong>', esc_html(number_format($cents / 100, 2)));
    } elseif ('crescendo_sku' === $column) {
        $sku = (string) get_post_meta($post_id, 'sku', true);
        echo $sku ? esc_html($sku) : '<span style="color:#a7aaad;">—</span>';
    } elseif ('crescendo_brand' === $column) {
        $brand = (string) get_post_meta($post_id, 'brand', true);
        echo $brand ? esc_html($brand) : '<span style="color:#a7aaad;">—</span>';
    }
}, 10, 2);

add_filter('manage_edit-product_sortable_columns', function ($columns) {
    $columns['crescendo_price'] = 'price_cents';
    return $columns;
});

add_action('pre_get_posts', function ($query) {
    if (!is_admin() || !$query->is_main_query()) {
        return;
    }
    if ('price_cents' === $query->get('orderby')) {
        $query->set('meta_key', 'price_cents');
        $query->set('orderby', 'meta_value_num');
    }
});

/* -------------------------------------------------------------------------
 * 8. Optimisation defaults for Admin Site Enhancements (ASE)
 *    Applied exactly once; an admin's later changes are never overwritten.
 * ---------------------------------------------------------------------- */
add_action('admin_init', function () {
    $flag = 'crescendo_ase_defaults_v5';
    if (get_option($flag)) {
        return;
    }
    if (!current_user_can('manage_options')) {
        return;
    }

    $current = get_option('admin_site_enhancements');
    if (!is_array($current)) {
        $current = [];
    }

    /* ASE stores checkboxes as the STRING '1' — ints get wiped by its
     * strict sanitize callback ('1' === $value). Strings everywhere. */
    $defaults = [
        'disable_smaller_components'         => '1',
        'disable_xmlrpc'                     => '1',
        'disable_emoji_support'              => '1',
        'disable_comments'                   => '1',
        'disable_comments_for'               => ['post' => '1', 'page' => '1', 'attachment' => '1'],
        'disable_dashboard_widgets'          => '1',
        'disabled_dashboard_widgets'         => [
            'dashboard_primary__side__core'       => '1',
            'dashboard_primary__normal__core'     => '1',
            'dashboard_quick_press__side__core'   => '1',
            'dashboard_quick_press__normal__core' => '1',
            'dashboard_activity__normal__core'    => '1',
            'dashboard_activity__side__core'      => '1',
            'dashboard_site_health__normal__core' => '1',
            'dashboard_site_health__side__core'   => '1',
        ],
        'disable_welcome_panel_in_dashboard' => '1',
        'hide_ab_wp_logo_menu'               => '1',
        'hide_ab_comments_menu'              => '1',
        'disable_feeds'                      => '1',
        'disable_head_generator_tag'         => '1',
        'disable_head_rsd_tag'               => '1',
        'disable_head_wlwmanifest_tag'       => '1',
        'disable_head_shortlink_tag'         => '1',
        'disable_author_archives'            => '1',
        'show_id_column'                     => '1',
        'enable_revisions_control'           => '1',
        'revisions_max_number'               => '3',
        'enable_revisions_control_for'       => ['post' => '1', 'page' => '1'],
        'search_engine_visibility_status'    => '1',
    ];

    /*
     * Force-set these keys exactly once. Some settings sanitizers read the
     * $_POST superglobal instead of the passed value, so we fake it, write,
     * read back, and if the sanitizer still mangled the data we write the
     * option directly to the database (bypassing sanitize entirely).
     */
    $merged = array_merge($current, $defaults);

    $_POST['admin_site_enhancements'] = $defaults; // phpcs:ignore WordPress.WP
    update_option('admin_site_enhancements', $merged, false);
    unset($_POST['admin_site_enhancements']); // phpcs:ignore WordPress.WP
    wp_cache_delete('admin_site_enhancements', 'options');

    $check = get_option('admin_site_enhancements');
    if (!is_array($check) || ('1' !== ($check['disable_xmlrpc'] ?? ''))) {
        global $wpdb;
        $wpdb->query($wpdb->prepare(
            "UPDATE {$wpdb->options} SET option_value = %s WHERE option_name = %s",
            maybe_serialize($merged),
            'admin_site_enhancements'
        ));
        wp_cache_delete('admin_site_enhancements', 'options');
        wp_cache_flush();
    }
    // Discourage search engines on this backend (core option, no sanitizer games).
    if ('0' !== (string) get_option('blog_public', '1')) {
        update_option('blog_public', '0');
    }
    update_option($flag, 1, false);
});

/* One file per upload: no intermediate sizes, no scaled copies.
 * Keeps InfinityFree's 30k inode budget under control. */
add_filter('intermediate_image_sizes_advanced', function ($sizes) {
    return [];
});
add_filter('big_image_size_threshold', function () {
    return false;
});


/* -------------------------------------------------------------------------
 * 9. Bulk price editor (Products → Bulk Price Editor)
 * ---------------------------------------------------------------------- */
add_action('admin_menu', function () {
    add_submenu_page('edit.php?post_type=product', 'Bulk Price Editor', 'Bulk Price Editor', 'edit_posts', 'crescendo-bulk-price', 'crescendo_bulk_price_page');
});

function crescendo_bulk_price_page() {
    $updated = 0; $errors = 0; $err_msgs = [];
    if (isset($_POST['crescendo_bulk_save']) && check_admin_referer('crescendo_bulk_price_save', 'crescendo_bulk_price_nonce')) {
        if (current_user_can('edit_posts') && isset($_POST['crescendo_price_new']) && is_array($_POST['crescendo_price_new'])) {
            foreach (wp_unslash($_POST['crescendo_price_new']) as $pid => $raw) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput -- sanitized below
                $raw  = trim((string) $raw);
                $pid  = intval($pid);
                if ('' === $raw || $pid <= 0 || get_post_type($pid) !== 'product') continue;
                if (!current_user_can('edit_post', $pid)) continue;
                $old   = (int) get_post_meta($pid, 'price_cents', true);
                $parse = crescendo_parse_price(sanitize_text_field($raw));
                if ($parse[0]) {
                    $cents = (int) round($parse[1] * 100);
                    if ($cents !== $old) { update_post_meta($pid, 'price_cents', $cents); $updated++; }
                } else { $errors++; $err_msgs[] = get_the_title($pid) . ': ' . $parse[2]; }
            }
        }
        if ($updated) echo '<div class="notice notice-success"><p>Bulk update: <strong>' . intval($updated) . '</strong> prices updated' . ($errors ? ', ' . intval($errors) . ' invalid skipped' : '') . '.</p></div>';
        elseif ($errors) echo '<div class="notice notice-error"><p>No changes saved. ' . intval($errors) . ' invalid entries: ' . esc_html(implode(' · ', array_slice($err_msgs, 0, 3))) . '</p></div>';
        else echo '<div class="notice notice-info"><p>No price changes detected.</p></div>';
    }

    $paged = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
    $cat   = isset($_GET['crescendo_cat']) ? sanitize_key($_GET['crescendo_cat']) : '';
    $s     = isset($_GET['s']) ? sanitize_text_field($_GET['s']) : '';
    $args  = ['post_type'=>'product', 'post_status'=>'any', 'posts_per_page'=>50, 'paged'=>$paged, 'orderby'=>'title', 'order'=>'ASC'];
    if ($cat) { $args['tax_query'] = [['taxonomy'=>'product_category', 'field'=>'slug', 'terms'=>$cat]]; }
    if ($s)   { $args['s'] = $s; }
    $q = new WP_Query($args);
    $cats = get_terms(['taxonomy'=>'product_category', 'hide_empty'=>false]);
    ?>
    <div class="wrap">
        <h1>Bulk Price Editor</h1>
        <p>Type new prices in Namibian dollars (accepts <code>16,375</code>, <code>N$360.00</code>, <code>595</code>). Blank rows are ignored. Prices save as cents for the storefront.</p>
        <form method="get">
            <input type="hidden" name="post_type" value="product">
            <input type="hidden" name="page" value="crescendo-bulk-price">
            <select name="crescendo_cat"><option value="">All categories</option>
                <?php foreach ((array) $cats as $t) printf('<option value="%s"%s>%s</option>', esc_attr($t->slug), selected($cat, $t->slug, false), esc_html($t->name)); ?>
            </select>
            <input type="search" name="s" value="<?php echo esc_attr($s); ?>" placeholder="Search products…">
            <button class="button">Filter</button>
        </form>
        <form method="post">
            <?php wp_nonce_field('crescendo_bulk_price_save', 'crescendo_bulk_price_nonce'); ?>
            <table class="widefat striped" style="margin-top:12px;">
                <thead><tr><th style="width:46%">Product</th><th>Current price</th><th style="width:24%">New price (N$)</th></tr></thead>
                <tbody>
                <?php while ($q->have_posts()): $q->the_post();
                    $pid   = get_the_ID();
                    $cents = (int) get_post_meta($pid, 'price_cents', true);
                    $cur   = $cents > 0 ? number_format($cents / 100, 2, '.', '') : '';
                    $thumb = (string) get_post_meta($pid, 'image_url', true);
                ?>
                <tr>
                    <td><?php if ($thumb) printf('<img src="%s" style="width:32px;height:32px;object-fit:contain;vertical-align:middle;margin-right:8px;" alt="">', esc_url($thumb)); ?>
                        <a href="<?php echo esc_url(get_edit_post_link($pid)); ?>"><?php echo esc_html(get_the_title()); ?></a>
                        <?php if (!$cur) echo '<em style="color:#a7aaad;">— no price yet</em>'; ?></td>
                    <td><strong style="color:#0e7490;"><?php echo $cur ? 'N$ ' . esc_html(number_format($cents / 100, 2)) : '—'; ?></strong></td>
                    <td><input type="text" name="crescendo_price_new[<?php echo intval($pid); ?>]" value="<?php echo esc_attr($cur); ?>" class="regular-text" inputmode="decimal"></td>
                </tr>
                <?php endwhile; ?>
                </tbody>
            </table>
            <p><button class="button button-primary button-hero" name="crescendo_bulk_save" value="1">Save changed prices</button></p>
        </form>
        <div class="tablenav"><div class="tablenav-pages">
        <?php
        echo paginate_links(['total' => $q->max_num_pages, 'current' => $paged, 'add_args' => array_filter(['crescendo_cat'=>$cat, 's'=>$s])]);
        ?>
        </div></div>
    </div>
    <?php
    wp_reset_postdata();
}

/* Cap revisions for products so the 50 MB database does not bloat. */
add_filter('wp_revisions_to_keep', function ($num, $post) {
    if ($post instanceof WP_Post && 'product' === $post->post_type) {
        return 3;
    }
    return $num;
}, 10, 2);
