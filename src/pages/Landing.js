import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { CalendarIcon, CameraIcon, CheckIcon, ClockIcon, Logo, MailIcon, MenuIcon, UsersIcon, XIcon } from '../assets';
import { ClientPhotoSlider } from '../components/ClientPhotoSlider';
import { fetchClientPhotos } from '../data/clientPhotos';
import { useAuth } from '../context/AuthContext';
import { inquiryService } from '../services/inquiryService';
import { useLanguage } from '../i18n/LanguageContext';
import { Modal } from '../ui/Modal';
import { toast } from 'react-toastify';
const services = [
    { icon: CameraIcon, title: 'service.weddings', text: 'service.weddingsText' },
    { icon: UsersIcon, title: 'service.portraits', text: 'service.portraitsText' },
    { icon: CalendarIcon, title: 'service.celebrations', text: 'service.celebrationsText' },
    { icon: ClockIcon, title: 'service.brand', text: 'service.brandText' },
];
const packages = [
    { name: 'Essential', price: 'From RWF 300K', text: 'A beautiful beginning for intimate celebrations.', items: ['Up to 2 hours coverage', '40 edited photographs', 'Private online gallery'] },
    { name: 'Signature', price: 'From RWF 650K', text: 'A little more room for the story to unfold.', items: ['Up to 6 hours coverage', '80 edited photographs', 'Print-ready gallery', 'Planning consultation'], featured: true },
    { name: 'Full story', price: 'From RWF 1.2M', text: 'The complete experience, from first look to last dance.', items: ['Full day coverage', '150 edited photographs', 'Cinematic highlight film', 'Keepsake photo book'] },
];
const testimonials = [
    { quote: 'They captured the feeling of the day so beautifully. Looking through our gallery felt like being there all over again.', name: 'Aline & John', kind: 'Wedding · Kigali' },
    { quote: 'The whole team made us feel comfortable, and the photos are full of personality. We could not be happier.', name: 'The Mugabo family', kind: 'Family portraits' },
    { quote: 'Professional, calm and creative. They turned our event into a story our whole team is proud to share.', name: 'Ignace Group', kind: 'Brand event' },
];
/** Public studio site and client inquiry entry point. */
export function Landing() {
    const { isAuthenticated } = useAuth();
    const { locale, setLocale, t } = useLanguage();
    const [menuOpen, setMenuOpen] = useState(false);
    const navRef = useRef(null);
    const [sending, setSending] = useState(false);
    const [inquirySent, setInquirySent] = useState(false);
    const [pendingInquiry, setPendingInquiry] = useState(null);
    const [clientPhotos, setClientPhotos] = useState([]);
    const [photosLoading, setPhotosLoading] = useState(false);
    const [photosFailed, setPhotosFailed] = useState(false);
    const photoFeedUrl = import.meta.env.VITE_CLIENT_PHOTOS_URL?.trim();
    useEffect(() => {
        if (!photoFeedUrl)
            return;
        const controller = new AbortController();
        setPhotosLoading(true);
        setPhotosFailed(false);
        fetchClientPhotos(photoFeedUrl, controller.signal)
            .then(setClientPhotos)
            .catch((error) => {
            if (error instanceof DOMException && error.name === 'AbortError')
                return;
            setPhotosFailed(true);
        })
            .finally(() => {
            if (!controller.signal.aborted)
                setPhotosLoading(false);
        });
        return () => controller.abort();
    }, [photoFeedUrl]);
    useEffect(() => {
        if (!menuOpen)
            return;
        const onPointerDown = (event) => {
            if (!navRef.current?.contains(event.target))
                setMenuOpen(false);
        };
        const onKeyDown = (event) => {
            if (event.key === 'Escape')
                setMenuOpen(false);
        };
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [menuOpen]);
    async function submitInquiry(event) {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        setPendingInquiry({
            name: String(values.get('name') ?? '').trim(),
            email: String(values.get('email') ?? '').trim(),
            phone: String(values.get('phone') ?? '').trim(),
            service: String(values.get('service') ?? ''),
            preferredDate: String(values.get('date') ?? '') || undefined,
            message: String(values.get('message') ?? '').trim() || undefined,
        });
    }
    async function confirmInquiry() {
        if (!pendingInquiry)
            return;
        setSending(true);
        try {
            await inquiryService.create(pendingInquiry);
            setInquirySent(true);
            setPendingInquiry(null);
            toast.success(t('form.success'));
        }
        catch {
            toast.error(t('form.error'));
        }
        finally {
            setSending(false);
        }
    }
    if (isAuthenticated)
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    return (_jsxs("main", { className: "studio-site", children: [_jsxs("header", { className: "studio-nav", ref: navRef, children: [_jsx("a", { href: "#home", className: "studio-brand", "aria-label": "Akarabo Studio home", children: _jsx(Logo, { size: 55 }) }), _jsx("div", { className: "studio-language", role: "group", "aria-label": "Select language", children: ['en', 'rw', 'fr'].map((choice) => _jsx("button", { type: "button", "aria-pressed": locale === choice, onClick: () => setLocale(choice), children: choice.toUpperCase() }, choice)) }), _jsx("button", { className: "studio-nav__toggle", "aria-label": menuOpen ? 'Close navigation' : 'Open navigation', "aria-expanded": menuOpen, onClick: () => setMenuOpen(!menuOpen), children: menuOpen ? _jsx(XIcon, { size: 20 }) : _jsx(MenuIcon, { size: 20 }) }), _jsxs("nav", { className: menuOpen ? 'studio-nav__links is-open' : 'studio-nav__links', "aria-label": "Main navigation", children: [_jsxs("a", { href: "#work", onClick: () => setMenuOpen(false), children: [_jsx(CameraIcon, { size: 17 }), _jsx("span", { children: t('nav.work') })] }), _jsxs("a", { href: "#services", onClick: () => setMenuOpen(false), children: [_jsx(UsersIcon, { size: 17 }), _jsx("span", { children: t('nav.services') })] }), _jsxs("a", { href: "#packages", onClick: () => setMenuOpen(false), children: [_jsx(CalendarIcon, { size: 17 }), _jsx("span", { children: t('nav.packages') })] }), _jsxs(Link, { to: isAuthenticated ? '/dashboard' : '/login', className: "studio-nav__staff", children: [_jsx("span", { className: "studio-nav__staff-dot" }), t('nav.login')] }), _jsxs("a", { href: "#contact", className: "studio-button studio-button--small", onClick: () => setMenuOpen(false), children: [_jsx(MailIcon, { size: 17 }), t('nav.enquire')] })] })] }), _jsxs("section", { className: "studio-hero", id: "home", children: [_jsx("div", { className: "studio-hero__image", role: "img", "aria-label": "A couple sharing a joyful moment at their wedding" }), _jsx("div", { className: "studio-hero__shade" }), _jsxs("div", { className: "studio-hero__content", children: [_jsxs("p", { className: "studio-kicker studio-kicker--light", children: [_jsx("span", {}), " ", t('hero.kicker')] }), _jsx("h1", { children: locale === 'en' ? _jsxs(_Fragment, { children: ["For the moments", _jsx("br", {}), "you want to ", _jsx("em", { children: "keep." })] }) : t('hero.title') }), _jsx("p", { className: "studio-hero__intro", children: t('hero.intro') }), _jsxs("div", { className: "studio-hero__actions", children: [_jsxs("a", { className: "studio-button", href: "#contact", children: [t('hero.book'), " ", _jsx("span", { "aria-hidden": "true", children: "\u2197" })] }), _jsxs("a", { className: "studio-text-link", href: "#work", children: [t('hero.explore'), " ", _jsx("span", { "aria-hidden": "true", children: "\u2193" })] })] }), _jsxs("div", { className: "studio-hero__note", children: [_jsx("span", { children: "01" }), _jsx("span", { children: t('hero.note') }), _jsx("span", { className: "studio-hero__line" })] })] }), _jsx("div", { className: "studio-hero__side", children: t('hero.side') })] }), _jsxs("section", { className: "studio-intro", "aria-label": "About our studio", children: [_jsx("p", { className: "studio-kicker", children: t('intro.kicker') }), _jsx("h2", { children: locale === 'en' ? _jsxs(_Fragment, { children: ["Beautiful photographs begin with", _jsx("br", { className: "desktop-break" }), " feeling ", _jsx("em", { children: "at home." })] }) : t('intro.title') }), _jsx("p", { children: t('intro.text') }), _jsxs("a", { className: "studio-inline-link", href: "#services", children: [t('intro.link'), " ", _jsx("span", { children: "\u2197" })] })] }), _jsxs("section", { className: "studio-work", id: "work", children: [_jsxs("div", { className: "studio-section-heading", children: [_jsxs("div", { children: [_jsx("p", { className: "studio-kicker", children: t('work.kicker') }), _jsx("h2", { children: t('work.title') })] }), _jsx("p", { children: t('work.text') })] }), photosLoading ? _jsx("p", { role: "status", children: t('work.loading') }) : clientPhotos.length ? _jsx(ClientPhotoSlider, { slides: clientPhotos }) : _jsx("p", { role: photosFailed ? 'alert' : undefined, children: photosFailed ? t('work.loadError') : t('work.empty') })] }), _jsxs("section", { className: "studio-services", id: "services", children: [_jsxs("div", { className: "studio-section-heading", children: [_jsxs("div", { children: [_jsx("p", { className: "studio-kicker", children: t('services.kicker') }), _jsx("h2", { children: t('services.title') })] }), _jsx("p", { children: t('services.text') })] }), _jsx("div", { className: "studio-services__grid", children: services.map(({ icon: Icon, title, text }, i) => _jsxs("article", { className: "studio-service", children: [_jsxs("span", { className: "studio-service__number", children: ["0", i + 1] }), _jsx("span", { className: "studio-service__icon", children: _jsx(Icon, { size: 22 }) }), _jsx("h3", { children: t(title) }), _jsx("p", { children: t(text) }), _jsx("a", { href: "#contact", "aria-label": `${t('nav.enquire')} ${t(title)}`, children: "\u2197" })] }, title)) })] }), _jsxs("section", { className: "studio-packages", id: "packages", children: [_jsxs("div", { className: "studio-section-heading", children: [_jsxs("div", { children: [_jsx("p", { className: "studio-kicker", children: t('packages.kicker') }), _jsx("h2", { children: t('packages.title') })] }), _jsx("p", { children: t('packages.text') })] }), _jsx("div", { className: "studio-packages__grid", children: packages.map((pkg) => _jsxs("article", { className: pkg.featured ? 'studio-package is-featured' : 'studio-package', children: [pkg.featured && _jsx("span", { className: "studio-package__label", children: t('packages.popular') }), _jsx("p", { className: "studio-package__price", children: pkg.price }), _jsx("h3", { children: pkg.name }), _jsx("p", { className: "studio-package__text", children: pkg.text }), _jsx("ul", { children: pkg.items.map((item) => _jsxs("li", { children: [_jsx(CheckIcon, { size: 16 }), item] }, item)) }), _jsxs("a", { href: "#contact", className: pkg.featured ? 'studio-button studio-button--full' : 'studio-outline-button', children: [t('packages.ask'), " ", pkg.name, " ", _jsx("span", { children: "\u2197" })] })] }, pkg.name)) })] }), _jsxs("section", { className: "studio-love", children: [_jsxs("div", { className: "studio-love__heading", children: [_jsx("p", { className: "studio-kicker studio-kicker--light", children: t('love.kicker') }), _jsx("h2", { children: t('love.title') }), _jsx("p", { children: t('love.text') })] }), _jsx("div", { className: "studio-love__quotes", children: testimonials.map((item) => _jsxs("figure", { children: [_jsx("span", { className: "studio-quote-mark", children: "\u201C" }), _jsx("blockquote", { children: item.quote }), _jsxs("figcaption", { children: [_jsx("strong", { children: item.name }), _jsx("span", { children: item.kind })] })] }, item.name)) })] }), _jsxs("section", { className: "studio-contact", id: "contact", children: [_jsxs("div", { className: "studio-contact__copy", children: [_jsx("p", { className: "studio-kicker", children: t('contact.kicker') }), _jsx("h2", { children: t('contact.title') }), _jsx("p", { children: t('contact.text') }), _jsxs("div", { className: "studio-contact__direct", children: [_jsx("span", { children: t('contact.team') }), _jsx("span", { children: t('contact.reply') })] })] }), _jsxs("form", { className: "studio-inquiry", onSubmit: submitInquiry, children: [_jsxs("div", { className: "studio-inquiry__heading", children: [_jsx("span", { children: t('contact.formKicker') }), _jsx("p", { children: t('contact.formIntro') })] }), inquirySent ? _jsxs("div", { className: "studio-inquiry__success", role: "status", children: [_jsx("span", { children: "\u2713" }), _jsx("strong", { children: t('form.success') }), _jsx("p", { children: t('form.followup') }), _jsx("button", { type: "button", className: "studio-outline-button", onClick: () => setInquirySent(false), children: t('form.another') })] }) : _jsxs(_Fragment, { children: [_jsxs("label", { children: [t('form.name'), _jsx("input", { name: "name", autoComplete: "name", placeholder: "e.g. Aline Mukamana", required: true })] }), _jsxs("div", { className: "studio-inquiry__row", children: [_jsxs("label", { children: [t('form.email'), _jsx("input", { name: "email", type: "email", autoComplete: "email", placeholder: "you@example.com", required: true })] }), _jsxs("label", { children: [t('form.service'), _jsxs("select", { name: "service", defaultValue: "Wedding", children: [_jsx("option", { value: "Wedding", children: t('form.service.wedding') }), _jsx("option", { value: "Portrait session", children: t('form.service.portrait') }), _jsx("option", { value: "Family photography", children: t('form.service.family') }), _jsx("option", { value: "Celebration or event", children: t('form.service.event') }), _jsx("option", { value: "Brand photography", children: t('form.service.brand') }), _jsx("option", { value: "Something else", children: t('form.service.other') })] })] })] }), _jsxs("label", { children: [t('form.phone'), _jsx("input", { name: "phone", type: "tel", autoComplete: "tel", required: true })] }), _jsxs("label", { children: [t('form.date'), " ", _jsx("span", { className: "studio-optional", children: t('form.optional') }), _jsx("input", { name: "date", type: "date" })] }), _jsxs("label", { children: [t('form.message'), _jsx("textarea", { name: "message", rows: 3, placeholder: t('form.messageHint') })] }), _jsxs("button", { type: "submit", className: "studio-button studio-button--full", children: [t('form.submit'), " ", _jsx("span", { children: "\u2197" })] }), _jsx("p", { className: "studio-inquiry__privacy", children: t('form.privacy') })] })] })] }), _jsxs("footer", { className: "studio-footer", children: [_jsx("a", { href: "#home", className: "studio-brand", "aria-label": "Akarabo Studio home", children: _jsx(Logo, { size: 48 }) }), _jsx("p", { children: t('footer.made') }), _jsxs("a", { href: "#home", children: [t('footer.top'), " \u2191"] })] }), _jsxs(Modal, { open: Boolean(pendingInquiry), onClose: () => !sending && setPendingInquiry(null), title: t('form.confirmTitle'), footer: _jsxs(_Fragment, { children: [_jsx("button", { type: "button", className: "ak-button ak-button--secondary", onClick: () => setPendingInquiry(null), disabled: sending, children: t('form.cancel') }), _jsx("button", { type: "button", className: "ak-button ak-button--primary", onClick: () => void confirmInquiry(), disabled: sending, children: sending ? t('form.sending') : t('form.confirm') })] }), children: [_jsx("p", { children: t('form.confirmText') }), pendingInquiry && _jsxs("div", { className: "studio-confirm-summary", children: [_jsx("strong", { children: pendingInquiry.name }), _jsx("span", { children: pendingInquiry.email }), _jsx("span", { children: pendingInquiry.phone }), _jsxs("span", { children: [pendingInquiry.service, pendingInquiry.preferredDate ? ` · ${pendingInquiry.preferredDate}` : ''] })] })] })] }));
}
export default Landing;
