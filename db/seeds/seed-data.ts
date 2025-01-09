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
    user.user_name = faker.person.fullName();
    user.user_email = faker.internet.email();
    user.user_password = encryptedPassword;

    await manager.getRepository(User).save(user);
  }
};
