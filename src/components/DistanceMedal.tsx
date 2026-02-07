import { getDistanceMedal } from '@/lib/polyline';

interface DistanceMedalProps {
  distanceMeters: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const DistanceMedal = ({ distanceMeters, size = 'md', showLabel = true }: DistanceMedalProps) => {
  const medal = getDistanceMedal(distanceMeters);

  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const containerSizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="inline-flex items-center gap-2">
      <div
        className={`${containerSizes[size]} rounded-full flex items-center justify-center shadow-md`}
        style={{ backgroundColor: medal.color }}
        title={medal.label}
      >
        <span className={sizes[size]}>{medal.emoji}</span>
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {medal.label}
        </span>
      )}
    </div>
  );
};

export default DistanceMedal;
