'use client';

import * as React from 'react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

// Provide a deterministic id for collapsible trigger/content pairing so that
// the server and client render the same `id` / `aria-controls` values and
// avoid hydration mismatches caused by random id generation.
const CollapsibleIdContext = React.createContext<string | undefined>(undefined);

function Collapsible({
  id,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root> & { id?: string }) {
  const generatedId = React.useId();
  const value = id ?? generatedId;
  return (
    <CollapsibleIdContext.Provider value={value}>
      <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
    </CollapsibleIdContext.Provider>
  );
}

function CollapsibleTrigger({
  id,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger> & { id?: string }) {
  const contextId = React.useContext(CollapsibleIdContext);
  const controls = id ?? contextId;
  // forward aria-controls if available so server/client use same value
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      aria-controls={controls}
      {...(props as any)}
    />
  );
}

function CollapsibleContent({
  id,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent> & { id?: string }) {
  const contextId = React.useContext(CollapsibleIdContext);
  const contentId = id ?? contextId;
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      id={contentId}
      {...(props as any)}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
