// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

/**
 * DEPLOY_TARGET decides where the site thinks it lives:
 *   - "github" : https://lukewoodstech.github.io/facilitating-families-counseling/
 *                (used by the Actions workflow until the custom domain is switched on)
 *   - anything else (local dev, or "domain" in CI once CUSTOM_DOMAIN_ENABLED=true):
 *                https://facilitatingfamiliescounseling.com/
 */
const REPO_NAME = 'facilitating-families-counseling';
const CUSTOM_DOMAIN = 'https://facilitatingfamiliescounseling.com';
const target = process.env.DEPLOY_TARGET ?? 'local';
const onGitHubSubpath = target === 'github';

export default defineConfig({
  site: onGitHubSubpath ? 'https://lukewoodstech.github.io' : CUSTOM_DOMAIN,
  base: onGitHubSubpath ? `/${REPO_NAME}` : '/',
  output: 'static',
  trailingSlash: 'ignore',
  vite: { plugins: [tailwindcss()] },
  integrations: [sitemap()],
});
