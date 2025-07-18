# WordPress Integration Configuration

## Quick Setup Guide

### 1. Update Your WordPress Site URL

Edit `blog.html` and replace `'https://yourdomain.com'` with your actual WordPress site URL:

```javascript
const WORDPRESS_SITE_URL = 'https://your-wordpress-site.com'; // 👈 Update this!
```

### 2. Enable WordPress REST API

The WordPress REST API is enabled by default in WordPress 4.7+. You can test it by visiting:
```
https://your-wordpress-site.com/wp-json/wp/v2/posts
```

### 3. CORS Configuration (If Needed)

If you encounter CORS errors, add this to your WordPress `functions.php`:

```php
// Enable CORS for WordPress REST API
function add_cors_http_header(){
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
}
add_action('init','add_cors_http_header');

// CORS for REST API
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type');
        return $value;
    });
}, 15);
```

### 4. WordPress Plugin Alternative (Recommended)

Install the **"WP CORS" plugin** from the WordPress plugin directory:
1. Go to WordPress Admin → Plugins → Add New
2. Search for "WP CORS"
3. Install and activate
4. Configure to allow your Static Web App domain

### 5. Category Mapping

The integration automatically maps WordPress categories to colors:
- **Microsoft 365** → Blue
- **Power Platform** → Purple  
- **Business Strategy** → Green
- **Azure** → Blue
- **Default** → Gray

Add these categories in WordPress Admin → Posts → Categories.

### 6. Featured Images

For best results, ensure your WordPress posts have:
- Featured images (recommended size: 800x400px)
- Proper post excerpts
- Categories assigned

### 7. Testing

1. Open browser developer tools (F12)
2. Go to your blog page
3. Check the Console tab for any errors
4. Verify posts are loading from: `https://your-site.com/wp-json/wp/v2/posts`

## Alternative Integration Methods

### Option A: WordPress Plugin (Easiest)
Install **"WP REST API"** plugin for enhanced functionality and easier CORS management.

### Option B: Azure Functions Proxy (Advanced)
Create an Azure Function to proxy WordPress API calls and handle CORS:

```javascript
// api/wordpress-proxy/index.ts
import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const wpSiteUrl = process.env.WORDPRESS_SITE_URL;
    const endpoint = req.query.endpoint || 'posts';
    
    try {
        const response = await fetch(`${wpSiteUrl}/wp-json/wp/v2/${endpoint}?${req.url.split('?')[1]}`);
        const data = await response.json();
        
        context.res = {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: data
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: { error: "Failed to fetch WordPress data" }
        };
    }
};

export default httpTrigger;
```

### Option C: Build-Time Integration (Static)
Generate static blog pages at build time using GitHub Actions:

```yaml
# .github/workflows/build-blog.yml
name: Build Blog from WordPress
on:
  schedule:
    - cron: '0 */6 * * *' # Every 6 hours
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Fetch WordPress Posts
        run: |
          curl "https://your-site.com/wp-json/wp/v2/posts" > posts.json
          node scripts/generate-blog-pages.js
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add .
          git commit -m "Update blog posts" || exit 0
          git push
```

## Troubleshooting

### Posts Not Loading
1. Check WordPress URL is correct
2. Verify WordPress REST API is accessible
3. Check browser console for CORS errors
4. Test API directly: `https://your-site.com/wp-json/wp/v2/posts`

### CORS Errors
1. Install WP CORS plugin
2. Add CORS headers to functions.php
3. Use Azure Functions proxy
4. Contact your hosting provider

### Performance Issues
1. Implement caching in Azure Functions
2. Use WordPress caching plugins
3. Consider CDN for images
4. Limit posts per page

## Security Considerations

1. **API Rate Limiting**: WordPress has built-in rate limiting
2. **Content Filtering**: All HTML is sanitized in the integration
3. **External Links**: WordPress links open in new tabs
4. **XSS Protection**: Content is properly escaped

## Support

- WordPress Codex: https://codex.wordpress.org/REST_API
- Azure Static Web Apps: https://docs.microsoft.com/azure/static-web-apps/
- Contact: support@365evergreen.com.au
