import faker from 'faker';
import factory from 'factory-girl';

factory.define(
  'Food',
  {},
  {
    id: faker.datatype.number,
    name: faker.name.title,
    description: faker.lorem.paragraph,
    price: () => String(faker.finance.amount()),
    available: true,
    image: faker.image.imageUrl,
  },
);

export default factory;
