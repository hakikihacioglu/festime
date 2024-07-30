// components/InputField.js
import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { classNames } from '../utils/classNames';

export default function InputField({ id, label, name, type = "text", placeholder, className, disabled, defaultValue, error, errorMessage, value, onChange, required }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={classNames("relative mt-2 rounded-md shadow-sm", error ? "ring-red-300" : "ring-gray-300")}>
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          disabled={disabled}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          value={value}
          onChange={onChange}
          required={required}
          className={classNames(
            "block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
            error ? "text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500" : "ring-gray-300 focus:ring-indigo-600",
            disabled ? "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200" : "",
            className
          )}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon aria-hidden="true" className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
