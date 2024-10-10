type TypographyProps = {
  children: JSX.ElementChildren;
  size?: 'small' | 'medium' | 'large';
  weight?: 'light' | 'regular' | 'bold';
  color?: 'gray' | 'normal';
};

export default function Typography({
  children,
  size = 'small',
  weight = 'regular',
  color = 'normal',
}: TypographyProps) {
  return (
    <p
      style={{
        fontFamily: 'Poppins, sans-serif',
        color: color === 'gray' ? '#666' : '#333',
        fontSize:
          size === 'small' ? '0.75rem' : size === 'medium' ? '1rem' : '1.25rem',
        fontWeight:
          weight === 'light' ? '300' : weight === 'regular' ? '400' : '700',
      }}
    >
      {children}
    </p>
  );
}
