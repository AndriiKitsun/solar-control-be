import {
  Repository,
  FindManyOptions,
  InsertResult,
  ObjectId,
  FindOptionsWhere,
  UpdateResult,
} from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

type MockedRepository<T extends ObjectLiteral> = Pick<
  Repository<T>,
  'insert' | 'find' | 'update'
>;

export class RepositoryMock<T extends ObjectLiteral>
  implements MockedRepository<T>
{
  async find(options: FindManyOptions<T> | undefined): Promise<T[]> {
    return [];
  }

  async insert(
    entity: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
  ): Promise<InsertResult> {
    return {} as InsertResult;
  }

  async update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    return {} as UpdateResult;
  }
}
