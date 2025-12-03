import React, { useState, useEffect } from 'react';
import styles from './CustomFormBuilder.module.css';
import FormElementPicker from '../../components/FormElementPicker/FormElementPicker';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import DashboardLayout from '../../layouts/DashboardLayout';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Icon } from '@iconify/react';
import Select from 'react-select';

function CustomFormBuilder() {
  const [formElements, setFormElements] = useState([]);
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [formDescription, setFormDescription] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Dynamic validation on field change
  useEffect(() => {
    const errors = {};
    formElements.forEach(element => {
      if ((element.type === 'number' || element.type === 'range') && element.value) {
        const numValue = Number(element.value);
        if (element.validation.min && numValue < Number(element.validation.min)) {
          errors[element.id] = `Minimum value is ${element.validation.min}`;
        }
        if (element.validation.max && numValue > Number(element.validation.max)) {
          errors[element.id] = `Maximum value is ${element.validation.max}`;
        }
      } else if (element.type === 'date' && element.value) {
        if (element.validation.min && new Date(element.value) < new Date(element.validation.min)) {
          errors[element.id] = `Date must be after ${element.validation.min}`;
        }
        if (element.validation.max && new Date(element.value) > new Date(element.validation.max)) {
          errors[element.id] = `Date must be before ${element.validation.max}`;
        }
      }
    });
    setFormErrors(errors);
  }, [formElements]);

  const handlePick = (element) => {
    const newElement = {
      ...element,
      id: `element-${Date.now()}`,
      label: element.label,
      placeholder: element.placeholder || '',
      required: false,
      width: '100%',
      value: element.type === 'checkbox' || element.type === 'multi-select' ? [] : '',
      options: ['select', 'radio', 'checkbox', 'multi-select'].includes(element.type)
        ? [{ id: `option-${Date.now()}`, value: 'Option 1', label: 'Option 1' }]
        : [],
      validation: {
        min: '',
        max: '',
        message: ''
      },
      // Button specific properties
      alignment: element.type === 'button' ? 'start' : null,
      buttonType: element.type === 'button' ? 'button' : null,
      buttonColor: element.type === 'button' ? '#1976d2' : null,
      hoverEffect: element.type === 'button' ? 'darken' : null,
      hoverColor: element.type === 'button' ? '#1565c0' : null,
      textColor: element.type === 'button' ? '#ffffff' : null
    };
    setFormElements((prev) => [...prev, newElement]);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(formElements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFormElements(items);
  };

  const handleDelete = (id) => {
    setFormElements((prev) => prev.filter((el) => el.id !== id));
  };

  const handleChange = (id, value) => {
    setFormElements(prev => 
      prev.map(el => 
        el.id === id ? { ...el, value } : el
      )
    );
  };

  const handleLabelChange = (id, value) => {
    setFormElements(prev =>
      prev.map(el => (el.id === id ? { ...el, label: value } : el))
    );
  };

  const handlePlaceholderChange = (id, value) => {
    setFormElements(prev =>
      prev.map(el => (el.id === id ? { ...el, placeholder: value } : el))
    );
  };

  const handleWidthChange = (id, value) => {
    setFormElements(prev =>
      prev.map(el => (el.id === id ? { ...el, width: value } : el))
    );
  };

  const handleRequiredChange = (id, value) => {
    setFormElements(prev =>
      prev.map(el => (el.id === id ? { ...el, required: value } : el))
    );
  };

  const handleOptionChange = (id, optionId, value) => {
    setFormElements(prev =>
      prev.map(el => {
        if (el.id === id) {
          const options = el.options.map(opt => 
            opt.id === optionId ? { ...opt, value, label: value } : opt
          );
          return { ...el, options };
        }
        return el;
      })
    );
  };

  const handleAlignmentChange = (id, value) => {
    setFormElements(prev =>
      prev.map(el => (el.id === id ? { ...el, alignment: value } : el))
    );
  };

  const handleButtonTypeChange = (id, value) => {
    setFormElements(prev =>
      prev.map(el => (el.id === id ? { ...el, buttonType: value } : el))
    );
  };

  const handleButtonColorChange = (id, value) => {
    setFormElements(prev =>
      prev.map(el => (el.id === id ? { ...el, buttonColor: value } : el))
    );
  };

  const handleHoverEffectChange = (id, value) => {
    setFormElements(prev =>
      prev.map(el => (el.id === id ? { ...el, hoverEffect: value } : el))
    );
  };

  const handleHoverColorChange = (id, value) => {
    setFormElements(prev =>
      prev.map(el => (el.id === id ? { ...el, hoverColor: value } : el))
    );
  };

  const handleTextColorChange = (id, value) => {
    setFormElements(prev =>
      prev.map(el => (el.id === id ? { ...el, textColor: value } : el))
    );
  };

  const addOption = (id) => {
    setFormElements(prev =>
      prev.map(el => {
        if (el.id === id) {
          return { 
            ...el, 
            options: [...el.options, { 
              id: `option-${Date.now()}`, 
              value: `Option ${el.options.length + 1}`,
              label: `Option ${el.options.length + 1}`
            }] 
          };
        }
        return el;
      })
    );
  };

  const deleteOption = (id, optionId) => {
    setFormElements(prev =>
      prev.map(el => {
        if (el.id === id) {
          const options = el.options.filter(opt => opt.id !== optionId);
          return { ...el, options };
        }
        return el;
      })
    );
  };

  const handleValidationChange = (id, field, value) => {
    setFormElements(prev =>
      prev.map(el => {
        if (el.id === id) {
          return { 
            ...el, 
            validation: {
              ...el.validation,
              [field]: value
            }
          };
        }
        return el;
      })
    );
  };

  const validateForm = (isPreviewSubmit = false) => {
    const errors = {};
    let isValid = true;

    formElements.forEach(element => {
      if (isPreviewSubmit && element.required && !element.value && element.value !== 0 && element.type !== 'checkbox') {
        errors[element.id] = 'This field is required';
        isValid = false;
      } else if (isPreviewSubmit && element.required && element.type === 'checkbox' && (!element.value || element.value.length === 0)) {
        errors[element.id] = 'At least one option must be selected';
        isValid = false;
      } else if ((element.type === 'number' || element.type === 'range') && element.value) {
        const numValue = Number(element.value);
        if (element.validation.min && numValue < Number(element.validation.min)) {
          errors[element.id] = `Minimum value is ${element.validation.min}`;
          isValid = false;
        }
        if (element.validation.max && numValue > Number(element.validation.max)) {
          errors[element.id] = `Maximum value is ${element.validation.max}`;
          isValid = false;
        }
      } else if (element.type === 'date' && element.value) {
        if (element.validation.min && new Date(element.value) < new Date(element.validation.min)) {
          errors[element.id] = `Date must be after ${element.validation.min}`;
          isValid = false;
        }
        if (element.validation.max && new Date(element.value) > new Date(element.validation.max)) {
          errors[element.id] = `Date must be before ${element.validation.max}`;
          isValid = false;
        }
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSaveAsDraft = () => {
    const errors = {};
    let hasValidationErrors = false;

    formElements.forEach(element => {
      if ((element.type === 'number' || element.type === 'range') && element.value) {
        const numValue = Number(element.value);
        if (element.validation.min && numValue < Number(element.validation.min)) {
          errors[element.id] = `Minimum value is ${element.validation.min}`;
          hasValidationErrors = true;
        }
        if (element.validation.max && numValue > Number(element.validation.max)) {
          errors[element.id] = `Maximum value is ${element.validation.max}`;
          hasValidationErrors = true;
        }
      } else if (element.type === 'date' && element.value) {
        if (element.validation.min && new Date(element.value) < new Date(element.validation.min)) {
          errors[element.id] = `Date must be after ${element.validation.min}`;
          hasValidationErrors = true;
        }
        if (element.validation.max && new Date(element.value) > new Date(element.validation.max)) {
          errors[element.id] = `Date must be before ${element.validation.max}`;
          hasValidationErrors = true;
        }
      }
    });

    setFormErrors(errors);
    
    if (!hasValidationErrors) {
      console.log('Form saved as draft:', { formTitle, formDescription, formElements });
      alert('Form saved as draft successfully!');
    } else {
      alert('Please fix validation errors before saving as draft.');
    }
  };

  const handlePublishForm = () => {
    if (validateForm(false)) {
      console.log('Form published:', { formTitle, formDescription, formElements });
      alert('Form published successfully!');
    } else {
      alert('Please fix validation errors before publishing.');
    }
  };

  const renderField = (element, isPreview = false) => {
    const commonProps = {
      placeholder: element.placeholder,
      required: element.required,
      disabled: !isPreviewMode && !isPreview,
      className: styles.formField,
      value: element.value || '',
      onChange: (e) => handleChange(element.id, e.target.value)
    };

    switch (element.type) {
      case 'textarea':
        return <textarea {...commonProps} rows={4} />;
      case 'select':
        return (
          <Select
            options={element.options}
            className={styles.reactSelect}
            classNamePrefix="select"
            isDisabled={!isPreviewMode && !isPreview}
            placeholder={element.placeholder}
            value={element.options.find(opt => opt.value === element.value)}
            onChange={(selected) => handleChange(element.id, selected?.value || '')}
          />
        );
      case 'multi-select':
        return (
          <Select
            isMulti
            options={element.options}
            className={styles.reactSelect}
            classNamePrefix="select"
            isDisabled={!isPreviewMode && !isPreview}
            placeholder={element.placeholder}
            value={element.options.filter(opt => 
              Array.isArray(element.value) ? 
              element.value.includes(opt.value) : 
              opt.value === element.value
            )}
            onChange={(selected) => 
              handleChange(element.id, selected ? selected.map(opt => opt.value) : [])
            }
          />
        );
      case 'radio':
        return (
          <div className={styles.radioGroup}>
            {element.options.map((opt) => (
              <label key={opt.id} className={styles.radioOption}>
                <input
                  type="radio"
                  name={`radio-${element.id}`}
                  value={opt.value}
                  checked={element.value === opt.value}
                  onChange={() => handleChange(element.id, opt.value)}
                  disabled={!isPreviewMode && !isPreview}
                />
                <span>{opt.value}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className={styles.checkboxGroup}>
            {element.options.map((opt) => (
              <label key={opt.id} className={styles.checkboxOption}>
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={Array.isArray(element.value) ? 
                    element.value.includes(opt.value) : 
                    element.value === opt.value}
                  onChange={(e) => {
                    const newValue = Array.isArray(element.value) ?
                      e.target.checked ?
                        [...element.value, opt.value] :
                        element.value.filter(v => v !== opt.value) :
                      e.target.checked ? [opt.value] : [];
                    handleChange(element.id, newValue);
                  }}
                  disabled={!isPreviewMode && !isPreview}
                />
                <span>{opt.value}</span>
              </label>
            ))}
          </div>
        );
      case 'divider':
        return <div className={styles.divider}></div>;
      case 'button':
        const buttonStyle = {
          backgroundColor: element.buttonColor,
          color: element.textColor,
          border: 'none',
          borderRadius: '6px',
          padding: '0.75rem 1.5rem',
          fontSize: '0.95rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s',
          width: 'auto',
        };

        return (
          <div className={`${styles.buttonContainer} ${styles[`align-${element.alignment}`]}`}>
            <button 
              type={element.buttonType}
              style={buttonStyle}
              className={`
                ${styles.formButton} 
                ${styles[element.buttonType]}
                ${element.hoverEffect === 'darken' ? styles.hoverDarken : ''}
                ${element.hoverEffect === 'lighten' ? styles.hoverLighten : ''}
                ${element.hoverEffect === 'color-change' ? styles.hoverColorChange : ''}
              `}
              disabled={!isPreviewMode && !isPreview}
              data-hover-color={element.hoverColor}
            >
              {element.label}
            </button>
          </div>
        );
      case 'date':
        return (
          <input 
            type="date" 
            {...commonProps} 
            min={element.validation.min}
            max={element.validation.max}
          />
        );
      case 'time':
        return <input type="time" {...commonProps} />;
      case 'datetime-local':
        return <input type="datetime-local" {...commonProps} />;
      case 'file':
        return <input type="file" {...commonProps} />;
      case 'image':
        return <input type="file" accept="image/*" {...commonProps} />;
      case 'range':
        return (
          <div className={styles.rangeContainer}>
            <input
              type="range"
              min={element.validation.min || 0}
              max={element.validation.max || 100}
              {...commonProps}
            />
            <div className={styles.rangeValues}>
              <span>{element.validation.min || 0}</span>
              <span>{element.value || (element.validation.min || 0)}</span>
              <span>{element.validation.max || 100}</span>
            </div>
          </div>
        );
      case 'color':
        return <input type="color" {...commonProps} />;
      case 'rating':
        return (
          <div className={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star} 
                className={`${styles.star} ${element.value >= star ? styles.starSelected : ''}`}
                onClick={() => !isPreviewMode && !isPreview && handleChange(element.id, star)}
              >
                &#9733;
              </span>
            ))}
          </div>
        );
      default:
        return <input type={element.type} {...commonProps} />;
    }
  };

  const renderFieldSettings = (element) => {
    if (isPreviewMode) return null;
    
    return (
      <div className={styles.fieldSettings}>
        <div className={styles.settingRow}>
          <label>Label:</label>
          <input
            type="text"
            value={element.label}
            onChange={(e) => handleLabelChange(element.id, e.target.value)}
          />
        </div>

        {element.type !== 'divider' && element.type !== 'button' && (
          <>
            <div className={styles.settingRow}>
              <label>Placeholder:</label>
              <input
                type="text"
                value={element.placeholder}
                onChange={(e) => handlePlaceholderChange(element.id, e.target.value)}
              />
            </div>

            <div className={styles.settingRow}>
              <label>Required:</label>
              <input
                type="checkbox"
                checked={element.required}
                onChange={(e) => handleRequiredChange(element.id, e.target.checked)}
              />
            </div>
          </>
        )}

        {element.type !== 'divider' && (
          <div className={styles.settingRow}>
            <label>Width:</label>
            <select
              value={element.width}
              onChange={(e) => handleWidthChange(element.id, e.target.value)}
            >
              <option value="100%">Full width</option>
              <option value="75%">75% width</option>
              <option value="50%">50% width</option>
              <option value="33%">33% width</option>
            </select>
          </div>
        )}

        {element.type === 'button' && (
          <>
            <div className={styles.settingRow}>
              <label>Alignment:</label>
              <select
                value={element.alignment}
                onChange={(e) => handleAlignmentChange(element.id, e.target.value)}
              >
                <option value="start">Left</option>
                <option value="center">Center</option>
                <option value="end">Right</option>
              </select>
            </div>
            <div className={styles.settingRow}>
              <label>Button Type:</label>
              <select
                value={element.buttonType}
                onChange={(e) => handleButtonTypeChange(element.id, e.target.value)}
              >
                <option value="button">Button</option>
                <option value="submit">Submit</option>
                <option value="reset">Reset</option>
              </select>
            </div>
            <div className={styles.settingRow}>
              <label>Button Color:</label>
              <input
                type="color"
                value={element.buttonColor}
                onChange={(e) => handleButtonColorChange(element.id, e.target.value)}
              />
            </div>
            <div className={styles.settingRow}>
              <label>Text Color:</label>
              <input
                type="color"
                value={element.textColor}
                onChange={(e) => handleTextColorChange(element.id, e.target.value)}
              />
            </div>
            <div className={styles.settingRow}>
              <label>Hover Effect:</label>
              <select
                value={element.hoverEffect}
                onChange={(e) => handleHoverEffectChange(element.id, e.target.value)}
              >
                <option value="darken">Darken</option>
                <option value="lighten">Lighten</option>
                <option value="color-change">Color Change</option>
                <option value="none">None</option>
              </select>
            </div>
            {element.hoverEffect === 'color-change' && (
              <div className={styles.settingRow}>
                <label>Hover Color:</label>
                <input
                  type="color"
                  value={element.hoverColor}
                  onChange={(e) => handleHoverColorChange(element.id, e.target.value)}
                />
              </div>
            )}
          </>
        )}

        {['number', 'range', 'date'].includes(element.type) && (
          <>
            <div className={styles.settingRow}>
              <label>Min value:</label>
              <input
                type={element.type === 'date' ? 'date' : 'number'}
                value={element.validation.min}
                onChange={(e) => handleValidationChange(element.id, 'min', e.target.value)}
              />
            </div>
            <div className={styles.settingRow}>
              <label>Max value:</label>
              <input
                type={element.type === 'date' ? 'date' : 'number'}
                value={element.validation.max}
                onChange={(e) => handleValidationChange(element.id, 'max', e.target.value)}
              />
            </div>
          </>
        )}
      </div>
    );
  };

  const renderFormPreview = () => {
    return (
      <div className={styles.previewContainer}>
        <h2 className={styles.previewTitle}>{formTitle}</h2>
        {formDescription && <p className={styles.previewDescription}>{formDescription}</p>}
        
        <form 
          className={styles.previewForm}
          onSubmit={(e) => {
            e.preventDefault();
            if (validateForm(true)) {
              console.log('Form submitted:', { formTitle, formDescription, formElements });
              alert('Form submitted successfully!');
            }
          }}
        >
          <div className={styles.previewGrid}>
            {formElements.map((element) => (
              <div 
                key={element.id} 
                className={`${styles.previewField} ${
                  element.width === '100%' ? styles.fullWidth : 
                  element.width === '75%' ? styles.threeQuartersWidth :
                  element.width === '50%' ? styles.halfWidth :
                  styles.thirdWidth
                }`}
              >
                {element.type !== 'divider' && (
                  <label className={styles.previewLabel}>
                    {element.label}
                    {element.required && <span className={styles.requiredIndicator}>*</span>}
                  </label>
                )}
                {renderField(element, true)}
                {formErrors[element.id] && (
                  <div className={styles.errorMessage}>{formErrors[element.id]}</div>
                )}
              </div>
            ))}
          </div>
          <div className={styles.formActions}>
            <Button
              label="Back to Editor"
              secondary
              onClick={() => setIsPreviewMode(false)}
              type="button"
              icon="mdi:pencil-outline"
            />
            <Button
              label="Save as Draft"
              onClick={handleSaveAsDraft}
              type="button"
              icon="mdi:content-save-outline"
            />
            <Button
              label="Publish Form"
              type="button"
              icon="mdi:send"
              onClick={handlePublishForm}
            />
          </div>
        </form>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className={styles.customFormBuilderWrapper}>
        <Card title="Form Builder" icon="fluent:form-new-28-filled">
          {isPreviewMode ? (
            renderFormPreview()
          ) : (
            <>
              <div className={styles.formHeader}>
                <input
                  type="text"
                  className={styles.formTitleInput}
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Form title"
                />
                <textarea
                  className={styles.formDescriptionInput}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Form description"
                  rows={2}
                />
              </div>

              <FormElementPicker onPick={handlePick} />

              <div className={styles.formPreview}>
                {formElements.length === 0 ? (
                  <p className={styles.emptyMessage}>
                    Click on a field type above to add it to your form
                  </p>
                ) : (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="form-elements">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          <div className={styles.formGrid}>
                            {formElements.map((element, index) => (
                              <Draggable
                                key={element.id}
                                draggableId={element.id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    className={`${styles.formItem} ${
                                      element.type === 'divider' ? styles.dividerItem : ''
                                    } ${
                                      element.width === '100%' ? styles.fullWidth : 
                                      element.width === '75%' ? styles.threeQuartersWidth :
                                      element.width === '50%' ? styles.halfWidth :
                                      styles.thirdWidth
                                    }`}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    style={{
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <div className={styles.formItemHeader}>
                                      <div className={styles.dragHandle} {...provided.dragHandleProps}>
                                        <Icon icon="mdi:drag" />
                                      </div>
                                      <span className={styles.elementTypeBadge}>
                                        {element.label}
                                      </span>
                                      <Icon
                                        icon="mdi:close"
                                        className={styles.deleteIcon}
                                        onClick={() => handleDelete(element.id)}
                                      />
                                    </div>

                                    <div className={styles.formFieldContainer}>
                                      {element.type !== 'divider' && (
                                        <label className={styles.fieldLabel}>
                                          {element.label}
                                          {element.required && <span className={styles.requiredIndicator}>*</span>}
                                        </label>
                                      )}
                                      {renderField(element)}
                                      {formErrors[element.id] && (
                                        <div className={styles.errorMessage}>{formErrors[element.id]}</div>
                                      )}
                                    </div>

                                    {renderFieldSettings(element)}

                                    {['select', 'checkbox', 'radio', 'multi-select'].includes(
                                      element.type
                                    ) && (
                                      <div className={styles.optionsEditor}>
                                        <h4>Options:</h4>
                                        {element.options.map((opt) => (
                                          <div key={opt.id} className={styles.optionRow}>
                                            <input
                                              type="text"
                                              value={opt.value}
                                              onChange={(e) =>
                                                handleOptionChange(element.id, opt.id, e.target.value)
                                              }
                                            />
                                            <Icon
                                              icon="mdi:close"
                                              className={styles.optionDeleteIcon}
                                              onClick={() => deleteOption(element.id, opt.id)}
                                            />
                                          </div>
                                        ))}
                                        <Button
                                          label="Add Option"
                                          onClick={() => addOption(element.id)}
                                          size="small"
                                          icon="mdi:plus"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </div>

              <div className={styles.formActions}>
                <Button
                  label="Preview Form"
                  secondary
                  onClick={() => setIsPreviewMode(true)}
                  type="button"
                  icon="mdi:eye-outline"
                />
                <Button
                  label="Save as Draft"
                  onClick={handleSaveAsDraft}
                  type="button"
                  icon="mdi:content-save-outline"
                />
                <Button
                  label="Publish Form"
                  type="button"
                  icon="mdi:send"
                  onClick={handlePublishForm}
                />
              </div>
            </>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default CustomFormBuilder;