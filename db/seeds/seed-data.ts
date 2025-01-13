import * as bcrypt from 'bcryptjs';
import { EntityManager } from 'typeorm';
import { User } from 'src/modules/users/user.entity';
import { Category } from 'src/modules/category/category.entity';
import { Tour } from 'src/modules/tour/tour.entity';
import { ImageDetail } from 'src/modules/imageDetail/imageDetail.entity';
import { faker } from '@faker-js/faker/locale/vi';

export const seedData = async (manager: EntityManager): Promise<void> => {
  await seedUsers(manager);
  await seedCategories(manager);
  await seedTours(manager);
  await seedImageDetails(manager);
};

async function seedUsers(manager: EntityManager) {
  const salt = await bcrypt.genSalt();
  const encryptedPassword = await bcrypt.hash('123456', salt);

  const users = Array.from({ length: 10 }).map(() => {
    const user = new User();
    user.user_name = faker.internet.userName();
    user.user_email = faker.internet.email();
    user.user_password = encryptedPassword;
    user.role = 'USER';
    return user;
  });

  await manager.getRepository(User).save(users);
}

async function seedCategories(manager: EntityManager) {
  const categories = Array.from({ length: 5 }).map(() => {
    const category = new Category();
    category.category_name = faker.commerce.department();
    category.image_link = faker.image.url();
    return category;
  });

  await manager.getRepository(Category).save(categories);
}

async function seedTours(manager: EntityManager) {
  const users = await manager.getRepository(User).find();
  const categories = await manager.getRepository(Category).find();

  const tours = Array.from({ length: 10 }).map(() => {
    const tour = new Tour();
    tour.title = faker.lorem.words(3);
    tour.rating = faker.number.float({ min: 1, max: 5 });
    tour.city = faker.location.city();
    tour.price_one_person = faker.number.int({ min: 50, max: 500 });
    tour.image_main = faker.image.url();
    tour.working = faker.lorem.sentence();
    tour.latitude = faker.location.latitude();
    tour.longitude = faker.location.longitude();
    tour.check_in = faker.date.future();
    tour.check_out = faker.date.future();
    tour.time_slot_length = faker.number.int({ min: 30, max: 120 });
    tour.destination = faker.location.city();
    tour.destination_description = faker.lorem.paragraph();
    tour.is_deleted = false;
    tour.user = faker.helpers.arrayElement(users);
    tour.categories = faker.helpers.arrayElements(categories);
    return tour;
  });

  await manager.getRepository(Tour).save(tours);
}

async function seedImageDetails(manager: EntityManager) {
  const tours = await manager.getRepository(Tour).find();

  const imageDetails = Array.from({ length: 20 }).map(() => {
    const imageDetail = new ImageDetail();
    imageDetail.link = faker.image.url();
    imageDetail.tour = faker.helpers.arrayElement(tours);
    return imageDetail;
  });

  await manager.getRepository(ImageDetail).save(imageDetails);
}
