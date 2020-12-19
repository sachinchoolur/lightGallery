export function getShareListHTML(
    type: 'facebook' | 'twitter' | 'pinterest',
    text: string,
): string {
    return `<li><a class="lg-share-${type}" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">${text}</span></a></li>`;
}
