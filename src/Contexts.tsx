import * as React from 'react';
import { Component, ReactNode } from 'react';


export function Contexts<T, U>({ ctxs, args = {}, children }: { ctxs: T, args: U, children: (ctxs: T & U) => ReactNode }) {
  const keys = Object.keys(ctxs);
  const key_0 = keys[0];
  const { [key_0]: Ctx, ...rest } = ctxs;
  if (!Ctx) {
    return children(args);
  }
  return (
    <Ctx>
      {ctx => (
        <Contexts ctxs={rest} args={Object.assign({}, args, { [key_0]: ctx })}>
          {children}
        </Contexts>
      )}
    </Ctx>
  );
}
