import React, { useEffect, useRef } from 'react';
import EditHealthProfileForm from './EditHealthProfileForm';

interface Props {
  form: {
    age: number;
    height: number;
    weight: number;
    bloodPressure: string;
    cholesterol: string;
    conditions: string;
    allergies: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
}

const HealthEditModal: React.FC<Props> = ({ form, onChange, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4">
      <div ref={modalRef} className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg">
        <EditHealthProfileForm form={form} onChange={onChange} onClose={onClose} />
      </div>
    </div>
  );
};

export default HealthEditModal;