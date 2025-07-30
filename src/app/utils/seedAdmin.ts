import bcryptjs from 'bcryptjs';
import config from '../config';
import { ROLE } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

/* eslint-disable no-console */
export const seedAdmin = async () => {
    try {
        const isSuperAdminExists = await User.findOne({
            email: config.ADMIN_EMAIL,
            role: ROLE.ADMIN,
        });

        if (isSuperAdminExists) {
            console.log('Super admin already exists');
            return;
        }
        console.log('Trying to create default super admin');

        const hashedPassword = await bcryptjs.hash(
            config.ADMIN_PASSWORD,
            config.BCRYPT_SALT_ROUND
        );

        await User.create({
            name: 'Abrar Yeasir Admin',
            role: ROLE.ADMIN,
            email: config.ADMIN_EMAIL,
            password: hashedPassword,
        });

        console.log('Supper admin created successfully');
    } catch (error) {
        console.log(error);
    }
};
