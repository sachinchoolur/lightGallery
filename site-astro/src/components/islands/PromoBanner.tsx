import { KQBanner, KQProvider } from '@kelviq/react-promotions-ui';

/**
 * The Kelviq promotion banner for the license page: a country-specific
 * offer with the coupon code to use at checkout. The provider fetches
 * the promotion for the visitor's location after hydration; the banner
 * renders nothing unless that country has one, so the page is unchanged
 * for everyone else. Prices on the page are not touched; the discount is
 * applied by the coupon at checkout.
 *
 * `unStyled` keeps the SDK from injecting its own look; the banner takes
 * the site's styling from the license stylesheet instead. The access
 * token is a client token, meant for the browser.
 */
const PROMOTION_ID = '69bd3c63-858d-43a4-b8a3-2b52fcab2114';
const ACCESS_TOKEN = 'client-54cb04c1-1b65-411b-89c0-45570c2da8ea:a51fe7cb-e942-4de4-9fbf-3bd10b604c9c';

export default function PromoBanner() {
    return (
        <KQProvider promotionId={PROMOTION_ID} accessToken={ACCESS_TOKEN}>
            <KQBanner unStyled className="plans-promo-banner" />
        </KQProvider>
    );
}
