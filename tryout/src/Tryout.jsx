// src/components/MembershipForm.jsx

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  FaRunning,
  FaCheckCircle,
  FaHome,
  FaCity,
  FaFlag,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaExclamationCircle,
  FaChevronDown,
  FaPen,
  FaEraser,
  FaDownload, // Icon for Download Button
  FaInfoCircle,
  FaClock,
} from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage, useField } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';
import SignatureCanvas from 'react-signature-canvas';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import classNames from 'classnames';
import InputMask from 'react-input-mask';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

/*********************************
 * 1) initialFormValues (Global)
 *********************************/
const initialFormValues = {
    // Single Student Information
    student: {
      studentFirstName: '',
      studentMiddleName: '',
      studentLastName: '',
      gender: '',
      studentPhone: '',
      studentEmail: '',
      dob: '',
      homeAddress: '',
      homeCity: '',
      homeState: '',
      homeZip: '',
      parentFirstName: '',
      parentLastName: '',
      parentEmail: '',
      parentPhone: '',
      relationshipToStudent: '',
      parentAddress: '',
      parentCity: '',
      parentState: '',
      parentZip: '',
      signedWaiver: '',
      waiverConfirmed: false,
    },
    tryoutType: '',
    groupType: '',
    activityType: '',
    selectedTrial: '',
    customDate: '',
    customTime: '',
  };
  
  /*******************************
   * 2) Helper Functions
   *******************************/
  const formatToE164 = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.startsWith('1')) {
      return `+${digits}`;
    }
    return `+1${digits}`;
  };
  
  const calculateAge = (dob) => {
    if (!dob) return '';
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    return age;
  };

/********************************************
 * 3) Reusable Formik Input Components
 ********************************************/
// List of US States for Select
const usStates = [
  { value: 'AL', label: 'AL' },
  { value: 'AK', label: 'AK' },
  { value: 'AZ', label: 'AZ' },
  { value: 'AR', label: 'AR' },
  { value: 'CA', label: 'CA' },
  { value: 'CO', label: 'CO' },
  { value: 'CT', label: 'CT' },
  { value: 'DE', label: 'DE' },
  { value: 'FL', label: 'FL' },
  { value: 'GA', label: 'GA' },
  { value: 'HI', label: 'HI' },
  { value: 'ID', label: 'ID' },
  { value: 'IL', label: 'IL' },
  { value: 'IN', label: 'IN' },
  { value: 'IA', label: 'IA' },
  { value: 'KS', label: 'KS' },
  { value: 'KY', label: 'KY' },
  { value: 'LA', label: 'LA' },
  { value: 'ME', label: 'ME' },
  { value: 'MD', label: 'MD' },
  { value: 'MA', label: 'MA' },
  { value: 'MI', label: 'MI' },
  { value: 'MN', label: 'MN' },
  { value: 'MS', label: 'MS' },
  { value: 'MO', label: 'MO' },
  { value: 'MT', label: 'MT' },
  { value: 'NE', label: 'NE' },
  { value: 'NV', label: 'NV' },
  { value: 'NH', label: 'NH' },
  { value: 'NJ', label: 'NJ' },
  { value: 'NM', label: 'NM' },
  { value: 'NY', label: 'NY' },
  { value: 'NC', label: 'NC' },
  { value: 'ND', label: 'ND' },
  { value: 'OH', label: 'OH' },
  { value: 'OK', label: 'OK' },
  { value: 'OR', label: 'OR' },
  { value: 'PA', label: 'PA' },
  { value: 'RI', label: 'RI' },
  { value: 'SC', label: 'SC' },
  { value: 'SD', label: 'SD' },
  { value: 'TN', label: 'TN' },
  { value: 'TX', label: 'TX' },
  { value: 'UT', label: 'UT' },
  { value: 'VT', label: 'VT' },
  { value: 'VA', label: 'VA' },
  { value: 'WA', label: 'WA' },
  { value: 'WV', label: 'WV' },
  { value: 'WI', label: 'WI' },
  { value: 'WY', label: 'WY' },
];

// Custom SelectInput with search capability
const SelectInput = React.memo(({ label, name, options, icon: Icon, isSearchable = false }) => {
  const [field, meta, helpers] = useField(name);
  const { setValue } = helpers;

  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="text-sm sm:text-base font-medium mb-1 text-gray-200 flex items-center"
      >
        {Icon && <Icon className="mr-2 text-indigo-400 text-lg sm:text-xl" />}
        {label}
      </label>
      <div className="relative">
        <Select
          id={name}
          name={name}
          options={options}
          isSearchable={isSearchable}
          onChange={(selectedOption) => setValue(selectedOption ? selectedOption.value : '')}
          value={options ? options.find((option) => option.value === field.value) : ''}
          classNamePrefix="select"
          className={classNames('react-select-container', {
            'border-red-500': meta.touched && meta.error,
          })}
          aria-describedby={meta.touched && meta.error ? `${name}-error` : undefined}
        />
        <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
      {meta.touched && meta.error ? (
        <motion.div
          id={`${name}-error`}
          className="text-red-500 text-xs sm:text-sm mt-1 flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FaExclamationCircle className="mr-1" />
          {meta.error}
        </motion.div>
      ) : null}
    </div>
  );
});

// Reusable RadioGroup Component
const RadioGroup = React.memo(({ label, name, options, icon: Icon }) => {
  const [field, meta] = useField({ name, type: 'radio' });

  return (
    <div className="flex flex-col">
      <fieldset>
        <legend className="text-sm sm:text-base font-medium mb-1 text-gray-200 flex items-center">
          {Icon && <Icon className="mr-2 text-indigo-400 text-lg sm:text-xl" />}
          {label}
        </legend>
        <div role="group" aria-labelledby={`${name}-label`} className="flex flex-wrap space-x-4">
          {options.map((option) => (
            <label key={option.value} className="flex items-center text-gray-200">
              <Field
                type="radio"
                name={name}
                value={option.value}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {meta.touched && meta.error ? (
        <motion.div
          id={`${name}-error`}
          className="text-red-500 text-xs sm:text-sm mt-1 flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FaExclamationCircle className="mr-1" />
          {meta.error}
        </motion.div>
      ) : null}
    </div>
  );
});

// Reusable TextInput Component
const TextInput = React.memo(({ label, icon: Icon, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="flex flex-col">
      <label
        htmlFor={props.id || props.name}
        className="text-sm sm:text-base font-medium mb-1 text-gray-200 flex items-center"
      >
        {Icon && <Icon className="mr-2 text-indigo-400 text-lg sm:text-xl" />}
        {label}
      </label>
      <div className="relative">
        <input
          {...field}
          {...props}
          className={classNames(
            'border border-indigo-500 rounded-md p-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800 text-gray-200 placeholder-gray-500 w-full text-sm sm:text-base transition duration-150 ease-in-out',
            {
              'border-red-500 focus:ring-red-500': meta.touched && meta.error,
            }
          )}
          aria-describedby={meta.touched && meta.error ? `${props.name}-error` : undefined}
        />
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-lg sm:text-xl" />
        )}
      </div>
      {meta.touched && meta.error ? (
        <motion.div
          id={`${props.name}-error`}
          className="text-red-500 text-xs sm:text-sm mt-1 flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FaExclamationCircle className="mr-1" />
          {meta.error}
        </motion.div>
      ) : null}
    </div>
  );
});

// Reusable PhoneInput Component
const PhoneInput = React.memo(({ label, icon: Icon, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const { setValue } = helpers;

  return (
    <div className="flex flex-col">
      <label
        htmlFor={props.id || props.name}
        className="text-sm sm:text-base font-medium mb-1 text-gray-200 flex items-center"
      >
        {Icon && <Icon className="mr-2 text-indigo-400 text-lg sm:text-xl" />}
        {label}
      </label>
      <div className="relative">
        <InputMask
          mask="+1 (999) 999-9999"
          value={field.value}
          onChange={(e) => setValue(e.target.value)}
        >
          {(inputProps) => (
            <input
              {...inputProps}
              type="tel"
              className={classNames(
                'border border-indigo-500 rounded-md p-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800 text-gray-200 placeholder-gray-500 w-full text-sm sm:text-base transition duration-150 ease-in-out',
                {
                  'border-red-500 focus:ring-red-500': meta.touched && meta.error,
                }
              )}
              aria-describedby={meta.touched && meta.error ? `${props.name}-error` : undefined}
              placeholder="+1 (234) 567-8900"
            />
          )}
        </InputMask>
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-lg sm:text-xl" />
        )}
      </div>
      {meta.touched && meta.error ? (
        <motion.div
          id={`${props.name}-error`}
          className="text-red-500 text-xs sm:text-sm mt-1 flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FaExclamationCircle className="mr-1" />
          {meta.error}
        </motion.div>
      ) : null}
    </div>
  );
});

/*****************************************
 * 4) Progress Indicator (UI Decoration)
 *****************************************/
const ProgressIndicator = React.memo(({ steps, currentStep, onStepClick }) => {
    // Define transition settings and motion variants
    const stepTransition = (index) => ({ delay: index * 0.2, duration: 0.5 });
    const connectorVariants = { hidden: { width: 0 }, visible: { width: '100%' } };
  
    // Render individual step and connector within mapping
    return (
      <div className="flex items-center mb-8 space-x-4 lg:space-x-8 overflow-x-auto" aria-label="Progress Indicator">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;
  
          const stepClasses = classNames(
            'flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 rounded-full border-4 transition-colors duration-300 relative',
            {
              'bg-yellow-500 border-yellow-500 text-white shadow-lg': isCompleted,
              'bg-gray-700 border-gray-500 text-yellow-400 shadow-inner': isActive,
              'bg-transparent border-gray-600 text-gray-500': !isCompleted && !isActive,
            }
          );
  
          return (
            <React.Fragment key={step.id}>
              <motion.div
                onClick={() => isCompleted && onStepClick(stepNumber)}
                className="flex flex-col items-center cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={stepTransition(index)}
                title={`Step ${stepNumber}: ${step.name}`}
              >
                <div
                  className={stepClasses}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`Step ${stepNumber}: ${step.name}`}
                >
                  {isCompleted ? <FaCheck size={24} /> : <span className="font-serif text-xl">{stepNumber}</span>}
                </div>
                <span className="mt-2 text-sm lg:text-base text-gray-300 font-semibold whitespace-nowrap">
                  {step.name}
                </span>
              </motion.div>
              {index < steps.length - 1 && (
                <motion.div
                  className={classNames('flex-1 h-1 transition-colors duration-300', {
                    'bg-yellow-500': isCompleted,
                    'bg-gray-600': !isCompleted,
                  })}
                  aria-hidden="true"
                  variants={connectorVariants}
                  initial="hidden"
                  animate="visible"
                  transition={stepTransition(index)}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  });

/************************************************
 * 5) STEP 1: Member Details Form (Enhanced UI)
 ************************************************/
const MemberDetailsForm = ({ formData, setFormData, next }) => {
  const validate = (values) => {
    const errors = {};

    const student = values.student;
    const age = calculateAge(student.dob);

    // Student Information Validation
    if (!student.studentLastName.trim()) {
      errors.studentLastName = 'Last Name is required.';
    }
    if (!student.studentFirstName.trim()) {
      errors.studentFirstName = 'First Name is required.';
    }

    if (!student.dob) {
      errors.dob = 'Date of Birth is required.';
    } else if (age !== '' && age < 0) {
      // If date is invalid or negative age
      errors.dob = 'Please enter a valid date of birth.';
    } else if (age !== '' && age < 18) {
      // If student < 18, require parent info
      if (!student.parentLastName.trim()) {
        errors.parentLastName = 'Parent/Guardian Last Name is required.';
      }
      if (!student.parentFirstName.trim()) {
        errors.parentFirstName = 'Parent/Guardian First Name is required.';
      }
      if (!student.parentEmail.trim()) {
        errors.parentEmail = 'Parent/Guardian Email is required.';
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(student.parentEmail)
      ) {
        errors.parentEmail = 'Invalid parent email address.';
      }

      if (!student.parentPhone.trim()) {
        errors.parentPhone = 'Parent/Guardian Phone# is required.';
      } else {
        if (!/^\+1\d{10}$/.test(formatToE164(student.parentPhone))) {
          errors.parentPhone = 'Invalid parent phone number.';
        }
      }
      if (!student.relationshipToStudent.trim()) {
        errors.relationshipToStudent = 'Relationship to Student is required.';
      }
    }

    if (!student.gender) {
      errors.gender = 'Gender is required.';
    }
    if (!student.studentEmail.trim()) {
      errors.studentEmail = 'Student Email is required.';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(student.studentEmail)
    ) {
      errors.studentEmail = 'Invalid student email address.';
    }
    if (!student.studentPhone.trim()) {
      errors.studentPhone = 'Student phone number is required.';
    } else {
      if (!/^\+1\d{10}$/.test(formatToE164(student.studentPhone))) {
        errors.studentPhone = 'Invalid student phone number.';
      }
    }

    // If age >= 18: require address
    if (age !== '' && age >= 18) {
      if (!student.homeAddress.trim()) {
        errors.homeAddress = 'Home Address is required.';
      }
      if (!student.homeCity.trim()) {
        errors.homeCity = 'City is required.';
      }
      if (!student.homeState.trim()) {
        errors.homeState = 'State is required.';
      }
      if (!student.homeZip.trim()) {
        errors.homeZip = 'Zip Code is required.';
      } else if (!/^\d{5}(-\d{4})?$/.test(student.homeZip)) {
        errors.homeZip = 'Invalid Zip Code.';
      }
    }

    return errors;
  };

  return (
    <Formik
      initialValues={formData}
      enableReinitialize
      validate={validate}
      onSubmit={(values) => {
        setFormData(values);
        next();
      }}
    >
      {({ values, isValid, dirty, errors, touched, setFieldValue }) => (
        <Form className="h-full">
          <motion.div
            className="bg-gray-900 p-8 lg:p-12 rounded-xl shadow-2xl space-y-8 max-w-7xl mx-auto w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white flex items-center justify-center">
              <FaUser className="mr-3 text-indigo-400 text-3xl sm:text-4xl lg:text-5xl" />
              Member Details
            </h2>

            <div className="space-y-8"/>
              {/* Student Information */}
              <motion.div
                className="bg-gray-800 p-6 rounded-lg shadow-inner"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-indigo-300 mb-4">
                  Student Information
                </h3>

                <div className="space-y-6">
                  {/* Row 1: Last Name, First Name, Middle Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <TextInput
                      label="Student's Last Name"
                      name="student.studentLastName"
                      type="text"
                      placeholder="Doe"
                      icon={FaUser}
                    />
                    <TextInput
                      label="First Name"
                      name="student.studentFirstName"
                      type="text"
                      placeholder="John"
                      icon={FaUser}
                    />
                    <TextInput
                      label="Middle Name"
                      name="student.studentMiddleName"
                      type="text"
                      placeholder="A."
                      icon={FaUser}
                    />
                  </div>

                  {/* Row 2: Address, City, State, Zip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <TextInput
                      label="Home Address"
                      name="student.homeAddress"
                      type="text"
                      placeholder="123 Main St"
                      icon={FaHome}
                    />
                    <TextInput
                      label="City"
                      name="student.homeCity"
                      type="text"
                      placeholder="Chicago"
                      icon={FaCity}
                    />
                    <SelectInput
                      label="State"
                      name="student.homeState"
                      icon={FaFlag}
                      options={usStates}
                      isSearchable={true} // Make searchable
                    />
                    <TextInput
                      label="Zip Code"
                      name="student.homeZip"
                      type="text"
                      placeholder="60616"
                      icon={FaHome}
                    />
                  </div>

                  {/* Row 3: Student Email, Phone# */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <TextInput
                      label="Student E-mail Address"
                      name="student.studentEmail"
                      type="email"
                      placeholder="john.doe@example.com"
                      icon={FaEnvelope}
                    />
                    <PhoneInput
                      label="Phone#"
                      name="student.studentPhone"
                      type="tel"
                      placeholder="+1 (234) 567-8900"
                      icon={FaPhone}
                    />
                  </div>

                  {/* Row 4: DOB, Age, Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Date of Birth */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="student.dob"
                        className="text-sm sm:text-base font-medium mb-1 text-gray-200 flex items-center"
                      >
                        <FaCalendarAlt className="mr-2 text-indigo-400 text-lg sm:text-xl" />
                        Date of Birth
                      </label>
                      <DatePicker
                        id="student.dob"
                        name="student.dob"
                        selected={values.student.dob ? new Date(values.student.dob) : null}
                        onChange={(date) => {
                          setFieldValue('student.dob', date);
                        }}
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        minDate={new Date('1900-01-01')}
                        maxDate={new Date()}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className={classNames(
                          'border border-indigo-500 rounded-md p-3 pl-3 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800 text-gray-200 placeholder-gray-500 w-full text-sm sm:text-base transition duration-150 ease-in-out',
                          {
                            'border-red-500 focus:ring-red-500':
                              touched.student && errors.student && errors.student.dob,
                          }
                        )}
                      />
                      {touched.student && errors.student && errors.student.dob && (
                        <motion.div
                          className="text-red-500 text-xs sm:text-sm mt-1 flex items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <FaExclamationCircle className="mr-1" />
                          {errors.student.dob}
                        </motion.div>
                      )}
                    </div>

                    {/* Age (read-only) */}
                    <div className="flex flex-col">
                      <label className="text-sm sm:text-base font-medium mb-1 text-gray-200 flex items-center">
                        <FaCalendarAlt className="mr-2 text-indigo-400 text-lg sm:text-xl" />
                        Age
                      </label>
                      <input
                        type="text"
                        value={calculateAge(values.student.dob) || ''}
                        readOnly
                        className="border border-indigo-500 rounded-md p-3 bg-gray-700 text-gray-200 w-full text-sm sm:text-base"
                        aria-readonly="true"
                      />
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="student.gender"
                        className="text-sm sm:text-base font-medium mb-1 text-gray-200 flex items-center"
                      >
                        <FaUser className="mr-2 text-indigo-400 text-lg sm:text-xl" />
                        Gender
                      </label>
                      <RadioGroup
                        name="student.gender"
                        options={[
                          { label: 'M', value: 'M' },
                          { label: 'F', value: 'F' },
                        ]}
                      />
                      {touched.student && errors.student && errors.student.gender && (
                        <motion.div
                          className="text-red-500 text-xs sm:text-sm mt-1 flex items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <FaExclamationCircle className="mr-1" />
                          {errors.student.gender}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Parent/Guardian Info if under 18 */}
                  {calculateAge(values.student.dob) !== '' && calculateAge(values.student.dob) < 18 && (
                    <motion.div
                      className="bg-gray-800 p-4 mt-4 rounded-lg border border-gray-600 space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h4 className="text-xl sm:text-2xl font-semibold text-indigo-300">
                        Parent/Guardian Information
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <TextInput
                          label="Parent/Guardian Last Name"
                          name="student.parentLastName"
                          type="text"
                          placeholder="Smith"
                          icon={FaUser}
                        />
                        <TextInput
                          label="Parent/Guardian First Name"
                          name="student.parentFirstName"
                          type="text"
                          placeholder="Jane"
                          icon={FaUser}
                        />
                      </div>

                      <TextInput
                        label="E-mail Address"
                        name="student.parentEmail"
                        type="email"
                        placeholder="jane.smith@example.com"
                        icon={FaEnvelope}
                      />

                      <PhoneInput
                        label="Phone"
                        name="student.parentPhone"
                        type="tel"
                        placeholder="+1 (234) 567-8900"
                        icon={FaPhone}
                      />

                      <TextInput
                        label="Relationship to Student"
                        name="student.relationshipToStudent"
                        type="text"
                        placeholder="Mother / Father / Guardian"
                        icon={FaUser}
                      />

                      {/* Address (if different) - optional */}
                      <TextInput
                        label={
                          <>
                            Address (if different) 
                          </>
                        }
                        name="student.parentAddress"
                        type="text"
                        placeholder="456 Elm St"
                        icon={FaHome}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <TextInput
                          label="City"
                          name="student.parentCity"
                          type="text"
                          placeholder="Chicago"
                          icon={FaCity}
                        />
                        <SelectInput
                          label="State"
                          name="student.parentState"
                          icon={FaFlag}
                          options={usStates}
                          isSearchable={true} // Make searchable
                        />
                        <TextInput
                          label="Zip Code"
                          name="student.parentZip"
                          type="text"
                          placeholder="60616"
                          icon={FaHome}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Next Button with Loading State */}
              <div className="flex justify-end mt-8">
                <motion.button
                  type="submit"
                  disabled={!isValid || !dirty}
                  className={classNames(
                    'flex items-center justify-center space-x-2 px-6 py-3 rounded-md text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg w-full sm:w-auto',
                    {
                      'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700':
                        isValid && dirty,
                      'bg-indigo-400 cursor-not-allowed': !isValid || !dirty,
                    }
                  )}
                  aria-disabled={!isValid || !dirty}
                  title={!isValid || !dirty ? 'Please complete the required fields' : 'Proceed to next step'}
                  whileHover={{ scale: isValid && dirty ? 1.05 : 1 }}
                  whileTap={{ scale: isValid && dirty ? 0.95 : 1 }}
                >
                  {/** Optional: Add a spinner icon here when submitting */}
                  <span>Next</span>
                  <FaArrowRight />
                </motion.button>
              </div>
            </motion.div>
          </Form>
     )}
     </Formik>
   );
 };
/*********************************************
 * 6) STEP 2: Tryout Selection Form
 *********************************************/
const TryoutSelectionForm = ({ formData, setFormData, next, back }) => {
  // Example schedule data
  const trainingSchedule = [
    {
      group: 'Kids Group',
      sessions: [
        { name: 'Friday Session', day: 'Friday', time: '5:00 PM', duration: '1 hour', activityType: 'boxing' },
        { name: 'Thursday Session', day: 'Thursday', time: '5:00 PM', duration: '1 hour', activityType: 'boxing' },
        { name: 'Saturday Session', day: 'Saturday', time: '2:30 PM', duration: '1 hour', activityType: 'boxing' },
      ],
    },
    {
      group: 'Adults Beginner',
      sessions: [
        { name: 'Monday Session', day: 'Monday', time: '6:30 PM', duration: '1 hour', activityType: 'boxing' },
        { name: 'Wednesday Session', day: 'Wednesday', time: '6:30 PM', duration: '1 hour', activityType: 'boxing' },
        { name: 'Kickboxing', day: 'Wednesday', time: '7:00 PM', duration: '1 hour', activityType: 'kickboxing' },
        { name: 'Saturday Session', day: 'Saturday', time: '10:30 AM', duration: '1 hour', activityType: 'boxing' },
      ],
    },
    {
      group: 'Adults Professional',
      sessions: [
        { name: 'Monday Session', day: 'Monday', time: '7:30 PM', duration: '1.5 hours', activityType: 'boxing' },
        { name: 'Wednesday Session', day: 'Wednesday', time: '7:30 PM', duration: '1.5 hours', activityType: 'boxing' },
        { name: 'Kickboxing', day: 'Friday', time: '7:00 PM', duration: '1.5 hours', activityType: 'kickboxing' },
        { name: 'Saturday Session', day: 'Saturday', time: '11:30 AM', duration: '1.5 hours', activityType: 'boxing' },
      ],
    },
  ];

  // Flatten into a single array
  const trials = trainingSchedule.flatMap((group) =>
    group.sessions.map((session) => ({
      group: group.group,
      name: session.name,
      day: session.day,
      time: session.time,
      duration: session.duration,
      display: `${group.group} - ${session.day}, ${session.time} (${session.duration})`,
      activityType: session.activityType,
    }))
  );

  // Validation
  const validate = (values) => {
    const errors = {};
    if (!values.tryoutType) {
      errors.tryoutType = 'Please select a tryout type.';
    }
    if (values.tryoutType === 'Group') {
      if (!values.groupType) {
        errors.groupType = 'Please select a group.';
      }
      if (
        ['Adults Beginner', 'Adults Professional'].includes(values.groupType) &&
        !values.activityType
      ) {
        errors.activityType = 'Please select an activity type.';
      }
      if (!values.selectedTrial) {
        errors.selectedTrial = 'Please select a training session.';
      }
    }
    if (values.tryoutType === 'Individual') {
      if (!values.customDate) {
        errors.customDate = 'Please select a date.';
      } else {
        const selectedDate = new Date(values.customDate);
        const today = new Date();
        selectedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          errors.customDate = 'Date cannot be in the past.';
        }
      }
      if (!values.customTime) {
        errors.customTime = 'Please select a time.';
      }
    }
    return errors;
  };

  // Group and Activity Type as Button Groups
  const handleGroupSelection = (group, setFieldValue) => {
    setFieldValue('groupType', group);
    setFieldValue('activityType', ''); // Reset activity type when group changes
    setFieldValue('selectedTrial', ''); // Reset selected trial
  };

  const handleActivitySelection = (activity, setFieldValue) => {
    setFieldValue('activityType', activity);
    setFieldValue('selectedTrial', ''); // Reset selected trial
  };

  // Individual DatePicker
  const IndividualDatePicker = React.memo(({ label, ...props }) => {
    const [field, meta, helpers] = useField(props);
    const { setValue } = helpers;

    return (
      <div className="flex flex-col">
        <label
          htmlFor={props.name}
          className="text-sm sm:text-base font-medium mb-1 text-gray-200 flex items-center"
        >
          <FaCalendarAlt className="mr-2 text-indigo-400 text-lg sm:text-xl" />
          {label}
        </label>
        <div className="relative">
          <DatePicker
            {...field}
            {...props}
            selected={(field.value && new Date(field.value)) || null}
            onChange={(val) => setValue(val)}
            dateFormat="MM/dd/yyyy"
            placeholderText="Select a date"
            minDate={new Date()}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            className={classNames(
              'border border-indigo-500 rounded-md p-3 pl-3 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800 text-gray-200 placeholder-gray-500 w-full text-sm sm:text-base transition duration-150 ease-in-out',
              {
                'border-red-500 focus:ring-red-500': meta.touched && meta.error,
              }
            )}
          />
        </div>
        {meta.touched && meta.error ? (
          <div className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
            <FaExclamationCircle className="mr-1" />
            {meta.error}
          </div>
        ) : null}
      </div>
    );
  });

  // TimePicker
  const TimePicker = React.memo(({ label, ...props }) => {
    const [field, meta, helpers] = useField(props);
    const { setValue } = helpers;

    return (
      <div className="flex flex-col">
        <label
          htmlFor={props.name}
          className="text-sm sm:text-base font-medium mb-1 text-gray-200 flex items-center"
        >
          <FaClock className="mr-2 text-indigo-400 text-lg sm:text-xl" />
          {label}
        </label>
        <div className="relative">
          <input
            type="time"
            {...field}
            {...props}
            onChange={(e) => setValue(e.target.value)}
            className={classNames(
              'border border-indigo-500 rounded-md p-3 pl-3 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800 text-gray-200 w-full text-sm sm:text-base transition duration-150 ease-in-out',
              {
                'border-red-500 focus:ring-red-500': meta.touched && meta.error,
              }
            )}
          />
        </div>
        {meta.touched && meta.error ? (
          <div className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
            <FaExclamationCircle className="mr-1" />
            {meta.error}
          </div>
        ) : null}
      </div>
    );
  });

  const handleSessionClick = (trial, setFieldValue) => {
    setFieldValue('selectedTrial', trial.display);
  };

  return (
    <Formik
      initialValues={formData}
      enableReinitialize
      validate={validate}
      onSubmit={(values) => {
        setFormData((prevData) => ({ ...prevData, ...values }));
        next();
      }}
    >
      {({ values, isValid, setFieldValue, errors, touched }) => {
        // Filter sessions based on group/activity
        const filteredTrials = trials.filter((trial) => {
          if (values.tryoutType !== 'Group') return false;
          if (trial.group !== values.groupType) return false;

          if (['Adults Beginner', 'Adults Professional'].includes(values.groupType)) {
            if (values.activityType === 'boxing') {
              return trial.activityType === 'boxing';
            } else if (values.activityType === 'kickboxing') {
              return trial.activityType === 'kickboxing';
            }
          }
          // If Kids Group => show all boxing
          return trial.activityType === 'boxing';
        });

        return (
          <Form className="h-full">
            <motion.div
              className="bg-gray-800 p-8 lg:p-12 rounded-xl shadow-lg space-y-6 max-w-5xl mx-auto w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl sm:text-base font-medium mb-1 text-gray-200 flex items-center">
                <FaInfoCircle className="mr-2 text-indigo-400 text-lg sm:text-xl" />
                Tryout Type
              </h2>
              {/* Tryout Type Buttons */}
              <div className="flex flex-col sm:flex-row sm:space-x-4 lg:space-x-6">
                {[
                  {
                    value: 'Individual',
                    label: 'Individual',
                    icon: FaUser,
                    description: 'Train individually with personalized coaching.',
                  },
                  {
                    value: 'Group',
                    label: 'Group',
                    icon: FaCheckCircle,
                    description: 'Partner up and train in group format.',
                  },
                ].map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => {
                      setFieldValue('tryoutType', option.value);
                      // Reset dependent fields
                      setFieldValue('groupType', '');
                      setFieldValue('activityType', '');
                      setFieldValue('selectedTrial', '');
                      setFieldValue('customDate', '');
                      setFieldValue('customTime', '');
                    }}
                    className={classNames(
                      'flex flex-col items-center justify-center px-4 py-3 rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 sm:mb-0',
                      {
                        'bg-indigo-600 text-white border-transparent shadow-lg': values.tryoutType === option.value,
                        'bg-gray-700 text-gray-200 border-gray-500 hover:bg-gray-600':
                          values.tryoutType !== option.value,
                      }
                    )}
                    aria-pressed={values.tryoutType === option.value}
                    title={option.description}
                  >
                    {option.icon && <option.icon className="text-2xl mb-1 sm:text-3xl lg:text-4xl" />}
                    <span className="font-semibold text-sm sm:text-base lg:text-lg">
                      {option.label}
                    </span>
                    <span className="text-xs sm:text-sm text-center mt-1">{option.description}</span>
                  </button>
                ))}
              </div>
              <ErrorMessage name="tryoutType">
                {(msg) => (
                  <div className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                    <FaExclamationCircle className="mr-1" />
                    {msg}
                  </div>
                )}
              </ErrorMessage>

              {/* If TryoutType === 'Group' */}
              {values.tryoutType === 'Group' && (
                <>
                  {/* Group Selection as Buttons */}
                  <div className="flex flex-col">
                    <label className="text-sm sm:text-base font-medium mb-1 text-gray-200 flex items-center">
                      <FaCheckCircle className="mr-2 text-indigo-400 text-lg sm:text-xl" />
                      Group
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {['Kids Group', 'Adults Beginner', 'Adults Professional'].map((group) => (
                        <button
                          type="button"
                          key={group}
                          onClick={() => handleGroupSelection(group, setFieldValue)}
                          className={classNames(
                            'flex items-center justify-center px-4 py-2 rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500',
                            {
                              'bg-indigo-600 text-white border-transparent shadow-lg':
                                values.groupType === group,
                              'bg-gray-700 text-gray-200 border-gray-500 hover:bg-gray-600':
                                values.groupType !== group,
                            }
                          )}
                          aria-pressed={values.groupType === group}
                          title={`Select ${group}`}
                        >
                          {group}
                        </button>
                      ))}
                    </div>
                    {values.tryoutType === 'Group' && !values.groupType && (
                      <div className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                        <FaExclamationCircle className="mr-1" />
                        Please select a group.
                      </div>
                    )}
                  </div>

                  {/* Activity Type as Buttons */}
                  {(values.groupType === 'Adults Beginner' || values.groupType === 'Adults Professional') && (
                    <div className="flex flex-col">
                      <label className="text-sm sm:text-base font-medium mb-1 text-gray-200 flex items-center">
                        <FaCheckCircle className="mr-2 text-indigo-400 text-lg sm:text-xl" />
                        Activity Type
                      </label>
                      <div className="flex flex-wrap gap-4">
                        {['boxing', 'kickboxing'].map((activity) => (
                          <button
                            type="button"
                            key={activity}
                            onClick={() => handleActivitySelection(activity, setFieldValue)}
                            className={classNames(
                              'flex items-center justify-center px-4 py-2 rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize',
                              {
                                'bg-indigo-600 text-white border-transparent shadow-lg':
                                  values.activityType === activity,
                                'bg-gray-700 text-gray-200 border-gray-500 hover:bg-gray-600':
                                  values.activityType !== activity,
                              }
                            )}
                            aria-pressed={values.activityType === activity}
                            title={`Select ${activity}`}
                          >
                            {activity}
                          </button>
                        ))}
                      </div>
                      {['Adults Beginner', 'Adults Professional'].includes(values.groupType) &&
                        !values.activityType && (
                          <div className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                            <FaExclamationCircle className="mr-1" />
                            Please select an activity type.
                          </div>
                        )}
                    </div>
                  )}

                  {/* Select Training Session */}
                  {(values.groupType && (values.activityType || values.groupType === 'Kids Group')) && (
                    <div className="flex flex-col">
                      <label className="text-sm sm:text-base font-medium mb-1 text-gray-200">
                        Select a Training Session
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTrials.length > 0 ? (
                          filteredTrials.map((trial, index) => (
                            <div
                              key={index}
                              className={classNames(
                                'border rounded-lg p-4 sm:p-6 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 relative flex flex-col justify-between',
                                {
                                  'bg-gradient-to-r from-indigo-500 to-indigo-600 border-transparent text-white shadow-lg':
                                    values.selectedTrial === trial.display,
                                  'bg-gray-700 border-gray-600 text-gray-200': values.selectedTrial !== trial.display,
                                }
                              )}
                              onClick={() => handleSessionClick(trial, setFieldValue)}
                              role="button"
                              tabIndex={0}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  handleSessionClick(trial, setFieldValue);
                                }
                              }}
                              aria-pressed={values.selectedTrial === trial.display}
                              aria-label={trial.display}
                            >
                              <div>
                                <h3 className="text-lg font-semibold sm:text-xl">{trial.name}</h3>
                                <p className="text-sm sm:text-base">{trial.day}</p>
                                {values.activityType !== 'kickboxing' && (
                                  <p className="text-sm sm:text-base">{trial.time}</p>
                                )}
                                <p className="text-sm sm:text-base">{`Duration: ${trial.duration}`}</p>
                                <p className="text-sm sm:text-base text-green-400">Cost: Free</p>
                              </div>
                              {values.selectedTrial === trial.display && (
                                <div className="flex items-center justify-end mt-2">
                                  <FaCheck className="text-green-400 text-xl sm:text-2xl" />
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm sm:text-base">
                            No sessions available for the selected group and activity type.
                          </p>
                        )}
                      </div>
                      <ErrorMessage name="selectedTrial">
                        {(msg) => (
                          <div className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                            <FaExclamationCircle className="mr-1" />
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>
                  )}
                </>
              )}

              {/* If TryoutType === 'Individual' */}
              {values.tryoutType === 'Individual' && (
                <div className="flex flex-col sm:flex-row sm:space-x-6 gap-4">
                  <IndividualDatePicker
                    label="Select Date"
                    name="customDate"
                    id="customDate"
                    aria-required="true"
                  />
                  <TimePicker
                    label="Select Time"
                    name="customTime"
                    id="customTime"
                    aria-required="true"
                  />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between mt-8 space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                <button
                  type="button"
                  onClick={back}
                  className="flex items-center space-x-2 px-5 py-3 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 w-full sm:w-auto"
                >
                  <FaArrowLeft />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={!isValid}
                  className={classNames(
                    'flex items-center justify-center space-x-2 px-5 py-3 rounded-md text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base lg:text-lg w-full sm:w-auto',
                    {
                      'bg-indigo-600 hover:bg-indigo-700': isValid,
                      'bg-indigo-400 cursor-not-allowed': !isValid,
                    }
                  )}
                  aria-disabled={!isValid}
                  title={!isValid ? 'Please complete the required fields' : 'Proceed to next step'}
                >
                  <span>Next</span>
                  <FaArrowRight />
                </button>
              </div>
            </motion.div>
          </Form>
       );
      }}
    </Formik>
  );
};

/*********************************************
 * 7) STEP 3: Waiver Agreement Form
 *********************************************/
const TryoutWaiverForm = ({ formData, setFormData, next, back, handleSubmitFinal }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sigCanvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });
  const canvasContainerRef = useRef(null);

  const handleResize = useCallback(() => {
    if (canvasContainerRef.current) {
      const { clientWidth } = canvasContainerRef.current;
      let height;
      if (clientWidth < 400) {
        height = 200;
      } else if (clientWidth < 600) {
        height = 250;
      } else {
        height = 300;
      }
      setCanvasSize({
        width: clientWidth,
        height: height,
      });
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Validation Function
  const validate = (values) => {
    const errors = {};
    const student = values.student;

    if (!student.waiverConfirmed) {
      errors.waiverConfirmed = 'You must confirm that you have read the waiver.';
    }
    if (student.waiverConfirmed && !student.signedWaiver) {
      errors.signedWaiver = 'You must sign the waiver.';
    }
    return errors;
  };

  // Handle Form Submission
  const handleSubmitForm = async (values, { setSubmitting, setErrors }) => {
    try {
      setIsSubmitting(true);
      setFormData((prevData) => ({ ...prevData, ...values }));
      await handleSubmitFinal({ ...formData, ...values });
      next();
    } catch (error) {
      setErrors({ submit: 'An error occurred during submission. Please try again.' });
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  // Generate PDF Function
  const generatePDF = () => {
    // Ensure the PDF is placed in the public folder for correct referencing
    const link = document.createElement('a');
    link.href = '/PDF/Waiver.pdf'; // Place Waiver.pdf in the public/PDF directory
    link.download = 'Waiver.pdf';

    // Append the link to the body
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  };

  return (
    <Formik
      initialValues={{
        student: {
          signedWaiver: formData.student.signedWaiver || '',
          waiverConfirmed: formData.student.waiverConfirmed || false,
        },
      }}
      validate={validate}
      onSubmit={handleSubmitForm}
      enableReinitialize
    >
      {({ setFieldValue, isValid, values, errors }) => {
        return (
          <Form className="h-full">
            <motion.div
              className="bg-gray-800 p-8 lg:p-12 rounded-xl shadow-2xl space-y-6 max-w-7xl mx-auto w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white flex items-center justify-center">
                <FaCheckCircle className="mr-3 text-green-500 text-3xl sm:text-4xl lg:text-5xl" />
                Waiver Agreement
              </h2>

              {/* Waiver Content */}
              

              {/* Download PDF Button */}
              <div className="flex justify-end mt-4">
                <motion.button
                  type="button"
                  onClick={generatePDF}
                  className="flex items-center space-x-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Download Waiver as PDF"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaDownload />
                  <span>Download Waiver PDF</span>
                </motion.button>
              </div>

              {/* Waiver Confirmation and Signature for the Student */}
              <div className="space-y-6 mt-6">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 space-y-4">
                  <h4 className="text-xl sm:text-2xl font-semibold text-indigo-300">
                    Waiver for Student
                  </h4>

                  {/* Checkbox for Waiver Confirmation */}
                  <div className="flex items-center">
                    <Field
                      type="checkbox"
                      name="student.waiverConfirmed"
                      id="student.waiverConfirmed"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="student.waiverConfirmed" className="ml-2 block text-sm sm:text-base text-gray-200">
                      I confirm that I have read and understood the waiver agreement for the student.
                    </label>
                  </div>
                  <ErrorMessage name="student.waiverConfirmed">
                    {(msg) => (
                      <motion.div
                        className="text-red-500 text-xs sm:text-sm mt-1 flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FaExclamationCircle className="mr-1" />
                        {msg}
                      </motion.div>
                    )}
                  </ErrorMessage>

                  {/* Signature Section */}
                  {values.student.waiverConfirmed && (
                    <div className="mt-4">
                      <label className="text-sm sm:text-base font-medium mb-1 text-gray-200 flex items-center">
                        <FaPen className="mr-2 text-indigo-400 text-lg sm:text-xl" />
                        Signature <span className="text-red-500">*</span>
                      </label>
                      <div className="relative" ref={canvasContainerRef}>
                        <SignatureCanvas
                          penColor="white"
                          canvasProps={{
                            width: canvasSize.width,
                            height: canvasSize.height,
                            className: 'border border-indigo-500 rounded-lg bg-gray-700 w-full h-auto min-h-[200px]',
                          }}
                          ref={sigCanvasRef}
                          onEnd={() => {
                            const trimmedDataURL = sigCanvasRef.current
                              .getTrimmedCanvas()
                              .toDataURL('image/png');
                            setFieldValue('student.signedWaiver', trimmedDataURL);
                          }}
                          clearOnResize={false}
                        />
                        {!values.student.signedWaiver && (
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                          >
                            <span className="text-gray-400 text-xs sm:text-sm">Sign here</span>
                          </motion.div>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-center mt-3 space-y-2 sm:space-y-0 sm:space-x-4">
                        <motion.button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to clear the signature?')) {
                              sigCanvasRef.current.clear();
                              setFieldValue('student.signedWaiver', '');
                            }
                          }}
                          className="flex items-center space-x-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 text-xs sm:text-sm w-full sm:w-auto"
                          aria-label={`Clear Signature`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaEraser />
                          <span>Clear Signature</span>
                        </motion.button>
                        {values.student.signedWaiver && (
                          <motion.span
                            className="text-green-500 text-xs sm:text-sm flex items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                          >
                            <FaCheck className="mr-1" /> Signature captured
                          </motion.span>
                        )}
                      </div>
                      <ErrorMessage name="student.signedWaiver">
                        {(msg) => (
                          <motion.div
                            className="text-red-500 text-xs sm:text-sm mt-1 flex items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FaExclamationCircle className="mr-1" />
                            {msg}
                          </motion.div>
                        )}
                      </ErrorMessage>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Buttons with Loading State */}
              <div className="flex flex-col sm:flex-row justify-between mt-8 space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                <button
                  type="button"
                  onClick={back}
                  className="flex items-center space-x-2 px-5 py-3 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <FaArrowLeft />
                  <span>Back</span>
                </button>
                <motion.button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={classNames(
                    'flex items-center justify-center space-x-2 px-6 py-3 rounded-md text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg w-full sm:w-auto',
                    {
                      'bg-green-600 hover:bg-green-700': isValid && !isSubmitting,
                      'bg-green-400 cursor-not-allowed': !isValid || isSubmitting,
                    }
                  )}
                  aria-disabled={!isValid || isSubmitting}
                  title={!isValid ? 'Please complete the required fields' : isSubmitting ? 'Submitting...' : 'Submit'}
                  whileHover={{ scale: isValid && !isSubmitting ? 1.05 : 1 }}
                  whileTap={{ scale: isValid && !isSubmitting ? 0.95 : 1 }}
                >
                  {isSubmitting ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full"
                      viewBox="0 0 24 24"
                    ></svg>
                  ) : (
                    <FaCheck />
                  )}
                  <span>Submit</span>
                </motion.button>
              </div>

              {/* Submission Error Message */}
              {errors.submit && (
                <motion.div
                  className="text-red-500 text-xs sm:text-sm mt-2 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaExclamationCircle className="mr-1" />
                  {errors.submit}
                </motion.div>
              )}
            </motion.div>
          </Form>
        );
      }}
    </Formik>
  );
};

/*********************************************
 * 8) Confirmation Component
 *********************************************/
const Confirmation = React.memo(({ resetForm }) => (
    <motion.div
      className="bg-gradient-to-tr from-green-700 to-teal-800 p-8 lg:p-12 rounded-xl shadow-2xl text-center max-w-7xl mx-auto w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-green-500 text-5xl sm:text-6xl lg:text-7xl mx-auto mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaCheckCircle />
      </motion.div>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Thank You!</h2>
      <motion.p
        className="text-gray-300 mt-4 text-base sm:text-lg lg:text-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Your registration has been successfully submitted. We look forward to seeing you at the tryout!
      </motion.p>
      <motion.button
        type="button"
        onClick={resetForm}
        className="mt-6 flex items-center space-x-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Start Over"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaRunning />
        <span>Start Over</span>
      </motion.button>
    </motion.div>
  ));
  
  /************************************************
   * 9) Main MembershipForm Export
   ************************************************/
  export default function MembershipForm() {
    const [formData, setFormData] = useState(initialFormValues);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
  
    const steps = [
      { id: 1, name: 'Member Details' },
      { id: 2, name: 'Tryout Selection' },
      { id: 3, name: 'Waiver Agreement' },
    ];
  
    const next = useCallback(() => {
      setCurrentStep((prev) => {
        const newStep = prev + 1;
        if (newStep > steps.length) {
          console.warn(`Attempted to exceed the maximum step: ${steps.length}`);
          return prev;
        }
        return newStep;
      });
    }, [steps.length]);
  
    const back = useCallback(() => {
      setCurrentStep((prev) => {
        const newStep = prev - 1;
        if (newStep < 1) {
          console.warn('Attempted to go below step 1');
          return prev;
        }
        return newStep;
      });
    }, []);
  
    // Handle final submission to the server
    const handleSubmitFinal = useCallback(async (finalData) => {
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalData),
        });
  
        if (response.ok) {
          toast.success('Registration successful!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setIsSubmitted(true);
          setFormData(initialFormValues);
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || 'Server Error. Please try again.', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (error) {
        toast.error('Network Error. Please check your connection.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error('Error submitting form:', error);
      }
    }, []);
  
    // Reset form to initial state
    const resetForm = useCallback(() => {
      setIsSubmitted(false);
      setCurrentStep(1);
      setFormData(initialFormValues);
    }, []);
  
    return (
      <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-start p-4">
        <div className="w-full max-w-7xl flex flex-col items-center">
          {/* Title */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-3 justify-center mb-10">
            <FaRunning className="text-indigo-500 text-5xl sm:text-6xl lg:text-7xl" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white">
              Tryout Registration
            </h1>
          </div>
  
          {/* Improved Progress Indicator */}
          {!isSubmitted && (
            <ProgressIndicator 
              steps={steps} 
              currentStep={currentStep} 
              onStepClick={(step) => { if(step < currentStep) setCurrentStep(step) }} 
            />
          )}
  
          <AnimatePresence mode="wait">
            {/* STEP 1 */}
            {!isSubmitted && currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <MemberDetailsForm
                  formData={formData}
                  setFormData={setFormData}
                  next={next}
                />
              </motion.div>
            )}
  
            {/* STEP 2 */}
            {!isSubmitted && currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <TryoutSelectionForm
                  formData={formData}
                  setFormData={setFormData}
                  next={next}
                  back={back}
                />
              </motion.div>
            )}
  
            {/* STEP 3 */}
            {!isSubmitted && currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <TryoutWaiverForm
                  formData={formData}
                  setFormData={setFormData}
                  next={next}
                  back={back}
                  handleSubmitFinal={handleSubmitFinal}
                />
              </motion.div>
            )}
  
            {/* Confirmation */}
            {isSubmitted && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <Confirmation resetForm={resetForm} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
  
        {/* Toast Notifications */}
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      </div>
    );
  }