declare module 'simplebar-react' {
  import * as React from 'react';

  export interface Props extends React.HTMLAttributes<HTMLElement> {
       scrollableNodeProps?: React.HTMLAttributes<HTMLElement> & {
      ref?: React.Ref<HTMLElement>;
    };
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
  }

  const SimpleBar: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLElement>>;

  export default SimpleBar;
}
