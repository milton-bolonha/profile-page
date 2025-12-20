import React from 'react';

declare module "@clerk/nextjs" {
  // Extend the existing types for SignedIn and SignedOut if necessary, 
  // but for now, declare them as functional components that accept children.
  export interface SignedInProps extends React.PropsWithChildren<{}> {}
  export interface SignedOutProps extends React.PropsWithChildren<{}> {}

  export const SignedIn: React.FC<SignedInProps>;
  export const SignedOut: React.FC<SignedOutProps>;
}
