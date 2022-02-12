import { ValidationError } from 'yup';

interface IErrorBag {
  [key: string]: string;
}

export default (err: ValidationError): IErrorBag => {
  const validationErrors: IErrorBag = {};

  err.inner.forEach(error => {
    if (error.path) {
      validationErrors[error.path] = error.message;
    }
  });
  return validationErrors;
};
