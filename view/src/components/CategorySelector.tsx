import React, { useState, useEffect } from 'react';
import { Plus, Folder, X } from 'lucide-react';
import APIService from '../service/api.service';
import { ICategory } from '../../../back/src/models/category.model';

interface ICategorySelector {
  selectedCategory: string;
  onChange: (category: ICategory) => void;
}

function CategorySelector(props: ICategorySelector) {
  const [categories, setCategories] = useState<ICategory[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await APIService.get('categories');
        setCategories(res);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <label className="text-zinc-300 mb-2 flex items-center">
        <Folder size={16} className="mr-2" />
        Category
      </label>

      <div className="flex items-center space-x-2">
        <select
          value={props.selectedCategory}
          onChange={(e) => {
            const selectedCategory = categories.find(
              (category) => category._id === e.target.value
            );
            if (selectedCategory) {
              props.onChange(selectedCategory);
            }
          }}
          className={`flex-1 px-4 py-2 rounded-lg bg-custom-base border 
            border-custom-border
            text-white focus:outline-none focus:ring-1 focus:ring-lime-100/20 focus:border-custom-border`}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default CategorySelector;
