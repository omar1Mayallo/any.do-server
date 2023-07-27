import {Op} from "sequelize";

export interface Pagination {
  currentPage?: number;
  numOfItemsPerPage?: number;
  numOfPages?: number;
  nextPage?: number;
  previousPage?: number;
}

export const filterQuery = (query: any) => {
  const queryObject = {...query};
  // EXCLUDE To Use Them For Filtering, Sorting, Limit_Fields, Pagination
  const excludesFields = ["sort", "page", "limit", "fields"];
  excludesFields.forEach((field) => delete queryObject[field]);

  // Build the filter query
  const filterQuery: any = {};
  Object.keys(queryObject).forEach((key) => {
    const value = queryObject[key];

    // Check if the filter value uses a special operator("gt", "lt", "gte", "lte")
    // For Example : if this endpoint >> {{URL}}/users?role=ADMIN&age_gt=18&age_lt=30
    // I Need To reach to this {where: { role: 'ADMIN', age: { [Op.gt]: '18', [Op.lt]: '30' }}}
    const operator = ["gt", "lt", "gte", "lte"].find((op) =>
      key.includes(`_${op}`)
    );
    if (operator) {
      const realKey = key.split(`_${operator}`)[0];
      const opType =
        operator === "gt"
          ? Op.gt
          : operator === "lt"
          ? Op.lt
          : operator === "gte"
          ? Op.gte
          : Op.lte;
      filterQuery[realKey] = {
        ...filterQuery[realKey],
        [opType]: value,
      };
    } else {
      filterQuery[key] = value;
    }
  });
  // console.log(filterQuery);

  return filterQuery;
};

export default class APIFeatures {
  public paginationStatus!: Pagination;

  constructor(private query: any) {}

  // 1) Filtering
  filter() {
    return filterQuery(this.query);
  }

  // 2) Sorting
  sort(): [string, string][] {
    if (!this.query.sort) {
      // Default sort by -createdAt
      return [["createdAt", "DESC"]];
    } else {
      let sortArr: [string, string][] = [];
      const sortFields = this.query.sort.split(",");
      sortFields.forEach((sortField: string) => {
        const direction = sortField.startsWith("-") ? "DESC" : "ASC";
        const field = sortField.substring(1);
        sortArr.push([field, direction]);
      });
      return sortArr;
    }
  }

  // 3) Limit Fields
  limitFields() {
    return this.query.fields
      ? (this.query.fields as string).split(",")
      : undefined;
  }

  // 4) Pagination
  paginate(totalNumOfDocs: number) {
    const page = this.query.page * 1 || 1;
    const limit = this.query.limit * 1 || 10;
    const offset = (page - 1) * limit;

    let pagination: Pagination = {};
    pagination.currentPage = page;
    pagination.numOfItemsPerPage = limit;
    pagination.numOfPages = Math.ceil(totalNumOfDocs / limit);

    // Q: when nextPage is exist?
    const lastItemIdxInPage = page * limit;
    if (lastItemIdxInPage < totalNumOfDocs) {
      pagination.nextPage = page + 1;
    }
    // Q: when previousPage is exist?
    if (offset > 0) {
      pagination.previousPage = page - 1;
    }

    this.paginationStatus = pagination;

    return {limit, offset};
  }
}
