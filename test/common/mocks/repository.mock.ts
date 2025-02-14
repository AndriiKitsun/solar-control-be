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
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { SaveOptions } from 'typeorm/repository/SaveOptions';

type MockedRepository<Entity extends ObjectLiteral> = Pick<
  Repository<Entity>,
  'insert' | 'find' | 'update' | 'save'
>;

export class RepositoryMock<Entity extends ObjectLiteral>
  implements MockedRepository<Entity>
{
  async find(options: FindManyOptions<Entity> | undefined): Promise<Entity[]> {
    return [];
  }

  async insert(
    entity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[],
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
      | FindOptionsWhere<Entity>,
    partialEntity: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult> {
    return {} as UpdateResult;
  }

  async save<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions,
  ): Promise<T & Entity> {
    return {} as T & Entity;
  }
}
