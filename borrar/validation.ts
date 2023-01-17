import { ZodError } from "https://deno.land/x/zod@v3.19.1/ZodError.ts";

export const formatValidationError = (err: ZodError): Error => {
  const f: any = err.format();
  let s = f._errors.join("\n");
  for (const k in f) {
    if (k === "_errors") {
      continue;
    }
    if (f[k]._errors.length > 0) {
      if (s !== "") {
        s += "\n";
      }
      s += `Field ${k}: ` + f[k]._errors.join(", ");
    }
  }
  return new Error(s);
};
