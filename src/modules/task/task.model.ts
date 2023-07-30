import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import {TaskStatus} from "../../constants";
import User from "../user/user.model";
import APIError from "../../utils/ApiError";
import {BAD_REQUEST} from "http-status";

@Table({
  timestamps: true,
  tableName: "Tasks",
  paranoid: true,
})
export default class Task extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    // unique: true,
    validate: {
      len: {msg: "Title length between 5 and 50 characters", args: [5, 50]},
      isUniqueForUser: async function (value: string) {
        const task = await Task.findOne({
          where: {
            title: value,
            userId: this.userId,
          },
        });
        if (task) {
          throw new APIError(
            "Task title must be unique for each user",
            BAD_REQUEST
          );
        }
      },
    },
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    validate: {
      len: {msg: "Notes length between 10 and 250 characters", args: [10, 250]},
    },
  })
  notes?: string;

  @Column({
    type: DataType.DATE,
  })
  reminderTime?: string;

  @Column({
    type: DataType.ENUM(...Object.values(TaskStatus)),
    defaultValue: TaskStatus.IN_PROGRESS,
  })
  status!: keyof typeof TaskStatus;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId!: number;

  @BelongsTo(() => User, {
    onDelete: "CASCADE",
  })
  user!: User;
}
