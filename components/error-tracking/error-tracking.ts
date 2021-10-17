const ErrorTracking = (() => {
  const logErrorInfo = (info: string) => {
    console.info(info);
  };

  const logErrorInRollbar = (error: any) => {
    console.error(error);
  };

  return { logErrorInfo, logErrorInRollbar };
})();

export default ErrorTracking;
