import Select from 'react-select';

export interface OptionType {
  value: string;
  label: string;
}

interface Props {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: OptionType[];
  isDisabled?: boolean;
  isLoading?: boolean;
}

const SelectInput: React.FC<Props> = ({ name, value, onChange, options, isDisabled, isLoading }) => {
  const selectedOption = options.find(opt => opt.value === value) || null;

  const handleChange = (option: any) => {
    const fakeEvent = {
      target: {
        name,
        value: option?.value || '',
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(fakeEvent);
  };

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={handleChange}
      isDisabled={isDisabled}
      isLoading={isLoading}
      className='form-select'
      classNamePrefix="form-select"
      menuPortalTarget={document.body}       // render dropdown ke body
      menuPosition="fixed"                    // posisi fixed supaya tidak tertutup
      styles={{
        menuPortal: base => ({ ...base, zIndex: 9999 }), // pastikan z-index di atas modal
      }}
    />
  );
};

export default SelectInput;