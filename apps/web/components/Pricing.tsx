'use client';

import { Card, CardBody, CardHeader, Slider } from '@nextui-org/react';
import { useCallback, useEffect, useState } from 'react';
import SectionsList from '../app/cloud/app/SectionsList';
import SectionItem from '../app/cloud/app/SectionItem';
import { usePathname } from 'next/navigation';
import axios from '@/app/utils/axios';
import Table from '@/app/cloud/app/Table';

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

export default function Pricing() {
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({});
  const [pricing, setPricing] = useState<Price[]>([]);
  const [moneyScale, setMoneyScale] = useState(0);
  const [freeBalance, setFreeBalance] = useState(0);
  const [calculationResult, setCalculationResult] = useState({
    here: 0,
    others: 35 * moneyScale,
  });

  const fetchPricing = useCallback(async () => {
    try {
      const { data } = await axios.get('/user/price');

      setPricing(data.pricing);
      setMoneyScale(data.moneyScale);
      setFreeBalance(data.freeBalance);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

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
    <div className="mt-6 flex flex-col gap-10">
      <p>
        Our pricing system is very straightforward: You add a balance, and we
        automatically deduct from that balance. Every month we add{' '}
        {(freeBalance / moneyScale).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}{' '}
        to your balance for free!
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-end">
        <div className="flex flex-col gap-3">
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
        </div>
        <ul className="flex flex-col gap-1">
          <li className="flex justify-between items-center w-full">
            <span>JSX Mail Cloud</span>
            <span className="text-gray-500">
              {(calculationResult.here < freeBalance
                ? 0
                : calculationResult.here / moneyScale
              ).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </span>
          </li>
          <li className="flex justify-between items-center w-full">
            <span>Other services</span>
            <span className="text-gray-500">
              {(calculationResult.others / moneyScale).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </span>
          </li>
        </ul>
      </div>

      <Table
        columns={['Title', 'Unit', 'Price']}
        rows={pricing.map((price) => [
          price.title,
          `${price.unit} ${price.unitName}`,
          `${price.friendlyAmount}`,
        ])}
      />
    </div>
  );
}
