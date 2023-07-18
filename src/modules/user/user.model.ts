import {Column, DataType, Model, Table, BeforeSave} from "sequelize-typescript";
import bcrypt from "bcrypt";

@Table({
  timestamps: true,
  tableName: "Users",
})
export class User extends Model {
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
