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
          size === 'small' ? '12px' : size === 'medium' ? '16px' : '20px',
        fontWeight:
          weight === 'light' ? '300' : weight === 'regular' ? '400' : '700',
      }}
    >
      {children}
    </p>
  );
}
