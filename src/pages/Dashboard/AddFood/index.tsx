import React, { useState, FormEvent } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import * as Yup from 'yup';

import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import { Form } from './styles';

interface IFoodPlate {
  name: string;
  image: string;
  price: string;
  description: string;
}

interface IModalProps {
  show: boolean;
  close: () => void;
  add: (food: IFoodPlate) => Promise<void>;
}

const schema = Yup.object().shape({
  image: Yup.string()
    .url('Must be a valid URL')
    .required('This field is required'),
  name: Yup.string()
    .min(4, 'Must have more than 4 characters')
    .required('This field is required'),
  price: Yup.string()
    .matches(/\d+\.\d+/i, 'Invalid price')
    .required('This field is required'),
});

const AddFood: React.FC<IModalProps> = ({ show, close, add }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    try {
      const formData = new FormData(event.target as HTMLFormElement);
      const { image, name, price, description } = Object.fromEntries(
        formData.entries(),
      );

      const data = { image, name, price, description } as IFoodPlate;
      await schema.validate(data, { abortEarly: false });

      await add(data);
      close();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        err.inner.forEach(error => {
          if (error.path) {
            validationErrors[error.path] = error.message;
          }
        });

        setErrors(validationErrors);
      }
    }
  };

  return (
    <Modal show={show} close={close}>
      <Form onSubmit={handleSubmit}>
        <h1>Novo Prato</h1>
        <Input
          name="image"
          placeholder="Cole o link aqui"
          error={errors.image}
        />

        <Input
          name="name"
          placeholder="Ex: Moda Italiana"
          error={errors.name}
        />
        <Input name="price" placeholder="Ex: 19.90" error={errors.price} />

        <Input
          name="description"
          placeholder="Descrição"
          error={errors.description}
        />
        <button type="submit" data-testid="add-food-button">
          <p className="text">Adicionar Prato</p>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default AddFood;
