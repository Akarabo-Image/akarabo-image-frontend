import { jsx as _jsx } from "react/jsx-runtime";
import logoImage from './images/pngLogo.png';
/** The official Akarabo Studio logo from the project's image assets. */
export function Logo({ size = 32, ...props }) {
    return (_jsx("img", { src: logoImage, width: Math.round(size * 1.8), height: size, alt: "Akarabo Studio logo", style: { objectFit: 'contain', maxWidth: '100%' }, ...props }));
}
export default Logo;
