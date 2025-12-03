import React from 'react';
import { Icon } from '@iconify/react'; // Add this import
import styles from './FormElementPicker.module.css';

const formElements = [
  { label: 'Text Field', type: 'text', placeholder: 'Enter text...' },
  { label: 'Number Field', type: 'number', placeholder: 'Enter number...' },
  { label: 'Email Field', type: 'email', placeholder: 'Enter email...' },
  { label: 'Textarea', type: 'textarea', placeholder: 'Enter long text...' },
  { label: 'Dropdown', type: 'select', placeholder: 'Select an option...' },
  { label: 'Multiple Select', type: 'multi-select', placeholder: 'Select options...' },
  { label: 'Radio Buttons', type: 'radio' },
  { label: 'Checkboxes', type: 'checkbox' },
  { label: 'Date Picker', type: 'date' },
  { label: 'Time Picker', type: 'time' },
  { label: 'Date/Time Picker', type: 'datetime-local' },
  { label: 'File Upload', type: 'file' },
  { label: 'Image Upload', type: 'image' },
  { label: 'Range Slider', type: 'range' },
  { label: 'Color Picker', type: 'color' },
  { label: 'Rating', type: 'rating' },
  { label: 'Divider', type: 'divider' },
  { label: 'Button', type: 'button' },
];

function FormElementPicker({ onPick }) {
  const getIconForType = (type) => {
    switch (type) {
      case 'text': return 'mdi:text-box-outline';
      case 'number': return 'mdi:numeric';
      case 'email': return 'mdi:email-outline';
      case 'textarea': return 'mdi:text';
      case 'select': return 'mdi:menu-down';
      case 'multi-select': return 'mdi:menu-down';
      case 'radio': return 'mdi:radiobox-marked';
      case 'checkbox': return 'mdi:checkbox-marked';
      case 'date': return 'mdi:calendar';
      case 'time': return 'mdi:clock-outline';
      case 'datetime-local': return 'mdi:calendar-clock';
      case 'file': return 'mdi:file-upload-outline';
      case 'image': return 'mdi:image-outline';
      case 'range': return 'mdi:ray-vertex';
      case 'color': return 'mdi:palette-outline';
      case 'rating': return 'mdi:star-outline';
      case 'divider': return 'mdi:minus';
      case 'button': return 'mdi:button-pointer';
      default: return 'mdi:form-textbox';
    }
  };

  return (
    <div className={styles.pickerWrapper}>
      <h3 className={styles.pickerTitle}>Add Field</h3>
      <div className={styles.elementsGrid}>
        {formElements.map((element, index) => (
          <div
            key={index}
            className={styles.formElementCard}
            onClick={() => onPick(element)}
          >
            <div className={styles.elementIcon}>
              <Icon icon={getIconForType(element.type)} />
            </div>
            <span className={styles.elementLabel}>{element.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormElementPicker;