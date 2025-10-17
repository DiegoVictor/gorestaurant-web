import React, { InputHTMLAttributes } from 'react';
import { IconBaseProps } from 'react-icons';

import { Container, Error } from './styles';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
  error?: string;
}

const Input: React.FC<IInputProps> = ({ name, icon: Icon, error, ...rest }) => {
  return (
    <>
      <Container>
        {Icon && <Icon size={20} />}

        <input {...rest} />
      </Container>
      {error && <Error>{error}</Error>}
    </>
  );
};

export default Input;
