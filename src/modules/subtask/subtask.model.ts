import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import {TaskStatus} from "../../constants";
import Task from "../task/task.model";

@Table({
  timestamps: true,
  tableName: "Subtasks",
})
export default class SubTask extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: {msg: "Title length between 5 and 30 characters", args: [5, 30]},
    },
  })
  title!: string;

  @Column({
    type: DataType.ENUM(...Object.values(TaskStatus)),
    defaultValue: TaskStatus.IN_PROGRESS,
  })
  status!: keyof typeof TaskStatus;

  @ForeignKey(() => Task)
  @Column({
    type: DataType.INTEGER,
  })
  taskId!: number;

  @BelongsTo(() => Task, {
    onDelete: "CASCADE",
  })
  task!: Task;
}
