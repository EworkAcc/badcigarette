"use client";

import React, { useState } from 'react';
import generateUniqueId from '../lib/uniqueID';

const AddCigaretteForm: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim()) {
      setMessage('Name and description are required');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch('/api/addSubCig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          id: generateUniqueId(),
          posts: [],
          description: description.trim(),
          rating: 0
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Cigarette added successfully!');
        setMessageType('success');
        setName('');
        setDescription('');
      } else {
        setMessage(data.message || 'Failed to add cigarette');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error adding cigarette:', error);
      setMessage('Network error. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-red-400">Add New Cigarette</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Cigarette Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter cigarette name..."
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter cigarette description..."
            rows={4}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-vertical"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          {isLoading ? 'Adding...' : 'Add Cigarette'}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded-md text-sm ${
            messageType === 'success'
              ? 'bg-green-900 border border-green-700 text-green-300'
              : 'bg-red-900 border border-red-700 text-red-300'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default AddCigaretteForm;