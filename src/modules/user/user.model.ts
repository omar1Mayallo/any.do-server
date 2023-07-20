import bcrypt from "bcrypt";
import {BeforeSave, Column, DataType, Model, Table} from "sequelize-typescript";
import {UserRoles} from "../../constants";

@Table({
  timestamps: true,
  tableName: "Users",
})
export default class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: {msg: "Username length between 3, 30 characters", args: [3, 30]},
    },
  })
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {isEmail: true},
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: {msg: "Password length between 8, 25 characters", args: [8, 25]},
    },
  })
  password!: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRoles)),
    defaultValue: UserRoles.USER,
  })
  role!: keyof typeof UserRoles;

  //______________________________________________________________//
  // As Middlewares Before Save Any User Instance To The Table
  @BeforeSave
  static async hashPassword(instance: User) {
    if (instance.changed("password")) {
      const hashedPassword = await bcrypt.hash(instance.password, 10);
      instance.password = hashedPassword;
    }
  }

  // Methods
  async isCorrectPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
