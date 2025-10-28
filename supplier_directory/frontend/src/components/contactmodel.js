import React, { useState } from 'react';

function ContactModal({ supplier, onSend, onClose }) {
  const [method, setMethod] = useState('email');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // send method + message
    onSend({ method, message });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Contact {supplier.name}</h2>

        <label className="block text-sm font-semibold text-gray-700 mb-2">Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        >
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
        </select>

        <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded p-2 mb-4"
          placeholder="Write a short message..."
        />

        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
          <button onClick={handleSend} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Send</button>
        </div>
      </div>
    </div>
  );
}

export default ContactModal;
