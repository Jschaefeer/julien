"use client";

import type { ComponentProps } from "react";

/** GFM task checkboxes compile with disabled; keep them interactive on first paint. */
export function NilChecklistInput(props: ComponentProps<"input">) {
  if (props.type === "checkbox") {
    const { disabled: _disabled, readOnly: _readOnly, ...rest } = props;
    return <input {...rest} />;
  }
  return <input {...props} />;
}
