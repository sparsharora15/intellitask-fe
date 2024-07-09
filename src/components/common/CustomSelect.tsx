import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import CreatableSelect from "react-select/creatable";

const animatedComponents = makeAnimated();

interface CustomSelectProps {
  options: { value: string; label: string }[];
  isMulti?: boolean;
  closeMenuOnSelect?: boolean;
  isClearable?: boolean;
  isCreateable?: boolean;
  className?: string;
  borderColor?: string;
  onChange?: (value: any) => void;
  onBlur?: () => void;
  value?: any;
  ref?: React.ForwardedRef<any>;
  placeholder?: string;
  disable?: boolean;
  defaultValue?: any;

}

const CustomSelect: React.FC<CustomSelectProps> = ({
  closeMenuOnSelect = true,
  isMulti = false,
  options,
  className,
  isClearable = false,
  isCreateable = false,
  borderColor = "white",
  onChange,
  onBlur,
  value,
  ref,
  disable = false,
  defaultValue,
  placeholder,
}) => {
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: "48px",
      borderColor: borderColor,
    }),
  };

  return (
    <>
      {!isCreateable ? (
        <Select
          closeMenuOnSelect={closeMenuOnSelect}
          className={`${className}`}
          components={animatedComponents}
          isMulti={isMulti}
          options={options}
          styles={customStyles}
          isClearable={isClearable}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          defaultValue={defaultValue}
          ref={ref}
          isDisabled = {disable}
          placeholder={placeholder}
          />
        ) : (
          <CreatableSelect
          defaultValue={defaultValue}
          closeMenuOnSelect={closeMenuOnSelect}
          isDisabled = {disable}
          className={`${className}`}
          components={animatedComponents}
          isMulti={isMulti}
          options={options}
          styles={customStyles}
          isClearable={isClearable}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          ref={ref}
          placeholder={placeholder}
        />
      )}
    </>
  );
};

export default CustomSelect;
