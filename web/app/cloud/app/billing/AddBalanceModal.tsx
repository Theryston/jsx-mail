'use client';

import { useCallback, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Autocomplete,
  AutocompleteItem,
} from '@nextui-org/react';
import { toast } from 'react-toastify';
import axios from '@/utils/axios';
import countryToCurrency from 'country-to-currency';
import { COUNTRIES } from '@/utils/countries';

type Props = {
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (isOpen: boolean) => void;
};

export default function AddBalanceModal({ isOpen, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(10);
  const [country, setCountry] = useState('');
  const countries = COUNTRIES.filter((c) =>
    Object.keys(countryToCurrency).includes(c.code),
  );

  const createCheckout = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        data: { url },
      } = await axios.post('/user/checkout', { amount, country });
      window.location.href = url;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [amount, country]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(value) => {
        if (isLoading && !value) return;

        if (!value) {
          setAmount(10);
        }

        onOpenChange(value);
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h1 className="text-xl font-bold">Add balance</h1>
              <p className="text-sm text-gray-500">
                Add balance to your account
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  type="number"
                  label="Amount"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                  value={String(amount)}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  fullWidth
                />
                <Autocomplete
                  label="Billing country"
                  placeholder="Select the country of your payment method"
                  value={country}
                  onSelectionChange={(value) => {
                    setCountry(value as string);
                  }}
                >
                  {countries.map((c) => (
                    <AutocompleteItem key={c.code} value={c.code}>
                      {c.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose} fullWidth>
                Close
              </Button>
              <Button
                isLoading={isLoading}
                color="primary"
                onPress={() => createCheckout()}
                fullWidth
              >
                Pay
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
