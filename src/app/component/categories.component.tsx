import React, { useCallback, useState } from "react";

import { Select } from "antd";

const Categories: React.FC<{
  categories: string[];
  disabled?: boolean;
  placeholder?: string;
  onSearch?: (e: any) => void;
}> = ({ categories, ...props }) => {
  const [options, setOptions] = useState(
    categories.map((label) => ({
      label,
      value: label,
    }))
  );

  const onSearch = useCallback(
    (text: string) => {
      setOptions([
        ...categories.map((label) => ({
          label,
          value: label,
        })),
        ...(text ? [{ label: text, value: text }] : []),
      ]);

      return props.onSearch && props.onSearch(text);
    },
    [categories, props]
  );

  return (
    <Select {...props} mode="multiple" options={options} onSearch={onSearch} />
  );
};

export default Categories;
