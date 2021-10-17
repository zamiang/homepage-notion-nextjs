import React from 'react';
import ErrorTracking from './error-tracking';

export default function Catch(component: any, errorHandler?: any) {
  return class extends React.Component {
    state: {
      error: Error | undefined;
    };

    constructor(props: any) {
      super(props);
      this.state = {
        error: undefined,
      };
    }

    static getDerivedStateFromError(error: Error) {
      return { error };
    }

    componentDidCatch(error: any, info: any) {
      if (errorHandler) {
        ErrorTracking.logErrorInfo(info);
        ErrorTracking.logErrorInRollbar(error);
        errorHandler(error, info);
      }
    }

    render() {
      const { error } = this.state;
      return component(this.props, error);
    }
  };
}
