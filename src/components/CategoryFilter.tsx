import React, { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({
  categories = [
    "All",
    "Business",
    "Entertainment",
    "General",
    "Health",
    "Science",
    "Sports",
    "Technology",
  ],
  activeCategory = "All",
  onCategoryChange = () => {},
}: CategoryFilterProps) => {
  const [selected, setSelected] = useState(activeCategory);

  const handleCategoryClick = (category: string) => {
    setSelected(category);
    onCategoryChange(category);
  };

  return (
    <div className="w-full bg-background border-b py-2">
      <ScrollArea className="w-full">
        <div className="flex space-x-2 px-4 py-1">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selected === category ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoryFilter;
