import { ContainerProps } from 'components/Container/Container';

export interface AppLayoutProps {
  title?: string;
  right?: any;
  onPressRight?: any;
  backgroundColor?: string;
  loading?: boolean;
}

export type AppLayoutContainerProps = ContainerProps & AppLayoutProps;
