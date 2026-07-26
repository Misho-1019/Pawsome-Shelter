import PhoneInputBase from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function PhoneInput({ value, onChange, placeholder = 'Enter phone number', className = '' }: PhoneInputProps) {
  return (
    <div className={`phone-input-wrapper ${className}`}>
      <PhoneInputBase
        international
        defaultCountry="US"
        value={value || undefined}
        onChange={(val) => onChange(val || '')}
        placeholder={placeholder}
      />
    </div>
  )
}
