import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
}

export default function Logo({ 
  variant = 'secondary', 
  size = 'md', 
  className = '',
  href = '/'
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto'
  };

  const logoPath = variant === 'primary' ? '/primary-logo.svg' : '/secondary-logo.svg';
  const altText = variant === 'primary' ? 'EcoFinds Primary Logo' : 'EcoFinds Secondary Logo';

  const logoElement = (
    <Image
      src={logoPath}
      alt={altText}
      width={variant === 'primary' ? 200 : 150}
      height={variant === 'primary' ? 60 : 40}
      className={`${sizeClasses[size]} ${className}`}
      priority
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}
