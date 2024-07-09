import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RadioGroupProps {
  radioOptions: { value: string; label: string }[]; 
  defaultValue?: string; 
  onChange?: (value: string) => void;
  className?: string;
}
const CustomRadioGroup: React.FC<RadioGroupProps> = ({
  radioOptions,
  defaultValue,
  onChange,
  className,
}) => {
  return (
    <RadioGroup
      defaultValue={defaultValue}
      onValueChange={onChange}   
      className={`flex flex-row gap-2 ${className || ""}`} 
    >
      {radioOptions.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem
            value={option.value}
            id={`r-${option.value}`}
          />
          <Label htmlFor={`r-${option.value}`}>{option.label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default CustomRadioGroup;
