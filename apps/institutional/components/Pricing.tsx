'use client';

import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';
import { Slider } from '@nextui-org/slider';
import { Spinner } from '@nextui-org/spinner';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

function fetcher(url: string) {
  return client.get(url).then((res) => res.data);
}

type Price = {
  amount: number;
  period: string;
  logo: JSX.Element;
  barPercentage: number;
};

export default function Pricing() {
  const [value, setValue] = useState(50000);
  const [prices, setPrices] = useState<Price[]>([]);
  const { data, isLoading } = useSWR('/user/price', fetcher);
  const emailPricing = data?.pricing[0];

  useEffect(() => {
    if (!emailPricing) return;

    const jsxMailCloudPricing =
      (value * ((emailPricing?.price || 0) / emailPricing.unit)) /
      data.moneyScale;

    const newPricing: any = [
      {
        amount: jsxMailCloudPricing,
        period: 'just when you send',
        logo: <img src="/our-cloud-logo.svg" className="w-24" />,
      },
      {
        amount:
          value < 60000
            ? 20
            : value < 110000
              ? 50
              : value < 160000
                ? 80
                : value < 300000
                  ? 200
                  : 400,
        period: 'mo',
        logo: <img src="/resend.svg" className="w-24" />,
      },
      {
        amount:
          value < 10000
            ? 15
            : value < 50000
              ? 35
              : value < 100000
                ? 75
                : value < 250000
                  ? 215
                  : value < 500000
                    ? 400
                    : value < 750000
                      ? 550
                      : 700,
        period: 'mo',
        logo: <img src="/mailgun.svg" className="w-24" />,
      },
      {
        amount:
          value < 15000
            ? 27
            : value < 50000
              ? 55
              : value < 100000
                ? 105
                : value < 250000
                  ? 250
                  : value < 500000
                    ? 470
                    : 700,
        period: 'mo',
        logo: <img src="/mailjet.svg" className="w-24" />,
      },
    ];

    const biggestPrice = Math.max(
      ...newPricing.map((price: any) => price.amount),
    );

    for (const price of newPricing) {
      price.barPercentage = (price.amount / biggestPrice) * 100;
    }

    setPrices(newPricing);
  }, [value, emailPricing]);

  return (
    <div id="pricing" className="flex flex-col gap-8 items-center w-full mb-20">
      <div className="flex items-start justify-center gap-10 w-8/12">
        <div className="bg-zinc-900 h-96 px-6 py-9 rounded-3xl w-full gap-9 flex flex-col justify-center">
          <p className="text-base">Framework</p>

          <div className="flex gap-2 items-end">
            <span className="text-6xl font-medium">Free</span>
            <span className="text-sm">Forever</span>
          </div>

          <Button
            as={Link}
            color="primary"
            variant="flat"
            className="w-fit"
            href="https://docs.jsxmail.com"
            target="_blank"
          >
            Documentation
          </Button>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3 items-center">
              <img src="/tick.svg" alt="tick" />
              <p className="text-xs text-zinc-300">
                Create email templates with JSX syntax
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <img src="/tick.svg" alt="tick" />
              <p className="text-xs text-zinc-300">
                Preview your email templates in real time
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <img src="/tick.svg" alt="tick" />
              <p className="text-xs text-zinc-300">
                Get compatibility with all email clients
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-3">
          {isLoading && (
            <div className="bg-zinc-900 h-96 px-6 py-9 rounded-3xl w-full gap-9 flex flex-col justify-center items-center">
              <Spinner />
            </div>
          )}
          {!isLoading && (
            <div className="bg-zinc-900 h-96 px-6 py-9 rounded-3xl w-full gap-9 flex flex-col justify-center">
              <p className="text-base">Cloud</p>

              <div className="flex gap-2 items-end">
                <span className="text-6xl font-medium">
                  {emailPricing?.friendlyAmount}
                </span>
                <span className="text-sm">
                  {emailPricing?.unit} {emailPricing?.unitName}
                </span>
              </div>

              <Button
                as={Link}
                color="primary"
                variant="flat"
                className="w-fit"
                href="https://cloud.jsxmail.com"
                target="_blank"
              >
                Go to cloud
              </Button>

              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-center">
                  <img src="/tick.svg" alt="tick" />
                  <p className="text-xs text-zinc-300">
                    Send unlimited emails and pay minimum fees
                  </p>
                </div>
                <div className="flex gap-3 items-center">
                  <img src="/tick.svg" alt="tick" />
                  <p className="text-xs text-zinc-300">
                    Host your email template images
                  </p>
                </div>
                <div className="flex gap-3 items-center">
                  <img src="/tick.svg" alt="tick" />
                  <p className="text-xs text-zinc-300">
                    Stay on top of your email sending insights
                  </p>
                </div>
              </div>
            </div>
          )}
          <Slider
            size="sm"
            label="Sent emails"
            maxValue={emailPricing?.maxValue}
            step={emailPricing?.step}
            getValue={(count) => `${count.toLocaleString('en-US')} emails`}
            value={value}
            onChange={(count) => setValue(Number(count))}
          />
        </div>
      </div>
      <div className="bg-red-500 flex flex-col items-center justify-center gap-10 w-8/12">
        {prices.map((price, index) => (
          <p>
            {price.amount.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </p>
        ))}
      </div>
    </div>
  );
}
