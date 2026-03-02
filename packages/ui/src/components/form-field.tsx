"use client";

import * as React from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  useFormContext,
  FormProvider,
  useForm,
  useFieldArray,
} from "react-hook-form";
import { Field, FieldLabel, FieldError, FieldDescription } from "./field";

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  field?: any;
  fieldState?: any;
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  children: React.ReactNode;
  className?: string;
  orientation?: "vertical" | "horizontal" | "responsive";
}

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  children,
  className,
  orientation,
}: FormFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormFieldContext.Provider value={{ name, field, fieldState }}>
          <Field
            className={className}
            orientation={orientation}
            data-invalid={!!fieldState.error}
          >
            {children}
          </Field>
        </FormFieldContext.Provider>
      )}
    />
  );
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);

  if (!fieldContext) {
    throw new Error("useFormField must be used within FormField");
  }

  return fieldContext;
}

interface FormControlProps {
  children:
  | React.ReactElement
  | ((props: { field: any; fieldState: any }) => React.ReactElement);
}

function FormControl({ children }: FormControlProps) {
  const { name, field, fieldState } = useFormField();

  if (!field) {
    throw new Error("FormControl must be used within FormField");
  }

  // Support render prop pattern
  if (typeof children === "function") {
    return children({ field, fieldState });
  }

  // Support direct element (for simple cases)
  return React.cloneElement(children, {
    ...field,
    ...(typeof children.type !== "string" && { id: name }),
    "aria-invalid": !!fieldState?.error,
    "aria-describedby": fieldState?.error ? `${name}-error` : undefined,
  } as any);
}

function FormMessage({ className }: { className?: string }) {
  const { name, fieldState } = useFormField();

  if (!fieldState?.error) {
    return null;
  }

  return (
    <FieldError
      id={`${name}-error`}
      className={className}
      errors={[fieldState.error]}
    />
  );
}

export {
  FormField,
  FormControl,
  FormMessage,
  FormFieldContext,
  useFormField,
  FormProvider,
  useForm,
  useFieldArray,
};
export {
  FieldLabel as FormLabel,
  FieldError as FormError,
  FieldDescription as FormDescription,
} from "./field";
