'use client';

import { Card, CardBody, CardHeader, Slider } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import SectionsList from '../app/SectionsList';
import SectionItem from '../app/SectionItem';
import { usePathname } from 'next/navigation';
import BackButton from '../BackButton';

type Price = {
  title: string;
  unit: string;
  unitName: string;
  amount: number;
  step: number;
  maxValue: number;
  price: number;
  friendlyAmount: string;
};

type SelectedValue = {
  value: number;
  price: Price;
};

type SelectedValues = {
  [key: string]: SelectedValue;
};

type Props = {
  pricing: Price[];
  moneyScale: number;
  freeBalance: number;
};

export default function PricingContent({
  pricing,
  moneyScale,
  freeBalance,
}: Props) {
  const pathname = usePathname();
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({});
  const [calculationResult, setCalculationResult] = useState({
    here: 0,
    others: 0,
  });

  useEffect(() => {
    const values = Object.values(selectedValues);
    if (!values.length) return;
    let totalHere = 0;

    for (const value of values) {
      totalHere += (value.value / value.price.amount) * value.price.price;
    }

    const emails =
      values.find((value) => value.price.title === 'Emails')?.value || 0;

    const totalOthers =
      emails < 100000
        ? 35 * moneyScale
        : emails < 250000
          ? 215 * moneyScale
          : emails < 500000
            ? 400 * moneyScale
            : emails < 750000
              ? 550 * moneyScale
              : 700 * moneyScale;

    setCalculationResult({
      here: totalHere,
      others: totalOthers || 0,
    });
  }, [selectedValues, moneyScale]);

  return (
    <div
      className={
        pathname === '/cloud/pricing'
          ? 'w-full h-screen flex justify-center items-start mt-20'
          : ''
      }
    >
      {pathname === '/cloud/pricing' && <BackButton />}
      <SectionsList>
        <SectionItem
          title="Pricing"
          description={`Our pricing system is very straightforward: You add a balance, and we automatically deduct from that balance. Every month we add ${(
            freeBalance / moneyScale
          ).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })} to your balance for free!`}
        >
          <div className="flex flex-col gap-6">
            <ul className="flex flex-col gap-3">
              {pricing.map((price: any) => (
                <li key={price.id}>
                  <Card shadow="none" isBlurred fullWidth>
                    <CardBody>
                      <div className="flex justify-between items-center gap-4 w-full flex-wrap">
                        <span>
                          {price.title} {price.unit}
                        </span>
                        <span className="text-gray-500">
                          {price.friendlyAmount}
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold">Calculator</h2>
                </CardHeader>
                <CardBody className="flex flex-col gap-3">
                  {pricing.map((price) => (
                    <Slider
                      size="sm"
                      key={price.title}
                      label={price.title}
                      step={price.step}
                      maxValue={price.maxValue}
                      value={selectedValues[price.title]?.value || 0}
                      onChange={(value) =>
                        setSelectedValues((old) => ({
                          ...old,
                          [price.title]: { price, value: value as number },
                        }))
                      }
                    />
                  ))}
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold">Totals</h2>
                </CardHeader>
                <CardBody>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Card shadow="none" isBlurred fullWidth>
                        <CardBody>
                          <div className="flex justify-between items-center gap-4 w-full flex-wrap">
                            <span>JSX Mail Cloud</span>
                            <span className="text-gray-500">
                              {(
                                calculationResult.here / moneyScale
                              ).toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                              })}
                            </span>
                          </div>
                        </CardBody>
                      </Card>
                    </li>
                    <li>
                      <Card shadow="none" isBlurred fullWidth>
                        <CardBody>
                          <div className="flex justify-between items-center gap-4 w-full flex-wrap">
                            <span>Other companies</span>
                            <span className="text-gray-500">
                              {(
                                calculationResult.others / moneyScale
                              ).toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                              })}
                            </span>
                          </div>
                        </CardBody>
                      </Card>
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </div>
          </div>
        </SectionItem>
      </SectionsList>
    </div>
  );
}
