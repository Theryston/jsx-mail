import cn from 'classnames';
import gradients from './gradients.module.css';

export function Gradient({
  width = 1000,
  height = 200,
  opacity,
  pink,
  blue,
  conic,
  gray,
  className,
  small,
}: {
  width?: number | string;
  height?: number | string;
  opacity?: number;
  pink?: boolean;
  blue?: boolean;
  conic?: boolean;
  gray?: boolean;
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
