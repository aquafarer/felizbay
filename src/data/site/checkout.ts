/**
 * Stripe direct-buy availability — single source of truth.
 *
 * false while STRIPE_SECRET_KEY is not configured on Cloudflare Pages:
 * every Buy Now control (product CTA, final CTA, sticky buy bar, product
 * card, merchant feed) is suppressed so no visitor can hit a broken
 * /api/checkout endpoint.
 *
 * Flip to true when Stripe goes live in production.
 * scripts/generate-merchant-feed.mjs parses the constant below by regex —
 * keep the `export const CHECKOUT_ENABLED = <boolean>;` format.
 */
export const CHECKOUT_ENABLED = false;
