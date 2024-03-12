import { SelectQueryBuilder } from 'typeorm';

/**
 * Interface for the paginate options
 */
export interface PaginateOptions {
  /**
   * The amount of items to return
   */
  limit: number;
  /**
   * The current page
   */
  currentPage: number;
  /**
   * Flag to include the total of items
   */
  total?: boolean;
}

/**
 * Interface for the pagination result with type T for the data because it can be any type
 */
export interface PaginationResult<T> {
  /**
   * The first item the data
   */
  firstItem: number;
  /**
   * The last item of the data
   */
  lastItem: number;
  /**
   * The next page of the pagination
   */
  nextPage?: number;
  /**
   * The limit of pages to show
   */
  totalPages?: number;
  /**
   * The limit of items per page
   */
  limit: number;
  /**
   * The total of items
   */
  total?: number;
  /**
   * The data of the current page
   */
  data: T[];
}

export async function paginate<T>(
  qb: SelectQueryBuilder<T>,
  options: PaginateOptions = {
    limit: 10,
    currentPage: 1,
  },
): Promise<PaginationResult<T>> {
  const offset = (options.currentPage - 1) * options.limit; // number of the records to start from

  const data = await qb.limit(options.limit).offset(offset).getMany();

  const total = options.total ? await qb.getCount() : null;
  const totalPages = total ? Math.ceil(total / options.limit) : null;
  const nextPage =
    totalPages && options.currentPage < totalPages
      ? Number(options.currentPage) + 1
      : null;

  return {
    firstItem: offset + 1,
    lastItem: offset + data.length,
    totalPages,
    nextPage,
    limit: options.limit,
    total: options.total ? await qb.getCount() : null,
    data,
  };
}
