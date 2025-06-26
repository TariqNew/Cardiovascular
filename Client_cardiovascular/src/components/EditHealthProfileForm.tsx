import React from 'react';

interface EditHealthProfileFormProps {
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

const EditHealthProfileForm: React.FC<EditHealthProfileFormProps> = ({ form, onChange, onClose }) => {
  const handleSave = async () => {
    const payload = {
      age: form.age,
      height: form.height,
      weight: form.weight,
      bloodPressure: form.bloodPressure,
      cholesterolLevel: parseFloat(form.cholesterol),
      medicalConditions: form.conditions.split(',').map((s) => s.trim()),
      allergies: form.allergies.split(',').map((s) => s.trim()),
    };

    try {
      const res = await fetch('/api/health/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        console.log('Saved:', data);
        onClose();
      } else {
        alert('Failed to save.');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Error occurred.');
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="p-4 overflow-y-auto"
    >
      {['age', 'height', 'weight', 'bloodPressure', 'cholesterol'].map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 mt-4">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            type={field === 'bloodPressure' || field === 'cholesterol' ? 'text' : 'number'}
            name={field}
            value={(form as any)[field]}
            onChange={onChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-gray-700 mt-4">Conditions</label>
        <textarea name="conditions" value={form.conditions} onChange={onChange} rows={2} className="w-full border border-gray-300 px-3 py-2 rounded-md outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Allergies</label>
        <textarea name="allergies" value={form.allergies} onChange={onChange} rows={2} className="w-full border border-gray-300 px-3 py-2 rounded-md outline-none" />
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Save</button>
      </div>
    </form>
  );
};

export default EditHealthProfileForm;