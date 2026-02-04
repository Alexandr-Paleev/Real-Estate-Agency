import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Plus, X, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  propertySchema,
  type PropertyFormData,
} from '@phuket-estate/shared/db';

interface Property {
  id: string;
  title: string;
  price: number;
  status: string;
  type: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const fetchProperties = async (): Promise<Property[]> => {
  const res = await fetch(`${API_URL}/api/properties?lang=RU`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

const updateProperty = async (data: {
  id: string;
  title: string;
  price: number;
}) => {
  const res = await fetch(`${API_URL}/api/properties/${data.id}?lang=RU`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: data.title, price: data.price }),
  });
  if (!res.ok) {
    throw new Error('Failed to update property');
  }
  return res.json();
};

export function App() {
  const queryClient = useQueryClient();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
  });

  const {
    data: properties,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
  });

  const mutation = useMutation({
    mutationFn: updateProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setIsEditing(false);
      setSelectedProperty(null);
      reset();
    },
  });

  const handleEditClick = (property: Property) => {
    setSelectedProperty(property);
    reset({
      title: property.title,
      price: property.price,
    });
    setIsEditing(true);
  };

  const onSubmit = (data: PropertyFormData) => {
    if (selectedProperty) {
      mutation.mutate({
        id: selectedProperty.id,
        title: data.title,
        price: data.price,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
            <Plus size={20} />
            Add Property
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price (THB)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties?.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {property.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Intl.NumberFormat('th-TH', {
                        style: 'currency',
                        currency: 'THB',
                        minimumFractionDigits: 0,
                      }).format(property.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(property)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end gap-1 ml-auto"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Edit Property #{selectedProperty?.id}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title (RU)
                </label>
                <input
                  type="text"
                  {...register('title')}
                  className={`w-full rounded-md border ${errors.title ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.title && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.title.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (THB)
                </label>
                <input
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                  className={`w-full rounded-md border ${errors.price ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.price && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.price.message}
                  </span>
                )}
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                >
                  {mutation.isPending ? (
                    'Saving...'
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
