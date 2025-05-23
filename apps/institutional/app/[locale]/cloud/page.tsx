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
import { useEffect, useState, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import { getCloudUrl } from '@/lib/utils';
import { useUtmInfo } from '@/app/utm-context';
import { useTranslations } from 'next-intl';

export default function CloudPage() {
  const t = useTranslations('CloudPage');
  const { data } = usePricing();
  const { utmGroupId } = useUtmInfo();
  const [cloudUrl, setCloudUrl] = useState('');

  useEffect(() => {
    setCloudUrl(getCloudUrl('/sign-up', utmGroupId));
  }, [utmGroupId]);

  // Refs para animações de scroll
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const whyRef = useRef(null);
  const howRef = useRef(null);
  const pricingRef = useRef(null);

  // Hooks para detectar elementos no viewport
  const heroInView = useInView(heroRef, { once: false, amount: 0.1 });
  const featuresInView = useInView(featuresRef, { once: false, amount: 0.1 });
  const whyInView = useInView(whyRef, { once: false, amount: 0.1 });
  const howInView = useInView(howRef, { once: false, amount: 0.1 });
  const pricingInView = useInView(pricingRef, { once: false, amount: 0.1 });

  // Efeito de parallax para o hero
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  // Estado para controlar o botão de scroll to top
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Verificar a posição do scroll para mostrar/esconder o botão
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Função para rolar para o topo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Variantes de animação
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <main className="flex flex-col overflow-x-hidden overflow-y-hidden h-full">
      <Header
        menuItems={[
          { label: t('header.home'), href: '/' },
          { label: t('header.features'), href: '#features' },
          { label: t('header.why'), href: '#why' },
          { label: t('header.pricing'), href: '#pricing' },
          { label: t('header.faq'), href: '#faq' },
        ]}
      />

      <div className="flex flex-col px-6 overflow-x-hidden overflow-y-hidden h-full">
        {/* Botão de Scroll to Top */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              className="fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full bg-primary-500 text-zinc-900 shadow-lg flex items-center justify-center"
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              aria-label="Scroll to top"
            >
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
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <motion.div
          ref={heroRef}
          className="relative flex flex-col gap-3 md:gap-5 items-center justify-between md:justify-center min-h-[calc(100dvh-64px)] py-6 overflow-hidden"
          style={{ y: heroY, opacity: heroOpacity }}
          initial="hidden"
          animate={heroInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-primary-950/30 via-zinc-950 to-zinc-950 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/10 via-primary-500/5 to-transparent -z-20"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2 }}
          />

          <div className="flex-1" />
          <motion.div
            className="flex flex-col items-center justify-end md:justify-center gap-6 h-fit relative"
            variants={staggerContainer}
          >
            <motion.div
              className="flex flex-col items-center gap-6"
              variants={staggerContainer}
            >
              <motion.div className="relative" variants={fadeInUp}>
                <motion.h1
                  className="hidden md:block text-7xl 2xl:text-8xl font-bold text-center bg-gradient-to-br from-primary-900 to-primary-700 text-transparent bg-clip-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.2,
                  }}
                >
                  {t('hero.title')}
                </motion.h1>
                <motion.h1
                  className="md:hidden text-4xl font-bold text-center bg-gradient-to-br from-primary-900 to-primary-700 text-transparent bg-clip-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.2,
                  }}
                >
                  {t('hero.title')}
                </motion.h1>
                <motion.div
                  className="absolute -inset-x-8 top-1/2 -z-10 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                />
              </motion.div>

              <motion.p
                className="text-center w-full text-sm md:text-base 2xl:text-lg md:w-8/12 text-zinc-400 max-w-2xl"
                variants={fadeInUp}
              >
                {t('hero.subtitle')}
              </motion.p>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex md:relative gap-4 w-full md:w-4/12 2xl:w-3/12 z-10"
            variants={fadeInUp}
          >
            <Button
              color="primary"
              variant="shadow"
              as={Link}
              href={cloudUrl}
              target="_blank"
              fullWidth
              className="font-medium"
              aria-label="Sign Up for JSX Mail Cloud"
            >
              {t('hero.cta.signUp')}
            </Button>
            <Button
              color="primary"
              variant="flat"
              as={Link}
              href="https://docs.jsxmail.org/api-reference/introduction"
              target="_blank"
              fullWidth
              className="font-medium"
              aria-label="View JSX Mail Cloud Documentation"
            >
              {t('hero.cta.docs')}
            </Button>
          </motion.div>
          <div className="flex-1" />

          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.8,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
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
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Cloud Features Section */}
        <motion.div
          ref={featuresRef}
          className="flex flex-col gap-12 items-center w-full my-16 md:my-32"
          initial="hidden"
          animate={featuresInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          viewport={{ once: false, amount: 0.05 }}
        >
          <motion.div
            className="flex flex-col gap-4 items-center w-full md:w-7/12 2xl:w-5/12"
            variants={fadeInUp}
          >
            <motion.h1
              className="text-4xl font-bold text-center bg-gradient-to-br from-zinc-100 to-zinc-400 text-transparent bg-clip-text"
              variants={fadeInUp}
            >
              {t('features.title')}
            </motion.h1>
            <motion.p
              className="text-center text-sm text-zinc-400"
              variants={fadeInUp}
            >
              {t('features.subtitle')}
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
            variants={staggerContainer}
          >
            {[
              {
                title: t('features.items.emailDelivery.title'),
                description: t('features.items.emailDelivery.description'),
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
                title: t('features.items.imageHosting.title'),
                description: t('features.items.imageHosting.description'),
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
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                ),
              },
              {
                title: t('features.items.analytics.title'),
                description: t('features.items.analytics.description'),
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
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group relative p-6 bg-gradient-to-br from-zinc-900 to-zinc-800/80 rounded-3xl flex flex-col gap-4 border border-zinc-800/50 hover:border-primary-500/50 transition-all duration-300"
                variants={fadeInUp}
                custom={index}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
                <motion.div
                  className="h-12 w-12 bg-primary-900/20 rounded-full flex items-center justify-center"
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2, type: 'spring' },
                  }}
                >
                  {feature.icon}
                </motion.div>
                <div className="space-y-2">
                  <h2 className="text-xl font-medium text-zinc-100">
                    {feature.title}
                  </h2>
                  <p className="text-sm text-zinc-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bulk Sending Section */}
        <motion.div
          className="my-16 md:my-32 w-full overflow-x-hidden overflow-y-hidden h-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.05 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col gap-12 items-center w-full overflow-x-hidden overflow-y-hidden h-full">
            <motion.div
              className="flex flex-col gap-4 items-center w-full md:w-7/12 2xl:w-5/12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, width: 0 }}
                whileInView={{ opacity: 1, width: 'auto' }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div
                  className="h-px w-12 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.8 }}
                />
                <motion.h2
                  className="text-sm font-medium text-primary-400"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {t('bulkSending.header-title')}
                </motion.h2>
                <motion.div
                  className="h-px w-12 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.8 }}
                />
              </motion.div>
              <motion.h1
                className="text-4xl font-bold text-center bg-gradient-to-br from-zinc-100 to-zinc-400 text-transparent bg-clip-text"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {t('bulkSending.title')}
              </motion.h1>
              <motion.p
                className="text-center text-sm text-zinc-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {t('bulkSending.subtitle')}
              </motion.p>
            </motion.div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 overflow-x-hidden overflow-y-hidden h-full">
              {/* Left side - Visual/Features */}
              <motion.div
                className="relative overflow-hidden rounded-3xl w-full"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 h-full rounded-3xl border border-zinc-800/50">
                  <motion.div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 1.2 }}
                  />

                  <motion.div
                    className="flex flex-col gap-4 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="h-14 w-14 bg-primary-900/30 rounded-2xl flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-400"
                      >
                        <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1" />
                        <path d="M17 3h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1" />
                        <path d="M3 19h18" />
                        <path d="M9 3v18" />
                        <path d="M16 3v18" />
                      </svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold">
                      {t('bulkSending.contactManagement.title')}
                    </h3>
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
                  >
                    {[
                      {
                        title: t(
                          'bulkSending.contactManagement.features.importCsv.title',
                        ),
                        description: t(
                          'bulkSending.contactManagement.features.importCsv.description',
                        ),
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary-400"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        ),
                      },
                      {
                        title: t(
                          'bulkSending.contactManagement.features.groupManagement.title',
                        ),
                        description: t(
                          'bulkSending.contactManagement.features.groupManagement.description',
                        ),
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary-400"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        ),
                      },
                      {
                        title: t(
                          'bulkSending.contactManagement.features.automaticDeduplication.title',
                        ),
                        description: t(
                          'bulkSending.contactManagement.features.automaticDeduplication.description',
                        ),
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary-400"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        ),
                      },
                      {
                        title: t(
                          'bulkSending.contactManagement.features.advancedFiltering.title',
                        ),
                        description: t(
                          'bulkSending.contactManagement.features.advancedFiltering.description',
                        ),
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary-400"
                          >
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                          </svg>
                        ),
                      },
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex flex-col gap-2 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30 hover:border-primary-500/30 transition-all duration-300"
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.4 },
                          },
                        }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <div className="p-1.5 bg-primary-900/50 rounded-lg">
                            {feature.icon}
                          </div>
                          <h4 className="text-sm font-medium text-zinc-200">
                            {feature.title}
                          </h4>
                        </div>
                        <p className="text-xs text-zinc-400">
                          {feature.description}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* Right side - Process Flow */}
              <motion.div
                className="flex flex-col gap-6 w-full overflow-x-hidden overflow-y-hidden h-full"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative z-10 overflow-x-hidden overflow-y-hidden h-full">
                  <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-zinc-100 to-zinc-400 text-transparent bg-clip-text">
                    {t('bulkSending.process.title')}
                  </h3>
                  <p className="text-zinc-400 text-sm mb-6">
                    {t('bulkSending.process.description')}
                  </p>

                  <div className="flex flex-col gap-8 overflow-x-hidden overflow-y-hidden h-full">
                    {[
                      {
                        step: '01',
                        title: t('bulkSending.process.steps.createGroup.title'),
                        description: t(
                          'bulkSending.process.steps.createGroup.description',
                        ),
                      },
                      {
                        step: '02',
                        title: t(
                          'bulkSending.process.steps.importContacts.title',
                        ),
                        description: t(
                          'bulkSending.process.steps.importContacts.description',
                        ),
                      },
                      {
                        step: '03',
                        title: t(
                          'bulkSending.process.steps.designCampaign.title',
                        ),
                        description: t(
                          'bulkSending.process.steps.designCampaign.description',
                        ),
                      },
                      {
                        step: '04',
                        title: t(
                          'bulkSending.process.steps.sendAndTrack.title',
                        ),
                        description: t(
                          'bulkSending.process.steps.sendAndTrack.description',
                        ),
                      },
                    ].map((step, index) => (
                      <motion.div
                        key={index}
                        className="relative flex gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      >
                        {/* Connector line */}
                        {index < 3 && (
                          <div
                            className="absolute left-6 top-12 w-0.5 h-14 bg-gradient-to-b from-primary-500/50 to-zinc-800/50"
                            style={{ transform: 'translateX(-50%)' }}
                          />
                        )}

                        {/* Step number */}
                        <div className="flex-shrink-0 h-12 w-12 bg-primary-900/30 rounded-full flex items-center justify-center border border-primary-700/30">
                          <span className="text-sm font-bold text-primary-400">
                            {step.step}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-1">
                          <h4 className="text-lg font-medium text-zinc-100">
                            {step.title}
                          </h4>
                          <p className="text-sm text-zinc-400">
                            {step.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div
                  className="mt-4 p-6 bg-gradient-to-br from-primary-900/20 to-primary-800/10 rounded-2xl border border-primary-800/30 w-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className="p-2 bg-primary-900/50 rounded-lg flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-400"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-primary-300 mb-1">
                        {t('bulkSending.process.optimization.title')}
                      </h4>
                      <p className="text-sm text-zinc-400">
                        {t('bulkSending.process.optimization.description')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              className="mt-12 flex flex-col md:flex-row gap-6 justify-center items-center w-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Button
                  color="primary"
                  variant="shadow"
                  as={Link}
                  href={cloudUrl}
                  target="_blank"
                  className="font-medium px-10 py-6 text-base relative overflow-hidden group"
                  aria-label="Start sending bulk emails"
                >
                  <span className="relative z-10">
                    {t('bulkSending.cta.startSending')}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 transition-opacity opacity-0 group-hover:opacity-100" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Why Choose JSX Mail Cloud Section */}
        <motion.div
          ref={whyRef}
          className="my-16 md:my-32 md:min-h-[80vh] flex justify-center items-center flex-col md:flex-row gap-12 md:gap-20"
          id="why"
          initial="hidden"
          animate={whyInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          viewport={{ once: false, amount: 0.05 }}
        >
          <motion.div className="relative" variants={fadeInUp}>
            <motion.h1
              className="text-primary-400 font-bold text-7xl md:text-8xl text-nowrap"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('why.title')}
            </motion.h1>
            <motion.div
              className="absolute -inset-x-8 top-1/2 -z-10 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
          >
            {[
              {
                title: t('why.reasons.payAsYouGo.title'),
                description: t('why.reasons.payAsYouGo.description'),
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
                title: t('why.reasons.highDeliverability.title'),
                description: t('why.reasons.highDeliverability.description'),
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
                title: t('why.reasons.easyIntegration.title'),
                description: t('why.reasons.easyIntegration.description'),
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
                title: t('why.reasons.comprehensiveSolution.title'),
                description: t('why.reasons.comprehensiveSolution.description'),
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
                    <path d="M12 22c6.23-.05 7.87-5.57 7.5-10-.36-4.34-3.95-9.96-7.5-10-3.55.04-7.14 5.66-7.5 10-.37 4.43 1.27 9.95 7.5 10z" />
                    <path d="M12 6c-1.79 1.82-2.13 4.42-2 6.5.12 2.1.89 4.2 2 5.5 1.11-1.3 1.88-3.4 2-5.5.13-2.08-.21-4.68-2-6.5z" />
                  </svg>
                ),
              },
            ].map((reason, index) => (
              <motion.div
                key={index}
                className="group relative p-6 bg-gradient-to-br from-zinc-900 to-zinc-800/80 rounded-2xl border border-zinc-800/50 hover:border-primary-500/50 transition-all duration-300"
                variants={fadeInUp}
                custom={index}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
                <div className="relative flex flex-col gap-4">
                  <motion.div
                    className="h-12 w-12 bg-primary-900/20 rounded-xl flex items-center justify-center"
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2, type: 'spring' },
                    }}
                  >
                    {reason.icon}
                  </motion.div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-medium text-zinc-100">
                      {reason.title}
                    </h2>
                    <p className="text-sm text-zinc-400">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          ref={howRef}
          className="flex flex-col gap-12 items-center w-full my-16 md:my-32"
          initial="hidden"
          animate={howInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          viewport={{ once: false, amount: 0.05 }}
        >
          <motion.div
            className="flex flex-col gap-4 items-center w-full md:w-7/12 2xl:w-5/12"
            variants={fadeInUp}
          >
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                className="h-px w-12 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8 }}
              />
              <motion.h2
                className="text-sm font-medium text-primary-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {t('howItWorks.header-title')}
              </motion.h2>
              <motion.div
                className="h-px w-12 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8 }}
              />
            </motion.div>
            <motion.h1
              className="text-4xl font-bold text-center bg-gradient-to-br from-zinc-100 to-zinc-400 text-transparent bg-clip-text"
              variants={fadeInUp}
            >
              {t('howItWorks.title')}
            </motion.h1>
            <motion.p
              className="text-center text-sm text-zinc-400"
              variants={fadeInUp}
            >
              {t('howItWorks.subtitle')}
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
            variants={staggerContainer}
          >
            {[
              {
                step: 1,
                title: t('howItWorks.steps.signUp.title'),
                description: t('howItWorks.steps.signUp.description'),
                href: 'https://cloud.jsxmail.org/sign-up',
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
                title: t('howItWorks.steps.integrate.title'),
                description: t('howItWorks.steps.integrate.description'),
                href: 'https://docs.jsxmail.org/api-reference/introduction',
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
                title: t('howItWorks.steps.monitor.title'),
                description: t('howItWorks.steps.monitor.description'),
                href: 'https://cloud.jsxmail.org',
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
              <motion.div
                key={index}
                className="group relative p-6 bg-gradient-to-br from-zinc-900 to-zinc-800/80 rounded-2xl border border-zinc-800/50 hover:border-primary-500/50 transition-all duration-300"
                variants={fadeInUp}
                custom={index}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
                <div className="relative flex flex-col gap-4">
                  <motion.div
                    className="h-12 w-12 bg-primary-900/20 rounded-xl flex items-center justify-center"
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2, type: 'spring' },
                    }}
                  >
                    {item.icon}
                  </motion.div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-medium text-zinc-100">
                      {item.title}
                    </h2>
                    <p className="text-sm text-zinc-400">{item.description}</p>
                  </div>
                </div>
                {item.href && (
                  <Link href={item.href} className="absolute inset-0">
                    <span className="sr-only">
                      Learn more about {item.title}
                    </span>
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Comparison Section */}
        <div className="flex flex-col gap-8 items-center w-full my-20">
          <div className="flex flex-col gap-3 items-center w-full md:w-7/12 2xl:w-5/12">
            <h1 className="text-3xl font-bold text-center">
              {t('comparison.title')}
            </h1>
            <p className="text-center text-sm text-zinc-400">
              {t('comparison.subtitle')}
            </p>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="p-4 text-left">
                    {t('comparison.features.title')}
                  </th>
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
                  <td className="p-4">{t('comparison.features.payAsYouGo')}</td>
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
                  <td className="p-4">{t('comparison.features.freeTier')}</td>
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
                  <td className="p-4">
                    {t('comparison.features.imageHosting')}
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
                  <td className="p-4">
                    {t('comparison.features.frameworkIntegration')}
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
                      className="text-primary-500 mx-auto"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="p-4">
                    {t('comparison.features.comprehensiveAnalytics')}
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
        <motion.div
          className="relative flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12 lg:p-16 my-16 md:my-32 overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.05 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900/50 to-zinc-900 -z-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1.2 }}
          />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/20 via-primary-500/5 to-transparent -z-10"
            initial={{ opacity: 0, scale: 1.1 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1.5 }}
          />

          <motion.div
            className="flex flex-col gap-6 md:w-7/12"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="space-y-2">
              <motion.h2
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 text-transparent bg-clip-text"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {t('readyToStart.title')}
              </motion.h2>
              <motion.p
                className="text-base text-zinc-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {t('readyToStart.description', {
                  count: data?.FREE_EMAILS_PER_MONTH,
                })}
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col gap-4 w-full md:w-auto"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Button
                color="primary"
                variant="shadow"
                as={Link}
                href={cloudUrl}
                target="_blank"
                fullWidth
                size="lg"
                className="font-medium px-12 py-6 text-base relative overflow-hidden group"
                aria-label="Sign up for JSX Mail Cloud"
              >
                <span className="relative z-10">
                  {t('readyToStart.signUp')}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 transition-opacity opacity-0 group-hover:opacity-100" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Button
                color="primary"
                variant="flat"
                as={Link}
                href="https://docs.jsxmail.org/cloud/getting-started"
                target="_blank"
                fullWidth
                size="lg"
                className="font-medium"
                aria-label="View JSX Mail Cloud Documentation"
              >
                {t('readyToStart.learnMore')}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Pricing Section */}
        <motion.div
          ref={pricingRef}
          id="pricing"
          className="flex flex-col gap-12 items-center w-full my-16 md:my-32"
          initial="hidden"
          animate={pricingInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          viewport={{ once: false, amount: 0.05 }}
        >
          <motion.div
            className="flex flex-col gap-4 items-center w-full md:w-7/12 2xl:w-5/12"
            variants={fadeInUp}
          >
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                className="h-px w-12 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8 }}
              />
              <motion.h2
                className="text-sm font-medium text-primary-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {t('pricing.header-title')}
              </motion.h2>
              <motion.div
                className="h-px w-12 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8 }}
              />
            </motion.div>
            <motion.h1
              className="text-4xl font-bold text-center bg-gradient-to-br from-zinc-100 to-zinc-400 text-transparent bg-clip-text"
              variants={fadeInUp}
            >
              {t('pricing.title')}
            </motion.h1>
            <motion.p
              className="text-center text-sm text-zinc-400"
              variants={fadeInUp}
            >
              {t('pricing.subtitle')}
            </motion.p>
          </motion.div>

          <motion.div variants={fadeInUp} className="w-full">
            <CloudPricing cloudUrl={cloudUrl} />
          </motion.div>
        </motion.div>

        {/* FAQ Section */}
        <div id="faq">
          <Faq />
        </div>
      </div>

      <Footer />
    </main>
  );
}

function CloudPricing({ cloudUrl }: { cloudUrl: string }) {
  const t = useTranslations('CloudPage.pricing');
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
      (value * ((emailPricing.price || 0) / emailPricing.unit)) /
      data.MONEY_SCALE;

    if (value <= data.FREE_EMAILS_PER_MONTH) jsxMailCloudPricing = 0;

    const newPricing = [
      {
        amount: jsxMailCloudPricing,
        period: t('pay-as-you-go'),
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
        period: t('monthly'),
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
        period: t('monthly'),
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
        <p>{t('error-to-fetch-data')}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Simulador de Custos */}
      <motion.div
        className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 p-8 md:p-12 rounded-3xl mb-12 backdrop-blur-sm border border-zinc-800/50 overflow-hidden"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ boxShadow: '0 0 30px rgba(0, 0, 0, 0.2)' }}
      >
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/5 via-transparent to-transparent"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1.5 }}
        />

        <motion.div
          className="relative flex flex-col md:flex-row gap-8 mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1,
              },
            },
          }}
        >
          <motion.div
            className="md:w-1/3"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.6 },
              },
            }}
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold bg-gradient-to-br from-zinc-100 to-zinc-400 text-transparent bg-clip-text">
                {t('costSimulator.title')}
              </h3>
              <p className="text-sm text-zinc-400">
                {t('costSimulator.description')}
              </p>
            </div>
          </motion.div>

          <motion.div
            className="md:w-2/3 space-y-6"
            variants={{
              hidden: { opacity: 0, x: 20 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.6 },
              },
            }}
          >
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-zinc-300">
                    {t('costSimulator.monthlyEmails')}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {t('costSimulator.dragOrType')}
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
                    <span className="text-xs text-zinc-300">
                      {t('costSimulator.emails')}
                    </span>
                  }
                  aria-label={t('costSimulator.emails')}
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Slider
                  size="sm"
                  maxValue={emailPricing?.maxValue}
                  step={emailPricing?.step}
                  minValue={emailPricing?.minValue}
                  value={value}
                  onChange={(count) => setValue(Number(count))}
                  className="w-full"
                />
              </motion.div>

              <div className="flex justify-between">
                <span className="text-xs text-zinc-500">
                  {emailPricing?.minValue.toLocaleString('en-US')}
                </span>
                <span className="text-xs text-zinc-500">
                  {emailPricing?.maxValue.toLocaleString('en-US')}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative bg-gradient-to-br from-zinc-900 to-zinc-800/90 p-6 md:p-8 rounded-2xl border border-zinc-800/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <motion.div
            className="space-y-8 mt-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
          >
            {prices.map((price, index) => (
              <motion.div
                key={index}
                className="relative"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5 },
                  },
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                  <motion.div
                    className="w-20 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {price.logo}
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-1 md:ml-auto"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0 }}
                  >
                    <span
                      className={clsx('text-lg font-bold', {
                        'text-primary-300': index === 0,
                        'text-zinc-300': index !== 0,
                      })}
                    >
                      ${price.amount.toFixed(2)}
                    </span>
                    <p className="text-xs text-zinc-500">/{price.period}</p>
                  </motion.div>
                </div>

                <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden group">
                  <motion.div
                    className={clsx(
                      'h-full rounded-full transition-all duration-300 group-hover:brightness-110',
                      {
                        'bg-gradient-to-r from-primary-600 to-primary-400':
                          index === 0,
                        'bg-zinc-700': index !== 0,
                      },
                    )}
                    style={{ width: `${price.barPercentage || 1}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${price.barPercentage || 1}%` }}
                    transition={{ duration: 0.3, delay: 0 }}
                  />
                </div>

                {index === 0 && price.amount === 0 && (
                  <motion.div
                    className="absolute right-0 -top-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0 }}
                  >
                    <motion.span
                      className="inline-flex items-center gap-1 text-xs bg-primary-500/20 text-primary-300 px-3 py-1.5 rounded-full"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
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
                    </motion.span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Features e CTA */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05,
              delayChildren: 0.1,
            },
          },
        }}
      >
        <motion.div
          className="group relative p-6 bg-gradient-to-br from-primary-900/20 to-primary-700/20 rounded-2xl border border-primary-800/30 hover:border-primary-700/50 transition-all duration-300"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4 },
            },
          }}
          whileHover={{
            y: -5,
            transition: { duration: 0.2 },
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
          <div className="relative">
            <motion.div
              className="h-12 w-12 bg-primary-900/30 rounded-xl flex items-center justify-center mb-4"
              whileHover={{
                scale: 1.05,
                rotate: 5,
                transition: { duration: 0.2, type: 'spring' },
              }}
            >
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
            </motion.div>
            <h3 className="text-lg font-semibold mb-2 text-primary-300">
              {t('features.freeTier.title')}
            </h3>
            <p className="text-sm text-zinc-400">
              {t('features.freeTier.description', {
                count: data?.FREE_EMAILS_PER_MONTH,
              })}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="group relative p-6 bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 rounded-2xl border border-zinc-800/50 hover:border-primary-500/50 transition-all duration-300"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, delay: 0.05 },
            },
          }}
          whileHover={{
            y: -5,
            transition: { duration: 0.2 },
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
          <div className="relative">
            <motion.div
              className="h-12 w-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-4"
              whileHover={{
                scale: 1.05,
                rotate: 5,
                transition: { duration: 0.2, type: 'spring' },
              }}
            >
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
            </motion.div>
            <h3 className="text-lg font-semibold mb-2 text-zinc-100">
              {t('features.noSubscriptions.title')}
            </h3>
            <p className="text-sm text-zinc-400">
              {t('features.noSubscriptions.description')}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="group relative p-6 bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 rounded-2xl border border-zinc-800/50 hover:border-primary-500/50 transition-all duration-300"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, delay: 0.1 },
            },
          }}
          whileHover={{
            y: -5,
            transition: { duration: 0.2 },
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
          <div className="relative">
            <motion.div
              className="h-12 w-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-4"
              whileHover={{
                scale: 1.05,
                rotate: 5,
                transition: { duration: 0.2, type: 'spring' },
              }}
            >
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
            </motion.div>
            <h3 className="text-lg font-semibold mb-2 text-zinc-100">
              {t('features.fullAnalytics.title')}
            </h3>
            <p className="text-sm text-zinc-400">
              {t('features.fullAnalytics.description')}
            </p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Button
            as={Link}
            href={cloudUrl}
            target="_blank"
            color="primary"
            variant="shadow"
            size="lg"
            className="px-12 py-6 text-base font-medium relative overflow-hidden group"
            aria-label="Sign up for JSX Mail Cloud"
          >
            <span className="relative z-10">{t('cta.getStarted')}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 transition-opacity opacity-0 group-hover:opacity-100" />
          </Button>
        </motion.div>
        <motion.p
          className="text-xs text-zinc-500 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {t('cta.noCreditCard')}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
