import {Column, DataType, Model, Table} from "sequelize-typescript";
import APIError from "../../utils/ApiError";
import {BAD_REQUEST} from "http-status";

// regular expression to validate the color format (hexadecimal format like >> #000000)
const colorFormatRegex = /^#[0-9a-fA-F]{6}$/;

@Table({
  timestamps: true,
  tableName: "Tags",
})
export default class Tag extends Model {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    validate: {
      len: {msg: "Name length between 5 and 30 characters", args: [5, 30]},
    },
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "#ffffff",
    validate: {
      isColor(value: string) {
        if (!value.match(colorFormatRegex)) {
          throw new APIError(
            "Invalid color format. Please provide a valid hexadecimal color (e.g., #RRGGBB)",
            BAD_REQUEST
          );
        }
      },
    },
  })
  color?: string;
}
