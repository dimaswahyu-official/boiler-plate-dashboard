// import React from "react";
// import ReactSelect, { SingleValue } from "react-select";

// interface Option {
//   value: string;
//   label: string;
// }

// interface SelectProps {
//   options: Option[];
//   placeholder?: string;
//   onChange: (value: string) => void;
//   className?: string;
//   defaultValue?: string;
// }

// const Select: React.FC<SelectProps> = ({
//   options,
//   placeholder = "Select an option",
//   onChange,
//   className = "",
//   defaultValue = "",
// }) => {
//   // Find the default option based on the defaultValue
//   const defaultOption = options.find((option) => option.value === defaultValue);

//   const handleChange = (selectedOption: SingleValue<Option>) => {
//     onChange(selectedOption?.value || ""); // Trigger parent handler
//   };

//   return (
//     <ReactSelect
//       className={className}
//       options={options}
//       placeholder={placeholder}
//       defaultValue={defaultOption}
//       onChange={handleChange}
//       classNamePrefix="react-select"
//       styles={{
//         control: (base) => ({
//           ...base,
//           borderRadius: "0.5rem",
//           borderColor: "#d1d5db",
//           boxShadow: "none",
//           "&:hover": { borderColor: "#a1a1aa" },
//           width: "200px", // Set static width for the control
//         }),
//         placeholder: (base) => ({
//           ...base,
//           color: "#9ca3af",
//         }),
//         menu: (base) => ({
//           ...base,
//           width: "200px", // Set static width for the dropdown menu
//         }),
//         singleValue: (base) => ({
//           ...base,
//           width: "200px", // Ensure the selected value area has a static width
//           overflow: "hidden",
//           textOverflow: "ellipsis",
//           whiteSpace: "nowrap",
//         }),
//       }}
//     />
//   );
// };

// export default Select;

import React from "react";
import ReactSelect, { SingleValue } from "react-select";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  value?: string; // Tambahkan properti value untuk kontrol eksplisit
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  value,
}) => {
  const selectedOption = options.find((option) => option.value === value);

  const handleChange = (selectedOption: SingleValue<Option>) => {
    onChange(selectedOption?.value || ""); // Trigger parent handler
  };

  return (
    <ReactSelect
      className={className}
      options={options}
      placeholder={placeholder}
      value={selectedOption || null} // Gunakan value untuk kontrol eksplisit
      onChange={handleChange}
      classNamePrefix="react-select"
      styles={{
        control: (base) => ({
          ...base,
          borderRadius: "0.5rem",
          borderColor: "#d1d5db",
          boxShadow: "none",
          "&:hover": { borderColor: "#a1a1aa" },
          width: "200px",
        }),
        placeholder: (base) => ({
          ...base,
          color: "#9ca3af",
        }),
        menu: (base) => ({
          ...base,
          width: "200px",
        }),
        singleValue: (base) => ({
          ...base,
          width: "200px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }),
      }}
    />
  );
};

export default Select;
