import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FormConfig } from "./types";

export function useFormEngine<TFieldValues extends FieldValues = FieldValues>(
  config: FormConfig<TFieldValues>,
) {
  const form = useForm<TFieldValues>({
    resolver: zodResolver(config.schema),
    defaultValues: config.defaultValues as any,
    ...config.formProps,
  });

  return {
    form,
    fields: config.fields,
  };
}
