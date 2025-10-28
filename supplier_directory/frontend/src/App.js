import React, { useState, useEffect } from 'react';
import { Search, Plus, Building2, Filter } from 'lucide-react';
import { supplierAPI } from './services/api';
import SupplierCard from './components/suppliercard';
import SupplierForm from './components/supplierform';
import ContactModal from './components/contactmodel';

const App = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const categories = ['All', 'Electronics', 'Textiles', 'Metals', 'Food & Beverage', 'Packaging', 'Other'];

  useEffect(() => {
    // define inside effect to avoid missing-dependency warning
    const loadSuppliers = async () => {
      try {
        setLoading(true);
        const response = await supplierAPI.getAll(searchQuery, selectedCategory);
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error loading suppliers:', error);
        // keep user-friendly alert
        // (backend must be running at configured URL)
      } finally {
        setLoading(false);
      }
    };

    loadSuppliers();
  }, [searchQuery, selectedCategory]);

  const handleAddSupplier = async (supplierData) => {
    try {
      if (editingSupplier) {
        await supplierAPI.update(editingSupplier.id, supplierData);
      } else {
        await supplierAPI.create(supplierData);
      }
      // refresh
      const res = await supplierAPI.getAll(searchQuery, selectedCategory);
      setSuppliers(res.data);
      setShowAddModal(false);
      setEditingSupplier(null);
    } catch (error) {
      console.error('Error saving supplier:', error);
      alert('Failed to save supplier');
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await supplierAPI.delete(id);
        const res = await supplierAPI.getAll(searchQuery, selectedCategory);
        setSuppliers(res.data);
      } catch (error) {
        console.error('Error deleting supplier:', error);
        alert('Failed to delete supplier');
      }
    }
  };

  const handleContact = async (contactData) => {
    try {
      await supplierAPI.contact(selectedSupplier.id, contactData);
      alert(`Message action triggered via ${contactData.method}!`);
      setShowContactModal(false);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 size={40} />
              <div>
                <h1 className="text-3xl font-bold">Supplier Directory</h1>
                <p className="text-purple-100 text-sm">SQLite Database - No Login Required!</p>
              </div>
            </div>
            <button
              onClick={() => { setShowAddModal(true); setEditingSupplier(null); }}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-purple-50 transition shadow-lg"
            >
              <Plus size={20} />
              <span>Add Supplier</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search suppliers, products, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none appearance-none bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Found <span className="font-bold text-purple-600">{suppliers.length}</span> suppliers
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading suppliers...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map((supplier) => (
                <SupplierCard
                  key={supplier.id}
                  supplier={supplier}
                  onContact={() => { setSelectedSupplier(supplier); setShowContactModal(true); }}
                  onEdit={() => { setEditingSupplier(supplier); setShowAddModal(true); }}
                  onDelete={() => handleDeleteSupplier(supplier.id)}
                />
              ))}
            </div>

            {suppliers.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <Building2 size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-500">No suppliers found</p>
                <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
            </h2>
            <SupplierForm
              supplier={editingSupplier}
              onSubmit={handleAddSupplier}
              onCancel={() => { setShowAddModal(false); setEditingSupplier(null); }}
            />
          </div>
        </div>
      )}

      {showContactModal && selectedSupplier && (
        <ContactModal
          supplier={selectedSupplier}
          onSend={handleContact}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  );
};

export default App;
