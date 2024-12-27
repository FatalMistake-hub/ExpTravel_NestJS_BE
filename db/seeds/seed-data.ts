import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/modules/users/user.entity';
import { EntityManager } from 'typeorm';

export const seedData = async (manager: EntityManager): Promise<void> => {
  //1
  // Add your seeding logic here using the manager
  // For example:

  await seedUser();

  async function seedUser() {
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash('123456', salt);

    const user = new User();
    user.userName = faker.person.fullName();
    user.userEmail = faker.internet.email();
    user.userPassword = encryptedPassword;

    await manager.getRepository(User).save(user);
  }
};
