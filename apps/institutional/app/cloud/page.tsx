'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Faq from '@/components/Faq';
import { usePricing } from '@/lib/hooks';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Link } from '@heroui/link';
import { Slider } from '@heroui/slider';
import { Spinner } from '@heroui/spinner';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function CloudPage() {
  const { data } = usePricing();

  return (
    <main className="flex flex-col">
      <Header
        menuItems={[
          { label: 'Features', href: '#features' },
          { label: 'Why?', href: '#why' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'FAQ', href: '#faq' },
        ]}
      />

      <div className="flex flex-col px-6">
        <div className="relative flex flex-col gap-3 md:gap-5 items-center justify-between md:justify-center min-h-[calc(100dvh-64px)] py-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-950/30 via-zinc-950 to-zinc-950 -z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/10 via-primary-500/5 to-transparent -z-20" />

          <div className="flex-1" />
          <div className="flex flex-col items-center justify-end md:justify-center gap-6 h-fit relative">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <h1 className="hidden md:block text-7xl 2xl:text-8xl font-bold text-center bg-gradient-to-br from-primary-100 via-primary-300 to-primary-500 text-transparent bg-clip-text">
                  JSX Mail Cloud
                </h1>
                <h1 className="md:hidden text-4xl font-bold text-center bg-gradient-to-br from-primary-100 via-primary-300 to-primary-500 text-transparent bg-clip-text">
                  JSX Mail Cloud
                </h1>
                <div className="absolute -inset-x-8 top-1/2 -z-10 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
              </div>

              <p className="text-center w-full text-sm md:text-base 2xl:text-lg md:w-8/12 text-zinc-400 max-w-2xl">
                The most efficient and cost-effective cloud for email delivery,
                image hosting, and campaign analytics.
              </p>
            </div>
          </div>

          <div className="flex md:relative gap-4 w-full md:w-4/12 2xl:w-3/12 z-10">
            <Button
              color="primary"
              variant="shadow"
              as={Link}
              href="https://cloud.jsxmail.org/sign-in"
              target="_blank"
              fullWidth
              size="sm"
              className="font-medium"
              aria-label="Go to JSX Mail Cloud Dashboard"
            >
              Dashboard
            </Button>
            <Button
              color="primary"
              variant="flat"
              as={Link}
              href="https://docs.jsxmail.org/cloud"
              target="_blank"
              fullWidth
              size="sm"
              className="font-medium"
              aria-label="View JSX Mail Cloud Documentation"
            >
              Docs
            </Button>
          </div>
          <div className="flex-1" />
        </div>

        {/* Cloud Features Section */}
        <div
          className="flex flex-col gap-12 items-center w-full my-32"
          id="features"
        >
          <div className="flex flex-col gap-4 items-center w-full md:w-7/12 2xl:w-5/12">
            <div className="flex items-center gap-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
              <h2 className="text-sm font-medium text-primary-400">Features</h2>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
            </div>
            <h1 className="text-4xl font-bold text-center bg-gradient-to-br from-zinc-100 to-zinc-400 text-transparent bg-clip-text">
              Cloud Features
            </h1>
            <p className="text-center text-sm text-zinc-400">
              JSX Mail Cloud provides everything you need for your email
              workflow, from sending emails to hosting images and tracking
              analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="group relative p-6 bg-gradient-to-br from-zinc-900 to-zinc-800/80 rounded-3xl flex flex-col gap-4 border border-zinc-800/50 hover:border-primary-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              <div className="h-12 w-12 bg-primary-900/20 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary-500"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-medium text-zinc-100">
                  Email Delivery
                </h2>
                <p className="text-sm text-zinc-400">
                  Send emails reliably with high deliverability rates and
                  real-time tracking.
                </p>
              </div>
            </div>

            <div className="group relative p-6 bg-gradient-to-br from-zinc-900 to-zinc-800/80 rounded-3xl flex flex-col gap-4 border border-zinc-800/50 hover:border-primary-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              <div className="h-12 w-12 bg-primary-900/20 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary-500"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-medium text-zinc-100">
                  Image Hosting
                </h2>
                <p className="text-sm text-zinc-400">
                  Automatically optimize and host images for your email
                  campaigns with global CDN delivery.
                </p>
              </div>
            </div>

            <div className="group relative p-6 bg-gradient-to-br from-zinc-900 to-zinc-800/80 rounded-3xl flex flex-col gap-4 border border-zinc-800/50 hover:border-primary-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              <div className="h-12 w-12 bg-primary-900/20 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary-500"
                >
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-medium text-zinc-100">Analytics</h2>
                <p className="text-sm text-zinc-400">
                  Track opens, clicks, and other engagement metrics to optimize
                  your email campaigns.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="my-32 md:min-h-[80vh] flex justify-center items-center flex-col md:flex-row gap-20"
          id="why"
        >
          <div className="relative">
            <h1 className="text-primary-400 font-bold text-7xl md:text-8xl">
              Why?
            </h1>
            <div className="absolute -inset-x-8 top-1/2 -z-10 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Only true pay-as-you-go service',
                description:
                  'Unlike competitors who require subscriptions, we offer genuine pay-as-you-go pricing. Pay only for what you use with no monthly commitments.',
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-500"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                ),
              },
              {
                title: 'High deliverability',
                description:
                  'Our infrastructure ensures your emails reach the inbox, not the spam folder.',
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-500"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                ),
              },
              {
                title: 'Easy integration',
                description:
                  'Simple API that works with any framework, not just JSX Mail. Send HTML emails from any source.',
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-500"
                  >
                    <path d="M16 3h5v5" />
                    <path d="M21 3 9 15" />
                    <path d="M3 8v13h13" />
                    <path d="m3 21 8-8" />
                  </svg>
                ),
              },
              {
                title: 'Comprehensive solution',
                description:
                  'Email delivery, image hosting, and analytics all in one platform for a seamless workflow.',
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-500"
                  >
                    <path d="M12 22c6.23-.05 7.87-5.57 7.5-10-.36-4.34-3.95-7.5-9.96-10-3.55.04-7.14 5.66-7.5 10-.37 4.43 1.27 9.95 7.5 10z" />
                    <path d="M12 6c-1.79 1.82-2.13 4.42-2 6.5.12 2.1.89 4.2 2 5.5 1.11-1.3 1.88-3.4 2-5.5.13-2.08-.21-4.68-2-6.5z" />
                  </svg>
                ),
              },
            ].map((reason, index) => (
              <div
                key={index}
                className="group relative p-6 bg-gradient-to-br from-zinc-900 to-zinc-800/80 rounded-2xl border border-zinc-800/50 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative flex flex-col gap-4">
                  <div className="h-12 w-12 bg-primary-900/20 rounded-xl flex items-center justify-center">
                    {reason.icon}
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-medium text-zinc-100">
                      {reason.title}
                    </h2>
                    <p className="text-sm text-zinc-400">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="flex flex-col gap-12 items-center w-full my-32">
          <div className="flex flex-col gap-4 items-center w-full md:w-7/12 2xl:w-5/12">
            <div className="flex items-center gap-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
              <h2 className="text-sm font-medium text-primary-400">Process</h2>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
            </div>
            <h1 className="text-4xl font-bold text-center bg-gradient-to-br from-zinc-100 to-zinc-400 text-transparent bg-clip-text">
              How It Works
            </h1>
            <p className="text-center text-sm text-zinc-400">
              Getting started with JSX Mail Cloud is simple and straightforward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[
              {
                step: 1,
                title: 'Sign Up',
                description: (
                  <>
                    Create an account on JSX Mail Cloud and{' '}
                    <Link
                      href="https://docs.jsxmail.org/api-reference/authentication"
                      target="_blank"
                    >
                      get your API key
                    </Link>
                    .
                  </>
                ),
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-500"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
              },
              {
                step: 2,
                title: 'Integrate',
                description: (
                  <>
                    Use our{' '}
                    <Link
                      href="https://docs.jsxmail.org/api-reference/endpoint/sender/send"
                      target="_blank"
                    >
                      API to send emails
                    </Link>{' '}
                    from your application or use the JSX Mail framework for a
                    seamless experience.
                  </>
                ),
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-500"
                  >
                    <path d="M16 3h5v5" />
                    <path d="M21 3 9 15" />
                    <path d="M3 8v13h13" />
                    <path d="m3 21 8-8" />
                  </svg>
                ),
              },
              {
                step: 3,
                title: 'Monitor',
                description:
                  'Track your email performance with our comprehensive analytics dashboard.',
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-500"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative p-6 bg-gradient-to-br from-zinc-900 to-zinc-800/80 rounded-2xl border border-zinc-800/50 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary-900/20 rounded-xl flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-medium text-zinc-100">
                      {item.title}
                    </h2>
                    <p className="text-sm text-zinc-400">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Section */}
        <div className="flex flex-col gap-8 items-center w-full my-20">
          <div className="flex flex-col gap-3 items-center w-full md:w-7/12 2xl:w-5/12">
            <h1 className="text-3xl font-bold text-center">
              Compare JSX Mail Cloud
            </h1>
            <p className="text-center text-sm text-zinc-400">
              See how JSX Mail Cloud stacks up against other email service
              providers.
            </p>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="p-4 text-left">Feature</th>
                  <th className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <img
                        src="/our-cloud-logo.svg"
                        alt="JSX Mail Cloud"
                        className="h-8 mb-2"
                      />
                    </div>
                  </th>
                  <th className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <img
                        src="/mailgun.svg"
                        alt="Mailgun"
                        className="h-8 mb-2"
                      />
                    </div>
                  </th>
                  <th className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <img
                        src="/resend.svg"
                        alt="Resend"
                        className="h-8 mb-2"
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-800">
                  <td className="p-4">
                    True pay-as-you-go pricing (no subscription required)
                  </td>
                  <td className="p-4 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary-500 mx-auto"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </td>
                  <td className="p-4 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-zinc-500 mx-auto"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </td>
                  <td className="p-4 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-zinc-500 mx-auto"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4">Free tier</td>
                  <td className="p-4 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary-500 mx-auto"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </td>
                  <td className="p-4 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary-500 mx-auto"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </td>
                  <td className="p-4 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary-500 mx-auto"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4">Image hosting</td>
                  <td className="p-4 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary-500 mx-auto"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </td>
                  <td className="p-4 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-zinc-500 mx-auto"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </td>
                  <td className="p-4 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-zinc-500 mx-auto"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4">Framework integration</td>
                  <td className="p-4 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary-500 mx-auto"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </td>
                  <td className="p-4 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-zinc-500 mx-auto"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </td>
                  <td className="p-4 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary-500 mx-auto"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="p-4">Comprehensive analytics</td>
                  <td className="p-4 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary-500 mx-auto"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </td>
                  <td className="p-4 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary-500 mx-auto"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </td>
                  <td className="p-4 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary-500 mx-auto"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 p-12 md:p-16 my-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900/50 to-zinc-900 -z-20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/20 via-primary-500/5 to-transparent -z-10" />

          <div className="flex flex-col gap-6 md:w-7/12">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 text-transparent bg-clip-text">
                Ready to get started?
              </h2>
              <p className="text-base text-zinc-400">
                Join thousands of developers who trust JSX Mail Cloud - the only
                true pay-as-you-go email service. No subscriptions, no
                commitments. Get started for free with{' '}
                <span className="text-primary-400 font-medium">
                  {data?.FREE_EMAILS_PER_MONTH?.toLocaleString('en-US')}
                </span>{' '}
                emails per month.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full min-w-64 md:w-auto">
            <Button
              color="primary"
              variant="shadow"
              as={Link}
              href="https://cloud.jsxmail.org/sign-up"
              target="_blank"
              fullWidth
              aria-label="Sign up for JSX Mail Cloud"
            >
              <span className="relative z-10">Sign Up Free</span>
            </Button>
            <Button
              color="primary"
              variant="flat"
              as={Link}
              href="https://docs.jsxmail.org/cloud"
              target="_blank"
              fullWidth
              className="font-medium"
              aria-label="View JSX Mail Cloud Documentation"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Pricing Section */}
        <div
          id="pricing"
          className="flex flex-col gap-12 items-center w-full my-32"
        >
          <div className="flex flex-col gap-4 items-center w-full md:w-7/12 2xl:w-5/12">
            <div className="flex items-center gap-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
              <h2 className="text-sm font-medium text-primary-400">Pricing</h2>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
            </div>
            <h1 className="text-4xl font-bold text-center bg-gradient-to-br from-zinc-100 to-zinc-400 text-transparent bg-clip-text">
              Cloud Pricing
            </h1>
            <p className="text-center text-sm text-zinc-400">
              True pay-as-you-go pricing. No subscriptions, no commitments. Pay
              only for what you use.
            </p>
          </div>

          <CloudPricing />
        </div>

        {/* FAQ Section */}
        <div id="faq">
          <Faq />
        </div>
      </div>

      <Footer />
    </main>
  );
}

// Componente CloudPricing específico para a página da Cloud
function CloudPricing() {
  const { data, isPending: isLoadingPricing } = usePricing();
  const emailPricing = data?.EMAIL_PRICING;

  const [prices, setPrices] = useState<
    {
      amount: number;
      period: string;
      logo: JSX.Element;
      barPercentage: number;
    }[]
  >([]);
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(emailPricing?.defaultValue || 1000);
  }, [emailPricing]);

  useEffect(() => {
    if (!emailPricing || !data) return;

    let jsxMailCloudPricing =
      ((value - data.FREE_EMAILS_PER_MONTH) *
        ((emailPricing.price || 0) / emailPricing.unit)) /
      data.MONEY_SCALE;

    if (value <= data.FREE_EMAILS_PER_MONTH) jsxMailCloudPricing = 0;

    const newPricing = [
      {
        amount: jsxMailCloudPricing,
        period: 'just when you send',
        logo: (
          <img
            src="/our-cloud-logo.svg"
            className="w-24"
            alt="JSX Mail Cloud logo"
          />
        ),
        barPercentage: 0,
      },
      {
        amount:
          value < 60000
            ? 20
            : value < 110000
              ? 35
              : value < 160000
                ? 50
                : value < 300000
                  ? 80
                  : value < 700000
                    ? 200
                    : 400,
        period: 'mo',
        logo: <img src="/resend.svg" className="w-24" alt="Resend logo" />,
        barPercentage: 0,
      },
      {
        amount:
          value <= 10000
            ? 15
            : value <= 50000
              ? 35
              : value <= 100000
                ? 75
                : value <= 250000
                  ? 215
                  : value <= 500000
                    ? 400
                    : value <= 750000
                      ? 550
                      : 700,
        period: 'mo',
        logo: <img src="/mailgun.svg" className="w-24" alt="Mailgun logo" />,
        barPercentage: 0,
      },
    ];

    // Calculate the bar percentages
    const maxAmount = Math.max(...newPricing.map((p) => p.amount));
    const updatedPricing = newPricing.map((price) => ({
      ...price,
      barPercentage: (price.amount / maxAmount) * 100,
    }));

    setPrices(updatedPricing);
  }, [value, emailPricing, data]);

  if (isLoadingPricing) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!data || !emailPricing) {
    return (
      <div className="flex justify-center items-center h-96">
        <p>Failed to load pricing data.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Simulador de Custos */}
      <div className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 p-8 md:p-12 rounded-3xl mb-12 backdrop-blur-sm border border-zinc-800/50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/5 via-transparent to-transparent" />

        <div className="relative flex flex-col md:flex-row gap-8 mb-8">
          <div className="md:w-1/3">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold bg-gradient-to-br from-zinc-100 to-zinc-400 text-transparent bg-clip-text">
                Cost Simulator
              </h3>
              <p className="text-sm text-zinc-400">
                Compare JSX Mail Cloud with other providers and see how much you
                can save
              </p>
            </div>
          </div>

          <div className="md:w-2/3 space-y-6">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-zinc-300">
                    Monthly emails
                  </p>
                  <p className="text-xs text-zinc-500">
                    Drag the slider or type the amount
                  </p>
                </div>
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
                  className="w-full md:w-36 bg-zinc-800/80 border-zinc-700"
                  endContent={
                    <span className="text-xs text-zinc-300">emails</span>
                  }
                  aria-label="Number of emails"
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

              <div className="flex justify-between">
                <span className="text-xs text-zinc-500">
                  {emailPricing?.minValue.toLocaleString('en-US')}
                </span>
                <span className="text-xs text-zinc-500">
                  {emailPricing?.maxValue.toLocaleString('en-US')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-800/90 p-6 md:p-8 rounded-2xl border border-zinc-800/50">
          <div className="space-y-8 mt-4">
            {prices.map((price, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                  <div className="w-20 flex items-center">{price.logo}</div>
                  <div className="flex items-center gap-1 md:ml-auto">
                    <span
                      className={clsx('text-lg font-bold', {
                        'text-primary-300': index === 0,
                        'text-zinc-300': index !== 0,
                      })}
                    >
                      ${price.amount.toFixed(2)}
                    </span>
                    <p className="text-xs text-zinc-500">/{price.period}</p>
                  </div>
                </div>

                <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      'h-full rounded-full transition-all duration-500',
                      {
                        'bg-gradient-to-r from-primary-600 to-primary-400':
                          index === 0,
                        'bg-zinc-700': index !== 0,
                      },
                    )}
                    style={{ width: `${price.barPercentage || 1}%` }}
                  />
                </div>

                {index === 0 && price.amount === 0 && (
                  <div className="absolute right-0 -top-8">
                    <span className="inline-flex items-center gap-1 text-xs bg-primary-500/20 text-primary-300 px-3 py-1.5 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                      Free tier
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features e CTA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group relative p-6 bg-gradient-to-br from-primary-900/20 to-primary-700/20 rounded-2xl border border-primary-800/30 hover:border-primary-700/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          <div className="relative">
            <div className="h-12 w-12 bg-primary-900/30 rounded-xl flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-400"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-primary-300">
              Free Tier
            </h3>
            <p className="text-sm text-zinc-400">
              Get started with{' '}
              <span className="text-primary-400 font-medium">
                {data?.FREE_EMAILS_PER_MONTH.toLocaleString('en-US')}
              </span>{' '}
              free emails every month. No credit card required.
            </p>
          </div>
        </div>

        <div className="group relative p-6 bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 rounded-2xl border border-zinc-800/50 hover:border-primary-500/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          <div className="relative">
            <div className="h-12 w-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-400"
              >
                <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
                <line x1="18" x2="12" y1="9" y2="15" />
                <line x1="12" x2="18" y1="9" y2="15" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-zinc-100">
              No Subscriptions
            </h3>
            <p className="text-sm text-zinc-400">
              True pay-as-you-go pricing. Only pay for what you use, when you
              use it.
            </p>
          </div>
        </div>

        <div className="group relative p-6 bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 rounded-2xl border border-zinc-800/50 hover:border-primary-500/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          <div className="relative">
            <div className="h-12 w-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-400"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-zinc-100">
              Full Analytics
            </h3>
            <p className="text-sm text-zinc-400">
              Track opens, clicks, and delivery metrics with our comprehensive
              dashboard.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Button
          as={Link}
          href="https://cloud.jsxmail.org/sign-up"
          target="_blank"
          color="primary"
          variant="shadow"
          size="lg"
          className="px-12 py-6 text-base font-medium relative overflow-hidden group"
          aria-label="Sign up for JSX Mail Cloud"
        >
          <span className="relative z-10">Get Started Free</span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 transition-opacity opacity-0 group-hover:opacity-100" />
        </Button>
        <p className="text-xs text-zinc-500 mt-3">No credit card required</p>
      </div>
    </div>
  );
}
