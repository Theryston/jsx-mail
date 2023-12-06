import cn from 'classnames';
import gradients from './gradients.module.css';

export function Gradient({
  width = 1000,
  height = 200,
  opacity,
  className,
}: {
  width?: number | string;
  height?: number | string;
  opacity?: number;
  className?: string;
  small?: boolean;
}) {
  return (
    <span
      className={cn('absolute', gradients.glow, gradients.glowConic, className)}
      style={{
        width,
        height,
        opacity,
        borderRadius: '100%',
      }}
    />
  );
}
