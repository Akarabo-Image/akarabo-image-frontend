import logoImage from './images/pngLogo.png';
import type { ImgHTMLAttributes } from 'react';

type LogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height' | 'src'> & {
  size?: number;
};

/** The official Akarabo Studio logo from the project's image assets. */
export function Logo({ size = 32, ...props }: LogoProps) {
  return (
    <img
      src={logoImage}
      width={Math.round(size * 1.8)}
      height={size}
      alt="Akarabo Studio logo"
      style={{ objectFit: 'contain', maxWidth: '100%' }}
      {...props}
    />
  );
}

export default Logo;
