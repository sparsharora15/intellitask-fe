interface CustomCheckboxProps {
  label: string;
  id?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange: (param: boolean) => void;
  labelClassName?: string;
}

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "../ui/label";

const CustomCheckboxWithLabel: React.FC<CustomCheckboxProps> = ({
  label,
  id = "checkbox", // Default id
  checked,
  disabled,
  onChange,
  labelClassName,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(checked) => {
          onChange(checked as boolean);
        }}
      />
      <Label
        htmlFor={id}
        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${labelClassName}`}
      >
        {label}
      </Label>
    </div>
  );
};
export default CustomCheckboxWithLabel;
