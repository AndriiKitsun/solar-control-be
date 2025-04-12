import {
  Repository,
  FindManyOptions,
  InsertResult,
  ObjectId,
  FindOptionsWhere,
  UpdateResult,
  QueryRunner,
  EntityManager,
  FindOneOptions,
  DeleteResult,
} from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { SaveOptions } from 'typeorm/repository/SaveOptions';

type MockedRepository<Entity extends ObjectLiteral> = Pick<
  Repository<Entity>,
  'insert' | 'find' | 'findOneOrFail' | 'update' | 'save' | 'manager' | 'delete'
>;

export class RepositoryMock<Entity extends ObjectLiteral>
  implements MockedRepository<Entity>
{
  static readonly affectedUpdateResultMock = {
    affected: 1,
  } as UpdateResult;
  static readonly affectedDeleteResultMock = {
    affected: 1,
  } as DeleteResult;

  manager = {
    connection: {
      queryResultCache: {
        async remove(
          identifiers: string[],
          queryRunner?: QueryRunner,
        ): Promise<void> {},
      },
    },
  } as EntityManager;

  async find(options: FindManyOptions<Entity> | undefined): Promise<Entity[]> {
    return [];
  }

  async findOneOrFail(options: FindOneOptions<Entity>): Promise<Entity> {
    return {} as Entity;
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

  async delete(
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
  ): Promise<DeleteResult> {
    return {} as DeleteResult;
  }
}
