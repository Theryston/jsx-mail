'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { toast } from '@jsx-mail/ui/sonner';
import { Button } from '@jsx-mail/ui/button';
import { Input } from '@jsx-mail/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@jsx-mail/ui/form';
import { Settings } from '@/types/settings';

const settingsSchema = z.object({
  maxFileSize: z.number().min(1, 'Max file size must be at least 1'),
  maxBalanceToBeEligibleForFree: z.number().min(0, 'Must be 0 or greater'),
  freeEmailsPerMonth: z.number().min(0, 'Must be 0 or greater'),
  minBalanceToAdd: z.number().min(1, 'Minimum balance must be at least 1'),
  storageGbPrice: z.number().min(0, 'Must be 0 or greater'),
  pricePerMessage: z.number().min(0, 'Must be 0 or greater'),
  maxStorage: z.number().min(1, 'Max storage must be at least 1'),
  globalMaxMessagesPerSecond: z.number().min(1, 'Must be at least 1'),
  globalMaxMessagesPerDay: z.number().min(1, 'Must be at least 1'),
  bounceRateLimit: z
    .number()
    .min(0, 'Must be 0 or greater')
    .max(100, 'Must be 100 or less'),
  complaintRateLimit: z
    .number()
    .min(0, 'Must be 0 or greater')
    .max(100, 'Must be 100 or less'),
  gapToCheckSecurityInsights: z.number().min(1, 'Must be at least 1'),
  minEmailsForRateCalculation: z.number().min(1, 'Must be at least 1'),
  maxSecurityCodesPerHour: z.number().min(1, 'Must be at least 1'),
  maxSecurityCodesPerMinute: z.number().min(1, 'Must be at least 1'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  initialData?: Settings;
  onSubmit: (data: SettingsFormValues) => Promise<void>;
  title?: string;
  description?: string;
}

export function SettingsForm({
  initialData,
  onSubmit,
  title = 'Settings',
  description = 'Update your settings below.',
}: SettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      maxFileSize: initialData?.maxFileSize || 0,
      maxBalanceToBeEligibleForFree:
        initialData?.maxBalanceToBeEligibleForFree || 0,
      freeEmailsPerMonth: initialData?.freeEmailsPerMonth || 0,
      minBalanceToAdd: initialData?.minBalanceToAdd || 0,
      storageGbPrice: initialData?.storageGbPrice || 0,
      pricePerMessage: initialData?.pricePerMessage || 0,
      maxStorage: initialData?.maxStorage || 0,
      globalMaxMessagesPerSecond: initialData?.globalMaxMessagesPerSecond || 0,
      globalMaxMessagesPerDay: initialData?.globalMaxMessagesPerDay || 0,
      bounceRateLimit: initialData?.bounceRateLimit || 0,
      complaintRateLimit: initialData?.complaintRateLimit || 0,
      gapToCheckSecurityInsights: initialData?.gapToCheckSecurityInsights || 0,
      minEmailsForRateCalculation:
        initialData?.minEmailsForRateCalculation || 0,
      maxSecurityCodesPerHour: initialData?.maxSecurityCodesPerHour || 0,
      maxSecurityCodesPerMinute: initialData?.maxSecurityCodesPerMinute || 0,
    },
  });

  useEffect(() => {
    form.reset(initialData);
  }, [initialData]);

  async function handleSubmit(data: SettingsFormValues) {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="maxFileSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max File Size (MB)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxBalanceToBeEligibleForFree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Balance for Free Tier</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="freeEmailsPerMonth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Free Emails per Month</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minBalanceToAdd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Balance to Add</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storageGbPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Storage Price per GB</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricePerMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per Message</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxStorage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Storage (GB)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="globalMaxMessagesPerSecond"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Global Max Messages per Second</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="globalMaxMessagesPerDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Global Max Messages per Day</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bounceRateLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bounce Rate Limit (0-1)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="complaintRateLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complaint Rate Limit (0-1)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gapToCheckSecurityInsights"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gap to Check Security Insights (days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minEmailsForRateCalculation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Emails for Rate Calculation</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxSecurityCodesPerHour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Security Codes per Hour</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxSecurityCodesPerMinute"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Security Codes per Minute</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="mt-4" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
