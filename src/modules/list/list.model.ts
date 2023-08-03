import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import Task from "../task/task.model";

@Table({
  timestamps: true,
  tableName: "Lists",
})
export default class List extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: {msg: "name length between 5 and 30 characters", args: [5, 30]},
    },
  })
  name!: string;

  @HasMany(() => Task) // Define the association with Task
  tasks?: Task[];
}
