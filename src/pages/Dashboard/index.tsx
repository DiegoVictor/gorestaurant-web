import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const { data } = await api.get('foods');
      setFoods(data);
    }

    loadFoods();
  }, []);

  const handleAddFood = async (
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> => {
    try {
      const { data } = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, data]);
    } catch (err) {
      toast.error(
        'An error occured while creating the new plate, try again later!',
      );
    }
  };

  const handleUpdateFood = async (
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> => {
    try {
      const { id, available } = editingFood;
      const { data } = await api.put(`foods/${id}`, { id, available, ...food });

      const newFoodsList = [...foods];

      newFoodsList.splice(
        foods.findIndex(plate => plate.id === data.id),
        1,
        data,
      );
      setFoods(newFoodsList);
    } catch (err) {
      toast.error(
        'An error occured while updateing the existing plate, try again later!',
      );
    }
  };

  const deleteFood = async (id: number): Promise<void> => {
    await api.delete(`foods/${id}`);
    setFoods(foods.filter(food => food.id !== id));
  };

  const toggleModal = (): void => {
    setModalOpen(!modalOpen);
  };

  const editFood = (food: IFoodPlate): void => {
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              deleteFood={deleteFood}
              editFood={editFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
