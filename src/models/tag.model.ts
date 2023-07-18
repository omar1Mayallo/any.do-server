import {
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "tags",
})
export class Tag extends Model {
  @Column
  name!: string;
}
