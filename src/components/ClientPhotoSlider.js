import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../assets';
/**
 * Sliding gallery of client photos.
 *
 * The track translates horizontally, one whole slide per step. It supports
 * autoplay (pausing on hover), arrow navigation and dot indicators, and
 * loops back to the first slide.
 */
export function ClientPhotoSlider({ slides, autoPlay = true, intervalMs = 6000, }) {
    const count = slides.length;
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const goTo = (next) => {
        const target = ((next % count) + count) % count;
        setIndex(target);
    };
    useEffect(() => {
        if (!autoPlay || paused || count < 2)
            return;
        const timer = window.setInterval(() => {
            setIndex((current) => (current + 1) % count);
        }, intervalMs);
        return () => window.clearInterval(timer);
    }, [autoPlay, paused, count, intervalMs]);
    const active = slides[index];
    return (_jsxs("div", { className: "ak-slider", onMouseEnter: () => setPaused(true), onMouseLeave: () => setPaused(false), children: [_jsx("div", { className: "ak-slider__viewport", children: _jsx("div", { className: "ak-slider__track", style: { transform: `translateX(-${index * 100}%)` }, children: slides.map((client) => (_jsxs("div", { className: "ak-slider__slide", children: [_jsx("img", { src: client.src, alt: [client.name, client.event].filter(Boolean).join(' — ') || 'Studio portfolio photo' }), _jsxs("div", { className: "ak-slider__caption", children: [_jsx("p", { className: "ak-slider__caption-name", children: client.name }), _jsx("p", { className: "ak-slider__caption-event", children: client.event })] })] }, client.id))) }) }), count > 1 && (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", className: "ak-slider__arrow ak-slider__arrow--prev", onClick: () => goTo(index - 1), "aria-label": "Previous client photo", children: _jsx(ChevronLeftIcon, { size: 22 }) }), _jsx("button", { type: "button", className: "ak-slider__arrow ak-slider__arrow--next", onClick: () => goTo(index + 1), "aria-label": "Next client photo", children: _jsx(ChevronRightIcon, { size: 22 }) }), _jsx("div", { className: "ak-slider__dots", children: slides.map((client, slideIndex) => (_jsx("button", { type: "button", className: slideIndex === index ? 'ak-slider__dot ak-slider__dot--active' : 'ak-slider__dot', onClick: () => goTo(slideIndex), "aria-label": `Show photo ${slideIndex + 1}: ${client.name}` }, client.id))) })] })), count > 1 && active && (_jsxs("span", { className: "ak-slider__sr-only", "aria-live": "polite", children: ["Photo ", index + 1, " of ", count, ": ", active.name] }))] }));
}
export default ClientPhotoSlider;
