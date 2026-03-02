import { z } from "zod";
import type { FieldValues, UseFormProps } from "react-hook-form";

export type FieldType =
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "date"
    | "datetime-local"
    | "time"
    | "select"
    | "checkbox"
    | "radio"
    | "textarea"
    | "file";

export interface BaseFieldConfig {
    name: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    description?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    autoComplete?: string;
}

export interface TextFieldConfig extends BaseFieldConfig {
    type: "text" | "email" | "password" | "tel" | "url";
    pattern?: string;
    minLength?: number;
    maxLength?: number;
}

export interface NumberFieldConfig extends BaseFieldConfig {
    type: "number";
    min?: number;
    max?: number;
    step?: number;
}

export interface SelectFieldConfig extends BaseFieldConfig {
    type: "select";
    options: Array<{ label: string; value: string | number }>;
    multiple?: boolean;
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
    type: "checkbox";
}

export interface RadioFieldConfig extends BaseFieldConfig {
    type: "radio";
    options: Array<{ label: string; value: string | number }>;
}

export interface TextareaFieldConfig extends BaseFieldConfig {
    type: "textarea";
    rows?: number;
}

export interface FileFieldConfig extends BaseFieldConfig {
    type: "file";
    accept?: string;
    multiple?: boolean;
}

export type FieldConfig =
    | TextFieldConfig
    | NumberFieldConfig
    | SelectFieldConfig
    | CheckboxFieldConfig
    | RadioFieldConfig
    | TextareaFieldConfig
    | FileFieldConfig;

export interface FormConfig<TFieldValues extends FieldValues = FieldValues> {
    fields: FieldConfig[];
    schema: any; // Zod schema - using any for compatibility with all Zod types
    defaultValues?: Partial<TFieldValues>;
    formProps?: Omit<UseFormProps<TFieldValues>, "resolver" | "defaultValues">;
}

export interface FormEngineProps<TFieldValues extends FieldValues = FieldValues> {
    config: FormConfig<TFieldValues>;
    onSubmit: (data: TFieldValues) => void | Promise<void>;
    isLoading?: boolean;
    error?: string | null;
    submitText?: string;
    loadingText?: string;
    className?: string;
    children?: React.ReactNode; // For custom buttons or additional content
}
