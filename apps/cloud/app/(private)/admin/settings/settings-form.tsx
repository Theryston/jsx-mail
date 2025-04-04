'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@jsx-mail/ui/dialog';
import { Settings } from '@/types/settings';
import { cn } from '@jsx-mail/ui/lib/utils';
import { useDefaultSettings } from '@/hooks/settings';
import { Badge } from '@jsx-mail/ui/badge';

const createSettingsSchema = (isUserSettings: boolean) => {
  const baseSchema = {
    maxFileSize: z.number().min(0, 'Max file size must be 0 or greater'),
    maxBalanceToBeEligibleForFree: z.number().min(0, 'Must be 0 or greater'),
    freeEmailsPerMonth: z.number().min(0, 'Must be 0 or greater'),
    minBalanceToAdd: z.number().min(0, 'Minimum balance must be 0 or greater'),
    storageGbPrice: z.number().min(0, 'Must be 0 or greater'),
    pricePerMessage: z.number().min(0, 'Must be 0 or greater'),
    maxStorage: z.number().min(0, 'Max storage must be 0 or greater'),
    bounceRateLimit: z
      .number()
      .min(0, 'Must be 0 or greater')
      .max(100, 'Must be 100 or less'),
    complaintRateLimit: z
      .number()
      .min(0, 'Must be 0 or greater')
      .max(100, 'Must be 100 or less'),
    gapToCheckSecurityInsights: z.number().min(0, 'Must be 0 or greater'),
    minEmailsForRateCalculation: z.number().min(0, 'Must be 0 or greater'),
    maxSecurityCodesPerHour: z.number().min(0, 'Must be 0 or greater'),
    maxSecurityCodesPerMinute: z.number().min(0, 'Must be 0 or greater'),
  };

  if (!isUserSettings) {
    return z.object({
      ...baseSchema,
      globalMaxMessagesPerSecond: z.number().min(0, 'Must be 0 or greater'),
      globalMaxMessagesPerDay: z.number().min(0, 'Must be 0 or greater'),
    });
  }

  return z.object(baseSchema);
};

type BaseSettingsFormValues = {
  maxFileSize: number;
  maxBalanceToBeEligibleForFree: number;
  freeEmailsPerMonth: number;
  minBalanceToAdd: number;
  storageGbPrice: number;
  pricePerMessage: number;
  maxStorage: number;
  bounceRateLimit: number;
  complaintRateLimit: number;
  gapToCheckSecurityInsights: number;
  minEmailsForRateCalculation: number;
  maxSecurityCodesPerHour: number;
  maxSecurityCodesPerMinute: number;
};

type GlobalSettingsFormValues = BaseSettingsFormValues & {
  globalMaxMessagesPerSecond: number;
  globalMaxMessagesPerDay: number;
};

type SettingsFormValues = BaseSettingsFormValues | GlobalSettingsFormValues;

interface ChangedField {
  old: number;
  new: number;
}

interface SettingsFormProps {
  initialData?: Settings;
  onSubmit: (data: SettingsFormValues) => Promise<void>;
  onDiscard?: (data: SettingsFormValues) => Promise<void>;
  isUserSettings?: boolean;
  title?: string;
  description?: string;
  forcePerRow?: boolean;
}

export function SettingsForm({
  initialData,
  onSubmit,
  title,
  description,
  isUserSettings = false,
  onDiscard,
  forcePerRow = false,
}: SettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [changedFields, setChangedFields] = useState<
    Record<string, ChangedField>
  >({});
  const [formData, setFormData] = useState<SettingsFormValues | null>(null);
  const { data: defaultSettings } = useDefaultSettings();

  const schema = createSettingsSchema(isUserSettings);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      maxFileSize: 0,
      maxBalanceToBeEligibleForFree: 0,
      freeEmailsPerMonth: 0,
      minBalanceToAdd: 0,
      storageGbPrice: 0,
      pricePerMessage: 0,
      maxStorage: 0,
      bounceRateLimit: 0,
      complaintRateLimit: 0,
      gapToCheckSecurityInsights: 0,
      minEmailsForRateCalculation: 0,
      maxSecurityCodesPerHour: 0,
      maxSecurityCodesPerMinute: 0,
      ...(!isUserSettings
        ? {
            globalMaxMessagesPerSecond: 0,
            globalMaxMessagesPerDay: 0,
          }
        : {}),
    } as SettingsFormValues,
  });

  const handleDiscard = async () => {
    setIsDiscarding(true);
    await onDiscard?.(form.getValues());
    setIsDiscarding(false);
  };

  useEffect(() => {
    if (initialData) form.reset(initialData);
  }, [initialData, form]);

  const compareValues = useCallback(
    (data: SettingsFormValues) => {
      if (!initialData) return {};

      const changes: Record<string, ChangedField> = {};

      Object.keys(data).forEach((key) => {
        const typedKey = key as keyof SettingsFormValues;
        if (data[typedKey] !== initialData[typedKey]) {
          changes[key] = {
            old: initialData[typedKey],
            new: data[typedKey],
          };
        }
      });

      return changes;
    },
    [initialData],
  );

  const getDifferentFields = useCallback(() => {
    if (!isUserSettings || !defaultSettings || !initialData) return {};

    const differentFields: Record<string, { old: number; new: number }> = {};

    Object.keys(initialData).forEach((key) => {
      const typedKey = key as keyof Settings;
      if (initialData[typedKey] !== defaultSettings[typedKey]) {
        differentFields[key] = {
          old: defaultSettings[typedKey],
          new: initialData[typedKey],
        };
      }
    });

    return differentFields;
  }, [isUserSettings, defaultSettings, initialData]);

  const differentFields = getDifferentFields();

  function handleFormSubmit(data: SettingsFormValues) {
    const changes = compareValues(data);

    if (Object.keys(changes).length > 0) {
      setChangedFields(changes);
      setFormData(data);
      setShowConfirmDialog(true);
    } else {
      submitForm(data);
    }
  }

  async function submitForm(data: SettingsFormValues) {
    setIsSubmitting(true);
    try {
      console.log('Submitting form with data:', data);
      await onSubmit(data);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setIsSubmitting(false);
    }
  }

  function confirmChanges() {
    if (formData) {
      submitForm(formData);
      setShowConfirmDialog(false);
    }
  }

  function cancelChanges() {
    setShowConfirmDialog(false);
    setChangedFields({});
    setFormData(null);
    form.reset(initialData);
  }

  const isFieldDifferent = (fieldName: string) => {
    return fieldName in differentFields;
  };

  const formatNumber = (value: number) => {
    return value;
  };

  return (
    <div className="space-y-4">
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {isUserSettings && Object.keys(differentFields).length > 0 && (
        <div className="mb-4 p-4 bg-amber-400/10 rounded-lg">
          <p className="text-sm text-amber-400">
            This user has custom settings for the following fields:
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(differentFields).map(([field, values]) => (
              <Badge key={field} variant="secondary">
                {field}: {formatNumber(values.old)} → {formatNumber(values.new)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <div
            className={cn(
              'grid grid-cols-1 gap-4',
              !forcePerRow && 'md:grid-cols-2',
            )}
          >
            <FormField
              control={form.control}
              name="maxFileSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Max File Size (MB)
                    {isFieldDifferent('maxFileSize') && (
                      <Badge variant="outline" className="text-xs">
                        {formatNumber(differentFields.maxFileSize.old)} →{' '}
                        {formatNumber(differentFields.maxFileSize.new)}
                      </Badge>
                    )}
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    Max Balance for Free Tier
                    {isFieldDifferent('maxBalanceToBeEligibleForFree') && (
                      <Badge variant="outline" className="text-xs">
                        {formatNumber(
                          differentFields.maxBalanceToBeEligibleForFree.old,
                        )}{' '}
                        →{' '}
                        {formatNumber(
                          differentFields.maxBalanceToBeEligibleForFree.new,
                        )}
                      </Badge>
                    )}
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    Free Emails per Month
                    {isFieldDifferent('freeEmailsPerMonth') && (
                      <Badge variant="outline" className="text-xs">
                        {formatNumber(differentFields.freeEmailsPerMonth.old)} →{' '}
                        {formatNumber(differentFields.freeEmailsPerMonth.new)}
                      </Badge>
                    )}
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    Minimum Balance to Add
                    {isFieldDifferent('minBalanceToAdd') && (
                      <Badge variant="outline" className="text-xs">
                        {formatNumber(differentFields.minBalanceToAdd.old)} →{' '}
                        {formatNumber(differentFields.minBalanceToAdd.new)}
                      </Badge>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.0000001"
                      {...field}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        field.onChange(isNaN(value) ? 0 : value);
                      }}
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
                  <FormLabel className="flex items-center gap-2">
                    Storage Price per GB
                    {isFieldDifferent('storageGbPrice') && (
                      <Badge variant="outline" className="text-xs">
                        {formatNumber(differentFields.storageGbPrice.old)} →{' '}
                        {formatNumber(differentFields.storageGbPrice.new)}
                      </Badge>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.0000001"
                      {...field}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        field.onChange(isNaN(value) ? 0 : value);
                      }}
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
                  <FormLabel className="flex items-center gap-2">
                    Price per Message
                    {isFieldDifferent('pricePerMessage') && (
                      <Badge variant="outline" className="text-xs">
                        {formatNumber(differentFields.pricePerMessage.old)} →{' '}
                        {formatNumber(differentFields.pricePerMessage.new)}
                      </Badge>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.0000001"
                      {...field}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        field.onChange(isNaN(value) ? 0 : value);
                      }}
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
                  <FormLabel className="flex items-center gap-2">
                    Max Storage (GB)
                    {isFieldDifferent('maxStorage') && (
                      <Badge variant="outline" className="text-xs">
                        {formatNumber(differentFields.maxStorage.old)} →{' '}
                        {formatNumber(differentFields.maxStorage.new)}
                      </Badge>
                    )}
                  </FormLabel>
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

            {!isUserSettings && (
              <>
                <FormField
                  control={form.control}
                  name="globalMaxMessagesPerSecond"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Global Max Messages per Second</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.0000001"
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
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
                          step="0.0000001"
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="bounceRateLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Bounce Rate Limit (0-1)
                    {isFieldDifferent('bounceRateLimit') && (
                      <Badge variant="outline" className="text-xs">
                        {formatNumber(differentFields.bounceRateLimit.old)} →{' '}
                        {formatNumber(differentFields.bounceRateLimit.new)}
                      </Badge>
                    )}
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    Complaint Rate Limit (0-1)
                    {isFieldDifferent('complaintRateLimit') && (
                      <Badge variant="outline" className="text-xs">
                        {formatNumber(differentFields.complaintRateLimit.old)} →{' '}
                        {formatNumber(differentFields.complaintRateLimit.new)}
                      </Badge>
                    )}
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    Gap to Check Security Insights (days)
                    {isFieldDifferent('gapToCheckSecurityInsights') && (
                      <Badge variant="outline" className="text-xs">
                        {formatNumber(
                          differentFields.gapToCheckSecurityInsights.old,
                        )}{' '}
                        →{' '}
                        {formatNumber(
                          differentFields.gapToCheckSecurityInsights.new,
                        )}
                      </Badge>
                    )}
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    Min Emails for Rate Calculation
                    {isFieldDifferent('minEmailsForRateCalculation') && (
                      <Badge variant="outline" className="text-xs">
                        {formatNumber(
                          differentFields.minEmailsForRateCalculation.old,
                        )}{' '}
                        →{' '}
                        {formatNumber(
                          differentFields.minEmailsForRateCalculation.new,
                        )}
                      </Badge>
                    )}
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    Max Security Codes per Hour
                    {isFieldDifferent('maxSecurityCodesPerHour') && (
                      <Badge variant="outline" className="text-xs">
                        {formatNumber(
                          differentFields.maxSecurityCodesPerHour.old,
                        )}{' '}
                        →{' '}
                        {formatNumber(
                          differentFields.maxSecurityCodesPerHour.new,
                        )}
                      </Badge>
                    )}
                  </FormLabel>
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
                  <FormLabel className="flex items-center gap-2">
                    Max Security Codes per Minute
                    {isFieldDifferent('maxSecurityCodesPerMinute') && (
                      <Badge variant="outline" className="text-xs">
                        {formatNumber(
                          differentFields.maxSecurityCodesPerMinute.old,
                        )}{' '}
                        →{' '}
                        {formatNumber(
                          differentFields.maxSecurityCodesPerMinute.new,
                        )}
                      </Badge>
                    )}
                  </FormLabel>
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

          <div className="flex gap-2">
            <Button type="submit" isLoading={isSubmitting}>
              Save Changes
            </Button>

            {isUserSettings && (
              <Button
                variant="outline"
                onClick={handleDiscard}
                isLoading={isDiscarding}
              >
                Discard user settings
              </Button>
            )}
          </div>
        </form>
      </Form>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">Please review the following changes:</p>
            <div className="max-h-[300px] overflow-y-auto">
              {Object.entries(changedFields).map(([key, value]) => (
                <div key={key} className="mb-2 p-2 border rounded">
                  <p className="font-medium">{key}</p>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Old value: </span>
                      {formatNumber(value.old)}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">New value: </span>
                      {formatNumber(value.new)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelChanges}>
              Cancel
            </Button>
            <Button onClick={confirmChanges}>Confirm Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
