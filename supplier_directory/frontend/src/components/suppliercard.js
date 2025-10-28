import React from 'react';
import { Mail, Phone, MapPin, Star, MessageCircle, Edit, Trash2 } from 'lucide-react';

function SupplierCard({ supplier, onContact, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-6 border-2 border-transparent hover:border-purple-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{supplier.name}</h3>
          <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {supplier.category}
          </span>
        </div>
        <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-lg">
          <Star size={16} />
          <span className="font-bold text-yellow-700">{supplier.rating ?? 4.0}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-start space-x-2 text-gray-600 text-sm">
          <MapPin size={16} />
          <span>{supplier.location}</span>
        </div>
        <div className="flex items-start space-x-2 text-gray-600 text-sm">
          <Mail size={16} />
          <span className="break-all">{supplier.email}</span>
        </div>
        <div className="flex items-start space-x-2 text-gray-600 text-sm">
          <Phone size={16} />
          <span>{supplier.phone}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-1">PRODUCTS</p>
        <p className="text-sm text-gray-700">{supplier.products}</p>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={onContact}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition flex items-center justify-center space-x-2"
        >
          <MessageCircle size={16} />
          <span>Contact</span>
        </button>
        <button
          onClick={onEdit}
          className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default SupplierCard;
