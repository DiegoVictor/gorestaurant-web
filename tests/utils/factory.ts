import { faker } from '@faker-js/faker';
import factory from 'factory-girl';

factory.define(
  'Food',
  {},
  {
    id: faker.number.int,
    name: faker.commerce.productName,
    description: faker.lorem.paragraph,
    price: () => String(faker.finance.amount()),
    available: true,
    image: faker.image.url,
  },
);

export default factory;
