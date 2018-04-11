import * as React from 'react';
import { Component, ReactNode } from 'react';


export function Contexts({ ctxs, args = [], children }) {
  const Ctx = ctxs[0];
  if (!Ctx) {
    return children(...args);
  }
  return (
    <Ctx>
      {ctx => (
        <Contexts ctxs={ctxs.slice(1)} args={args.concat(ctx)}>
          {children}
        </Contexts>
      )}
    </Ctx>
  );
}
