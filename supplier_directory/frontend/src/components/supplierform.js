import React, { useState, useEffect } from 'react';

function SupplierForm({ supplier, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(supplier || {
    name: '',
    category: 'Electronics',
    email: '',
    phone: '',
    whatsapp: '',
    location: '',
    rating: 4.0,
    products: '',
    notes: ''
  });

  // if editing supplier changed after open, update form
  useEffect(() => {
    if (supplier) setFormData(supplier);
    else setFormData({
      name: '',
      category: 'Electronics',
      email: '',
      phone: '',
      whatsapp: '',
      location: '',
      rating: 4.0,
      products: '',
      notes: ''
    });
  }, [supplier]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none"
          >
            <option>Electronics</option>
            <option>Textiles</option>
            <option>Metals</option>
            <option>Food & Beverage</option>
            <option>Packaging</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
          <input
            type="text"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp</label>
        <input
          type="text"
          value={formData.whatsapp}
          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
        <input
          type="text"
          required
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Products *</label>
        <textarea
          required
          value={formData.products}
          onChange={(e) => setFormData({ ...formData, products: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default SupplierForm;
