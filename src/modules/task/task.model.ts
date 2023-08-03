import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import {TaskStatus} from "../../constants";
import User from "../user/user.model";
import APIError from "../../utils/ApiError";
import {BAD_REQUEST} from "http-status";
import Tag from "../tag/tag.model";
import List from "../list/list.model";
import SubTask from "../subtask/subtask.model";

@Table({
  timestamps: true,
  tableName: "Tasks",
  paranoid: true,
})
export default class Task extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
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

  //__________USER_RELATION__________//

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId!: number;

  @BelongsTo(() => User, {
    onDelete: "CASCADE",
  })
  user!: User;

  //__________TAG_RELATION__________//

  @ForeignKey(() => Tag) // Define the foreign key in the Tasks table referencing the Tag table
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: null,
  })
  tagId?: number | null;

  @BelongsTo(() => Tag)
  tag?: Tag;

  //__________SUBTASK_RELATION__________//

  @HasMany(() => SubTask) // Define the association with Task
  subtasks?: SubTask[];

  //__________LIST_RELATION__________//

  @ForeignKey(() => List) // Define the foreign key in the Tasks table referencing the List table
  @Column({
    type: DataType.INTEGER,
    allowNull: true, // Allow null to make the association optional
  })
  listId?: number;

  @BelongsTo(() => List)
  list?: List; // Use "list?" to make the association optional
}
