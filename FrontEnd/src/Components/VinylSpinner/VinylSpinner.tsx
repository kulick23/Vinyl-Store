import type React from 'react';
import './VinylSpinner.scss';

interface VinylSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const VinylSpinner: React.FC<VinylSpinnerProps> = ({
  size = 'medium',
  className = '',
}) => {
  return (
    <div className={`vinyl-spinner ${size} ${className}`}>
      <div className="vinyl-record">
        <div className="vinyl-center">
          <div className="vinyl-hole"></div>
        </div>
        <div className="vinyl-groove vinyl-groove-1"></div>
        <div className="vinyl-groove vinyl-groove-2"></div>
        <div className="vinyl-groove vinyl-groove-3"></div>
        <div className="vinyl-groove vinyl-groove-4"></div>
      </div>
    </div>
  );
};

export default VinylSpinner;
