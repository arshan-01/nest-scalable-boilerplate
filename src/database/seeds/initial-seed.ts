import { DataSource } from 'typeorm';
import { User, UserRole } from '../../common/entities/user.entity';
import { HashUtil } from '../../common/utils/hash.util';

export class InitialSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    // Check if admin user already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!existingAdmin) {
      const adminUser = userRepository.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: await HashUtil.hashPassword('AdminPass123'),
        role: UserRole.ADMIN,
        emailVerified: true,
        isActive: true,
      });

      await userRepository.save(adminUser);
      console.log('✅ Admin user created successfully');
    }

    // Check if test user already exists
    const existingUser = await userRepository.findOne({
      where: { email: 'test@example.com' },
    });

    if (!existingUser) {
      const testUser = userRepository.create({
        name: 'Test User',
        email: 'test@example.com',
        password: await HashUtil.hashPassword('TestPass123'),
        role: UserRole.USER,
        emailVerified: true,
        isActive: true,
      });

      await userRepository.save(testUser);
      console.log('✅ Test user created successfully');
    }
  }
}
