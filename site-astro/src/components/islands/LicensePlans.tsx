import { KelviqProvider, KQPrice, kqFormatPrice } from '@kelviq/react-sdk';

/**
 * The commercial plans card as a React island, so each amount can come
 * from Kelviq's localized pricing for the visitor's country.
 *
 * The island renders the list prices on the server. After hydration the
 * provider fetches the product offering, which carries the currency,
 * locale and per-plan amounts for the visitor's location, and every
 * amount re-renders from it. When a plan's localized amount is below its
 * list price, the list price shows struck through beside it. If the
 * request fails or the plan is missing, the list price stays.
 *
 * Plan copy (names, descriptions, terms) is ours, passed in as props;
 * only the amounts come from Kelviq. The access token is a client token,
 * meant for the browser.
 */
export interface Plan {
    key: string;
    name: string;
    desc: string;
    price: number;
    terms: string[];
    featured?: boolean;
}

interface Props {
    plans: Plan[];
    extended: Plan;
    extTitle: string;
}

const PRODUCT_ID = 'a3d337a7-ade8-4d7a-8dbc-e095dac5082e';
const ACCESS_TOKEN = 'client-54cb04c1-1b65-411b-89c0-45570c2da8ea:a51fe7cb-e942-4de4-9fbf-3bd10b604c9c';

const ONCE = `https://www.kelviq.com/buy/${PRODUCT_ID}/`;
const buy = (key: string) => `${ONCE}?enabled=${key}&plan_identifier=${key}&charge_period=ONE_TIME`;

/** One amount: the localized price, with the list price struck through when it is lower. */
function Price({ plan }: { plan: Plan }) {
    const listed = <span className="plans-amount">${plan.price}</span>;
    return (
        <div className="plans-price">
            <KQPrice planIdentifier={plan.key} billingPeriod="ONE_TIME" loadingComponent={listed} fallback={listed}>
                {({ amount, formattedPrice, currencySymbol, pricingLocale, plan: offering }) => {
                    const original = offering.originalPrice?.ONE_TIME;
                    const reduced = typeof original === 'number' && original > amount;
                    return (
                        <>
                            {reduced && (
                                <s className="plans-amount-list">
                                    {kqFormatPrice(original, currencySymbol, { locale: pricingLocale })}
                                </s>
                            )}
                            <span className="plans-amount">{formattedPrice}</span>
                        </>
                    );
                }}
            </KQPrice>
            <span className="plans-per"> / lifetime</span>
        </div>
    );
}

function Terms({ terms, extra }: { terms: string[]; extra?: string }) {
    return (
        <ul className="plans-terms">
            {terms.map((t) => (
                <li key={t} dangerouslySetInnerHTML={{ __html: t }} />
            ))}
            {extra && <li>{extra}</li>}
        </ul>
    );
}

function PlanCard({ plan }: { plan: Plan }) {
    const button = plan.featured ? 'primary' : 'outline';
    return (
        <div className={`plans-card plans-card-${plan.key}${plan.featured ? ' plans-card-featured' : ''}`}>
            <div className="plans-card-name">{plan.name}</div>
            <p className="plans-card-desc">{plan.desc}</p>
            <Price plan={plan} />
            <Terms terms={plan.terms} extra="Lifetime free updates" />
            <a className={`license-btn license-btn-${button}`} href={buy(plan.key)} target="_blank" rel="noreferrer">
                Purchase Now
            </a>
        </div>
    );
}

export default function LicensePlans({ plans, extended, extTitle }: Props) {
    return (
        <KelviqProvider
            accessToken={ACCESS_TOKEN}
            productId={PRODUCT_ID}
            config={{ fetchPricingOnMount: true, fetchEntitlementsOnMount: false }}
        >
            <div className="plans-onecard">
                <div className="plans-onecard-cols">
                    {plans.map((p) => (
                        <PlanCard key={p.key} plan={p} />
                    ))}
                </div>
                <div className="plans-onecard-ext">
                    <div>
                        <h3 className="plans-h3">{extTitle}</h3>
                        <p>{extended.desc}</p>
                    </div>
                    <div className="plans-onecard-buy">
                        <Price plan={extended} />
                        <Terms terms={extended.terms} />
                        <a className="license-btn license-btn-primary" href={buy(extended.key)} target="_blank" rel="noreferrer">
                            Purchase Now
                        </a>
                    </div>
                </div>
            </div>
        </KelviqProvider>
    );
}
