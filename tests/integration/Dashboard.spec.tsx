import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import AxiosMock from 'axios-mock-adapter';
import { faker } from '@faker-js/faker';
import { toast } from 'react-toastify';

import api from '../../src/services/api';
import Dashboard from '../../src/pages/Dashboard';
import factory from '../utils/factory';

interface IFood {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

const apiMock = new AxiosMock(api);

describe('Dashboard', () => {
  it('should be able to list all the food plates from your api', async () => {
    const foods = await factory.attrsMany<IFood>('Food', 3);
    apiMock.onGet('foods').reply(200, foods);

    const { getByText, getByTestId } = render(<Dashboard />);

    await waitFor(() => expect(getByText(foods[0].name)).toBeTruthy(), {
      timeout: 200,
    });

    foods.forEach(food => {
      expect(getByText(food.name)).toBeTruthy();
      expect(getByText(food.description)).toBeTruthy();
      expect(getByTestId(`remove-food-${food.id}`)).toBeTruthy();
      expect(getByTestId(`edit-food-${food.id}`)).toBeTruthy();
    });
  });

  it('should be able to add a new food plate', async () => {
    const food = await factory.attrs<IFood>('Food');
    apiMock.onGet('foods').reply(200, []).onPost('foods').reply(200, food);

    const { getByText, getByTestId, getByPlaceholderText } = render(
      <Dashboard />,
    );

    act(() => {
      fireEvent.click(getByText('Novo Prato'));
    });

    const inputImage = getByPlaceholderText(
      'Cole o link aqui',
    ) as HTMLInputElement;
    const inputName = getByPlaceholderText(
      'Ex: Moda Italiana',
    ) as HTMLInputElement;
    const inputValue = getByPlaceholderText('Ex: 19.90') as HTMLInputElement;
    const inputDescription = getByPlaceholderText(
      'Descrição',
    ) as HTMLInputElement;

    await act(async () => {
      fireEvent.change(inputImage, {
        target: { value: food.image },
      });
      fireEvent.change(inputName, { target: { value: food.name } });
      fireEvent.change(inputValue, { target: { value: food.price } });
      fireEvent.change(inputDescription, {
        target: {
          value: food.description,
        },
      });
    });

    expect(inputImage.value).toBe(food.image);
    expect(inputName.value).toBe(food.name);
    expect(inputValue.value).toBe(food.price);
    expect(inputDescription.value).toBe(food.description);

    await act(async () => {
      fireEvent.click(getByTestId('add-food-button'));
    });

    await waitFor(() => expect(getByText(food.name)).toBeTruthy(), {
      timeout: 200,
    });

    expect(getByText(food.name)).toBeTruthy();
    expect(getByText(food.description)).toBeTruthy();
    expect(getByTestId(`remove-food-${food.id}`)).toBeTruthy();
    expect(getByTestId(`edit-food-${food.id}`)).toBeTruthy();
  });

  it('should not be able to add a new food plate with network error', async () => {
    const error = jest.fn();
    const food = await factory.attrs<IFood>('Food');

    apiMock.onGet('foods').reply(200, []).onPost('foods').reply(400);
    toast.error = error;

    const { getByText, getByTestId, getByPlaceholderText } = render(
      <Dashboard />,
    );

    act(() => {
      fireEvent.click(getByText('Novo Prato'));
    });

    const inputImage = getByPlaceholderText(
      'Cole o link aqui',
    ) as HTMLInputElement;
    const inputName = getByPlaceholderText(
      'Ex: Moda Italiana',
    ) as HTMLInputElement;
    const inputValue = getByPlaceholderText('Ex: 19.90') as HTMLInputElement;
    const inputDescription = getByPlaceholderText(
      'Descrição',
    ) as HTMLInputElement;

    await act(async () => {
      fireEvent.change(inputImage, {
        target: { value: food.image },
      });
      fireEvent.change(inputName, { target: { value: food.name } });
      fireEvent.change(inputValue, { target: { value: food.price } });
      fireEvent.change(inputDescription, {
        target: {
          value: food.description,
        },
      });
    });

    expect(inputImage.value).toBe(food.image);
    expect(inputName.value).toBe(food.name);
    expect(inputValue.value).toBe(food.price);
    expect(inputDescription.value).toBe(food.description);

    await act(async () => {
      fireEvent.click(getByTestId('add-food-button'));
    });

    await waitFor(
      () =>
        expect(toast.error).toHaveBeenCalledWith(
          'An error occured while creating the new plate, try again later!',
        ),
      {
        timeout: 200,
      },
    );

    expect(toast.error).toHaveBeenCalledWith(
      'An error occured while creating the new plate, try again later!',
    );
  });

  it('should not be able to add a new food plate with invalid data', async () => {
    const food = await factory.attrs<IFood>('Food', {
      name: faker.lorem.word().slice(-3),
      image: 'invalid-url',
    });
    apiMock.onGet('foods').reply(200, []);

    const { getByText, getByTestId, getByPlaceholderText } = render(
      <Dashboard />,
    );

    act(() => {
      fireEvent.click(getByText('Novo Prato'));
    });

    const inputImage = getByPlaceholderText(
      'Cole o link aqui',
    ) as HTMLInputElement;
    const inputName = getByPlaceholderText(
      'Ex: Moda Italiana',
    ) as HTMLInputElement;
    const inputValue = getByPlaceholderText('Ex: 19.90') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(inputImage, {
        target: { value: food.image },
      });
      fireEvent.change(inputValue, { target: { value: 'invalid price' } });
      fireEvent.change(inputName, { target: { value: food.name } });
    });

    expect(inputImage.value).toBe(food.image);
    expect(inputName.value).toBe(food.name);
    expect(inputValue.value).toBe('invalid price');

    await act(async () => {
      fireEvent.click(getByTestId('add-food-button'));
    });

    await waitFor(() => expect(getByText('Invalid price')).toBeTruthy(), {
      timeout: 200,
    });

    expect(getByText('Must have more than 4 characters')).toBeTruthy();
    expect(getByText('Must be a valid URL')).toBeTruthy();
  });

  it('should be able to edit a food plate', async () => {
    const [food, editFood] = await factory.attrsMany<IFood>('Food', 2);

    editFood.id = food.id;
    apiMock
      .onGet('foods')
      .reply(200, [food])
      .onPut(`foods/${food.id}`)
      .reply(200, editFood);

    const { getByText, getByTestId, getByPlaceholderText } = render(
      <Dashboard />,
    );

    await waitFor(() => expect(getByText(food.name)).toBeTruthy(), {
      timeout: 200,
    });

    expect(getByText(food.name)).toBeTruthy();
    expect(getByText(food.description)).toBeTruthy();
    expect(getByTestId(`remove-food-${food.id}`)).toBeTruthy();
    expect(getByTestId(`edit-food-${food.id}`)).toBeTruthy();

    act(() => {
      fireEvent.click(getByTestId(`edit-food-${food.id}`));
    });

    const inputImage = getByPlaceholderText(
      'Cole o link aqui',
    ) as HTMLInputElement;
    const inputName = getByPlaceholderText(
      'Ex: Moda Italiana',
    ) as HTMLInputElement;
    const inputValue = getByPlaceholderText('Ex: 19.90') as HTMLInputElement;
    const inputDescription = getByPlaceholderText(
      'Descrição',
    ) as HTMLInputElement;

    await act(async () => {
      fireEvent.change(inputImage, {
        target: { value: editFood.image },
      });
      fireEvent.change(inputName, { target: { value: editFood.name } });
      fireEvent.change(inputValue, { target: { value: editFood.price } });
      fireEvent.change(inputDescription, {
        target: {
          value: editFood.description,
        },
      });
    });

    expect(inputImage.value).toBe(editFood.image);
    expect(inputName.value).toBe(editFood.name);
    expect(inputValue.value).toBe(editFood.price);
    expect(inputDescription.value).toBe(editFood.description);

    await act(async () => {
      fireEvent.click(getByTestId('edit-food-button'));
    });

    await waitFor(() => expect(getByText(editFood.name)).toBeTruthy(), {
      timeout: 200,
    });

    expect(getByText(editFood.name)).toBeTruthy();
    expect(getByText(editFood.description)).toBeTruthy();
    expect(getByTestId(`remove-food-${editFood.id}`)).toBeTruthy();
    expect(getByTestId(`edit-food-${editFood.id}`)).toBeTruthy();
  });

  it('should not be able to edit a food plate with network error', async () => {
    const error = jest.fn();
    const food = await factory.attrs<IFood>('Food');

    apiMock.onGet('foods').reply(200, [food]).onPost('foods').reply(400);
    toast.error = error;

    const { getByText, getByTestId, getByPlaceholderText } = render(
      <Dashboard />,
    );

    await waitFor(() => expect(getByText(food.name)).toBeTruthy(), {
      timeout: 200,
    });

    expect(getByText(food.name)).toBeTruthy();
    expect(getByText(food.description)).toBeTruthy();
    expect(getByTestId(`remove-food-${food.id}`)).toBeTruthy();
    expect(getByTestId(`edit-food-${food.id}`)).toBeTruthy();

    act(() => {
      fireEvent.click(getByTestId(`edit-food-${food.id}`));
    });

    const inputImage = getByPlaceholderText(
      'Cole o link aqui',
    ) as HTMLInputElement;
    const inputName = getByPlaceholderText(
      'Ex: Moda Italiana',
    ) as HTMLInputElement;
    const inputValue = getByPlaceholderText('Ex: 19.90') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(inputImage, {
        target: { value: food.image },
      });
      fireEvent.change(inputName, { target: { value: food.name } });
      fireEvent.change(inputValue, { target: { value: food.price } });
    });

    expect(inputImage.value).toBe(food.image);
    expect(inputName.value).toBe(food.name);
    expect(inputValue.value).toBe(food.price);

    await act(async () => {
      fireEvent.click(getByTestId('edit-food-button'));
    });

    await waitFor(
      () =>
        expect(toast.error).toHaveBeenCalledWith(
          'An error occured while updateing the existing plate, try again later!',
        ),
      {
        timeout: 200,
      },
    );

    expect(toast.error).toHaveBeenCalledWith(
      'An error occured while updateing the existing plate, try again later!',
    );
  });

  it('should not be able to edit a food plate with invalid data', async () => {
    const food = await factory.attrs<IFood>('Food', {
      name: faker.lorem.word().slice(-3),
      image: 'invalid-url',
    });
    apiMock.onGet('foods').reply(200, [food]);

    const { getByText, getByTestId, getByPlaceholderText } = render(
      <Dashboard />,
    );

    await waitFor(() => expect(getByText(food.name)).toBeTruthy(), {
      timeout: 200,
    });

    expect(getByText(food.name)).toBeTruthy();
    expect(getByText(food.description)).toBeTruthy();
    expect(getByTestId(`remove-food-${food.id}`)).toBeTruthy();
    expect(getByTestId(`edit-food-${food.id}`)).toBeTruthy();

    act(() => {
      fireEvent.click(getByTestId(`edit-food-${food.id}`));
    });

    const inputImage = getByPlaceholderText(
      'Cole o link aqui',
    ) as HTMLInputElement;
    const inputName = getByPlaceholderText(
      'Ex: Moda Italiana',
    ) as HTMLInputElement;
    const inputValue = getByPlaceholderText('Ex: 19.90') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(inputImage, {
        target: { value: food.image },
      });
      fireEvent.change(inputName, { target: { value: food.name } });
      fireEvent.change(inputValue, { target: { value: 'invalid price' } });
    });

    expect(inputImage.value).toBe(food.image);
    expect(inputName.value).toBe(food.name);
    expect(inputValue.value).toBe('invalid price');

    await act(async () => {
      fireEvent.click(getByTestId('edit-food-button'));
    });

    await waitFor(() => getByText('Invalid price'), {
      timeout: 200,
    });

    expect(getByText('Must have more than 4 characters')).toBeTruthy();
    expect(getByText('Must be a valid URL')).toBeTruthy();
  });

  it('should be able to remove a food plate', async () => {
    const food = await factory.attrs<IFood>('Food');
    apiMock
      .onGet('foods')
      .reply(200, [food])

      .onDelete(`foods/${food.id}`)
      .reply(204);

    const { getByText, getByTestId } = render(<Dashboard />);

    await waitFor(() => expect(getByText(food.name)).toBeTruthy(), {
      timeout: 200,
    });

    expect(getByText(food.name)).toBeTruthy();
    expect(getByText(food.description)).toBeTruthy();
    expect(getByTestId(`remove-food-${food.id}`)).toBeTruthy();
    expect(getByTestId(`edit-food-${food.id}`)).toBeTruthy();

    await act(async () => {
      fireEvent.click(getByTestId(`remove-food-${food.id}`));
    });

    expect(getByTestId('foods-list')).toBeEmptyDOMElement();
  });

  it('should be able to update the availibility of a food plate', async () => {
    const food = await factory.attrs<IFood>('Food');
    apiMock
      .onGet('foods')
      .reply(200, [food])
      .onPut(`foods/${food.id}`)
      .reply(200, {
        ...food,
        available: false,
      });

    const { getByText, getByTestId } = render(<Dashboard />);

    await waitFor(() => expect(getByText(food.name)).toBeTruthy(), {
      timeout: 200,
    });

    expect(getByText(food.name)).toBeTruthy();
    expect(getByText(food.description)).toBeTruthy();
    expect(getByText('Disponível')).toBeTruthy();
    expect(getByTestId(`remove-food-${food.id}`)).toBeTruthy();
    expect(getByTestId(`edit-food-${food.id}`)).toBeTruthy();

    await act(async () => {
      fireEvent.click(getByTestId(`change-status-food-${food.id}`));
    });

    await waitFor(() => expect(getByText(food.name)).toBeTruthy(), {
      timeout: 200,
    });

    expect(getByText(food.name)).toBeTruthy();
    expect(getByText(food.description)).toBeTruthy();
    expect(getByText('Indisponível')).toBeTruthy();
    expect(getByTestId(`remove-food-${food.id}`)).toBeTruthy();
    expect(getByTestId(`edit-food-${food.id}`)).toBeTruthy();

    await act(async () => {
      fireEvent.click(getByTestId(`change-status-food-${food.id}`));
    });

    await waitFor(() => expect(getByText(food.name)).toBeTruthy(), {
      timeout: 200,
    });

    expect(getByText(food.name)).toBeTruthy();
    expect(getByText(food.description)).toBeTruthy();
    expect(getByText('Disponível')).toBeTruthy();
    expect(getByTestId(`remove-food-${food.id}`)).toBeTruthy();
    expect(getByTestId(`edit-food-${food.id}`)).toBeTruthy();
  });
});
