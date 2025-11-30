import React, { useRef } from 'react';

interface TileProps {
  size?: 'small' | 'medium' | 'large' | 'wide' | 'tall';
  title?: string;
  subtitle?: string;
  color?: string;
  image?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  selected?: boolean;
  onHover?: () => void;
  badge?: number | string;
}

const Tile: React.FC<TileProps> = ({ 
  size = 'medium', 
  title, 
  subtitle, 
  color = 'bg-xbox-green', 
  image, 
  icon,
  onClick,
  className = '',
  selected = false,
  onHover,
  badge
}) => {
  const tileRef = useRef<HTMLDivElement>(null);

  // Base classes imitating the white border and 3D feel
  const baseClasses = `
    relative transition-all duration-300 ease-out transform
    border-[3px] border-white/80
    shadow-tile
    cursor-pointer
    flex flex-col justify-end
    overflow-hidden
    group
    perspective-500
    ${selected ? 'scale-105 shadow-tile-hover z-20 border-white ring-2 ring-white/50' : 'hover:scale-105 hover:shadow-tile-hover hover:z-20 hover:border-white'}
    ${className}
  `;

  // Size mapping
  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64',
    wide: 'w-80 h-48',
    tall: 'w-48 h-80'
  };

  const handleMouseEnter = () => {
    if (onHover) onHover();
  };

  return (
    <div 
      ref={tileRef}
      className={`${baseClasses} ${sizeClasses[size]}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      style={{ backgroundColor: image ? 'transparent' : undefined }}
    >
      {/* Background Image or Color Fill */}
      <div className={`absolute inset-0 ${!image ? color : 'bg-gray-800'} transition-colors duration-500`}>
         {image && (
           <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
           />
         )}
      </div>

      {/* Gloss/Shine Effect - Classic NXE "Liquid" look */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/10 pointer-events-none"></div>
      <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />

      {/* Content */}
      <div className="relative z-10 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent w-full pt-12">
        {icon && <div className="mb-2 text-white text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-300 origin-bottom-left">{icon}</div>}
        {title && <h3 className="text-white font-bold text-lg leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,1)] uppercase tracking-tight group-hover:text-green-300 transition-colors">{title}</h3>}
        {subtitle && <p className="text-gray-200 text-xs font-medium drop-shadow-md mt-0.5 truncate">{subtitle}</p>}
      </div>
      
      {/* Badge (Notification) */}
      {badge && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-pulse z-20">
          {badge}
        </div>
      )}
    </div>
  );
};

export default Tile;