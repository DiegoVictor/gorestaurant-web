import React, { useState, FormEvent } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import * as Yup from 'yup';

import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import { Form } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

interface IModalProps {
  show: boolean;
  close: () => void;
  update: (food: IFoodPlate) => Promise<void>;
  data: IFoodPlate;
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

const EditFood: React.FC<IModalProps> = ({
  show,
  close,
  data: { id, available },
  update,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    try {
      const formData = new FormData(event.target as HTMLFormElement);
      const { image, name, price, description } = Object.fromEntries(
        formData.entries(),
      );

      const data = {
        id,
        image,
        name,
        price,
        description,
        available,
      } as IFoodPlate;
      await schema.validate(data, { abortEarly: false });

      await update(data);
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
        <h1>Editar Prato</h1>
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

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default EditFood;
