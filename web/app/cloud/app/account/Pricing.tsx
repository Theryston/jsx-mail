export default function Pricing({ pricing }: any) {
  return (
    <div className="flex flex-col gap-3">
      {pricing.map((price: any) => (
        <div key={price.title} className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-foreground text-lg">{price.title}</span>
            {'/'}
            <span className="text-foreground text-base">
              {price.friendlyAmount}
            </span>
          </div>
          <span className="text-sm text-foreground-500 font-normal">
            {price.description}
          </span>
        </div>
      ))}
    </div>
  );
}
