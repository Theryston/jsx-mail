'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { Slider } from '@nextui-org/slider';
import { Spinner } from '@nextui-org/spinner';
import axios from 'axios';
import clsx from 'clsx';
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
  const { data, isLoading } = useSWR('/user/price', fetcher);
  const emailPricing = data?.EMAIL_PRICING;

  const [prices, setPrices] = useState<Price[]>([]);
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(emailPricing?.defaultValue || 1000);
  }, [emailPricing]);

  useEffect(() => {
    if (!emailPricing) return;

    let jsxMailCloudPricing =
      value * ((emailPricing.price || 0) / emailPricing.unit);

    if (jsxMailCloudPricing <= data.FREE_BALANCE) {
      jsxMailCloudPricing = 0;
    } else {
      jsxMailCloudPricing = jsxMailCloudPricing / data.MONEY_SCALE;
    }

    const newPricing: Price[] = [
      {
        amount: jsxMailCloudPricing,
        period: 'just when you send',
        logo: <img src="/our-cloud-logo.svg" className="w-24" />,
        barPercentage: 0, // This will be calculated later
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
        barPercentage: 0, // This will be calculated later
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
        barPercentage: 0, // This will be calculated later
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
        barPercentage: 0, // This will be calculated later
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
    <div id="pricing" className="flex flex-col gap-9 items-center w-full mb-20">
      <h2 className="text-4xl font-bold text-center">Pricing</h2>

      <div className="flex flex-col md:flex-row items-start justify-center gap-4 w-full md:w-8/12">
        <div className="bg-zinc-900 h-fit md:h-96 px-6 py-9 rounded-3xl w-full gap-6 md:gap-9 flex flex-col justify-center">
          <p className="text-base">Framework</p>

          <div className="flex gap-2 items-end">
            <span className="text-5xl md:text-6xl font-medium">Free</span>
            <span className="text-xs md:text-sm">Forever</span>
          </div>

          <Button
            as={Link}
            color="primary"
            variant="flat"
            className="w-fit"
            href="https://docs.jsxmail.org"
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
            <div className="bg-zinc-900 h-fit md:h-96 px-6 py-9 rounded-3xl w-full gap-6 md:gap-9 flex flex-col justify-center">
              <p className="text-base">Cloud</p>

              <div className="flex gap-2 items-end">
                <span className="text-5xl md:text-6xl font-medium">
                  {emailPricing?.friendlyAmount}
                </span>
                <span className="text-xs md:text-sm">
                  {emailPricing?.unit} {emailPricing?.unitName}
                </span>
              </div>

              <Button
                as={Link}
                color="primary"
                variant="flat"
                className="w-fit"
                href="https://cloud.jsxmail.org/app"
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

          <div className="w-full flex flex-col">
            <div className="w-full flex justify-between items-center mx-1">
              <p className="text-sm">Emails</p>

              <Input
                type="text"
                value={value.toLocaleString('en-US')}
                size="sm"
                onChange={(e) => {
                  const newNumber = Number(e.target.value.replace(/\D/g, ''));

                  if (newNumber > emailPricing?.maxValue) {
                    setValue(emailPricing?.maxValue);
                  } else {
                    setValue(newNumber);
                  }
                }}
                className="w-28"
                onKeyUp={(e) => {
                  if (e.key === 'ArrowUp') {
                    setValue((prev) => {
                      if (prev + 1000 > emailPricing?.maxValue)
                        return emailPricing?.maxValue;

                      return prev + 1000;
                    });
                  } else if (e.key === 'ArrowDown') {
                    setValue((prev) => {
                      if (prev - 1000 < 0) return 0;

                      return prev - 1000;
                    });
                  }
                }}
                endContent={<span className="text-xs text-zinc-300">/Mo</span>}
              />
            </div>

            <Slider
              size="sm"
              maxValue={emailPricing?.maxValue}
              step={emailPricing?.step}
              minValue={emailPricing?.minValue}
              value={value}
              onChange={(count) => setValue(Number(count))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 w-full md:w-8/12">
        {prices.map((price, index) => (
          <div
            key={index}
            className="grid grid-cols-12 w-full items-center gap-2 md:gap-0"
          >
            <div className="col-span-3 md:col-span-2">{price.logo}</div>

            <div className="col-span-9 md:col-span-10 flex items-center gap-3">
              <div
                className={clsx('h-9 rounded-lg transition-all duration-500', {
                  'bg-primary': index === 0,
                  'bg-zinc-500': index !== 0,
                })}
                style={{ width: `${price.barPercentage || 1}%` }}
              />

              <p className="text-sm">
                {price.amount === 0
                  ? 'Free'
                  : price.amount.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}

                {price.amount !== 0 && (
                  <span
                    className="text-zinc-500"
                    style={{
                      fontSize: '0.65rem',
                    }}
                  >
                    /{price.period}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
