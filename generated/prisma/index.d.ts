
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Match
 * 
 */
export type Match = $Result.DefaultSelection<Prisma.$MatchPayload>
/**
 * Model MatchPrediction
 * 
 */
export type MatchPrediction = $Result.DefaultSelection<Prisma.$MatchPredictionPayload>
/**
 * Model TournamentPrediction
 * 
 */
export type TournamentPrediction = $Result.DefaultSelection<Prisma.$TournamentPredictionPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.match`: Exposes CRUD operations for the **Match** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Matches
    * const matches = await prisma.match.findMany()
    * ```
    */
  get match(): Prisma.MatchDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.matchPrediction`: Exposes CRUD operations for the **MatchPrediction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MatchPredictions
    * const matchPredictions = await prisma.matchPrediction.findMany()
    * ```
    */
  get matchPrediction(): Prisma.MatchPredictionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tournamentPrediction`: Exposes CRUD operations for the **TournamentPrediction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TournamentPredictions
    * const tournamentPredictions = await prisma.tournamentPrediction.findMany()
    * ```
    */
  get tournamentPrediction(): Prisma.TournamentPredictionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.17.1
   * Query Engine version: 272a37d34178c2894197e17273bf937f25acdeac
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Match: 'Match',
    MatchPrediction: 'MatchPrediction',
    TournamentPrediction: 'TournamentPrediction'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "match" | "matchPrediction" | "tournamentPrediction"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Match: {
        payload: Prisma.$MatchPayload<ExtArgs>
        fields: Prisma.MatchFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MatchFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MatchFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          findFirst: {
            args: Prisma.MatchFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MatchFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          findMany: {
            args: Prisma.MatchFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          create: {
            args: Prisma.MatchCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          createMany: {
            args: Prisma.MatchCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MatchCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          delete: {
            args: Prisma.MatchDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          update: {
            args: Prisma.MatchUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          deleteMany: {
            args: Prisma.MatchDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MatchUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MatchUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          upsert: {
            args: Prisma.MatchUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          aggregate: {
            args: Prisma.MatchAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMatch>
          }
          groupBy: {
            args: Prisma.MatchGroupByArgs<ExtArgs>
            result: $Utils.Optional<MatchGroupByOutputType>[]
          }
          count: {
            args: Prisma.MatchCountArgs<ExtArgs>
            result: $Utils.Optional<MatchCountAggregateOutputType> | number
          }
        }
      }
      MatchPrediction: {
        payload: Prisma.$MatchPredictionPayload<ExtArgs>
        fields: Prisma.MatchPredictionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MatchPredictionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPredictionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MatchPredictionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPredictionPayload>
          }
          findFirst: {
            args: Prisma.MatchPredictionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPredictionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MatchPredictionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPredictionPayload>
          }
          findMany: {
            args: Prisma.MatchPredictionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPredictionPayload>[]
          }
          create: {
            args: Prisma.MatchPredictionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPredictionPayload>
          }
          createMany: {
            args: Prisma.MatchPredictionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MatchPredictionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPredictionPayload>[]
          }
          delete: {
            args: Prisma.MatchPredictionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPredictionPayload>
          }
          update: {
            args: Prisma.MatchPredictionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPredictionPayload>
          }
          deleteMany: {
            args: Prisma.MatchPredictionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MatchPredictionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MatchPredictionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPredictionPayload>[]
          }
          upsert: {
            args: Prisma.MatchPredictionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPredictionPayload>
          }
          aggregate: {
            args: Prisma.MatchPredictionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMatchPrediction>
          }
          groupBy: {
            args: Prisma.MatchPredictionGroupByArgs<ExtArgs>
            result: $Utils.Optional<MatchPredictionGroupByOutputType>[]
          }
          count: {
            args: Prisma.MatchPredictionCountArgs<ExtArgs>
            result: $Utils.Optional<MatchPredictionCountAggregateOutputType> | number
          }
        }
      }
      TournamentPrediction: {
        payload: Prisma.$TournamentPredictionPayload<ExtArgs>
        fields: Prisma.TournamentPredictionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TournamentPredictionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPredictionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TournamentPredictionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPredictionPayload>
          }
          findFirst: {
            args: Prisma.TournamentPredictionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPredictionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TournamentPredictionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPredictionPayload>
          }
          findMany: {
            args: Prisma.TournamentPredictionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPredictionPayload>[]
          }
          create: {
            args: Prisma.TournamentPredictionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPredictionPayload>
          }
          createMany: {
            args: Prisma.TournamentPredictionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TournamentPredictionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPredictionPayload>[]
          }
          delete: {
            args: Prisma.TournamentPredictionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPredictionPayload>
          }
          update: {
            args: Prisma.TournamentPredictionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPredictionPayload>
          }
          deleteMany: {
            args: Prisma.TournamentPredictionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TournamentPredictionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TournamentPredictionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPredictionPayload>[]
          }
          upsert: {
            args: Prisma.TournamentPredictionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPredictionPayload>
          }
          aggregate: {
            args: Prisma.TournamentPredictionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTournamentPrediction>
          }
          groupBy: {
            args: Prisma.TournamentPredictionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TournamentPredictionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TournamentPredictionCountArgs<ExtArgs>
            result: $Utils.Optional<TournamentPredictionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    match?: MatchOmit
    matchPrediction?: MatchPredictionOmit
    tournamentPrediction?: TournamentPredictionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    matchPredictions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    matchPredictions?: boolean | UserCountOutputTypeCountMatchPredictionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMatchPredictionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchPredictionWhereInput
  }


  /**
   * Count Type MatchCountOutputType
   */

  export type MatchCountOutputType = {
    predictions: number
  }

  export type MatchCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    predictions?: boolean | MatchCountOutputTypeCountPredictionsArgs
  }

  // Custom InputTypes
  /**
   * MatchCountOutputType without action
   */
  export type MatchCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchCountOutputType
     */
    select?: MatchCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MatchCountOutputType without action
   */
  export type MatchCountOutputTypeCountPredictionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchPredictionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    displayName: string | null
    passwordHash: string | null
    isAdmin: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    displayName: string | null
    passwordHash: string | null
    isAdmin: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    displayName: number
    passwordHash: number
    isAdmin: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    displayName?: true
    passwordHash?: true
    isAdmin?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    displayName?: true
    passwordHash?: true
    isAdmin?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    displayName?: true
    passwordHash?: true
    isAdmin?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    displayName: string
    passwordHash: string
    isAdmin: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    displayName?: boolean
    passwordHash?: boolean
    isAdmin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    matchPredictions?: boolean | User$matchPredictionsArgs<ExtArgs>
    tournamentPrediction?: boolean | User$tournamentPredictionArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    displayName?: boolean
    passwordHash?: boolean
    isAdmin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    displayName?: boolean
    passwordHash?: boolean
    isAdmin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    displayName?: boolean
    passwordHash?: boolean
    isAdmin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "displayName" | "passwordHash" | "isAdmin" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    matchPredictions?: boolean | User$matchPredictionsArgs<ExtArgs>
    tournamentPrediction?: boolean | User$tournamentPredictionArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      matchPredictions: Prisma.$MatchPredictionPayload<ExtArgs>[]
      tournamentPrediction: Prisma.$TournamentPredictionPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      displayName: string
      passwordHash: string
      isAdmin: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    matchPredictions<T extends User$matchPredictionsArgs<ExtArgs> = {}>(args?: Subset<T, User$matchPredictionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPredictionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tournamentPrediction<T extends User$tournamentPredictionArgs<ExtArgs> = {}>(args?: Subset<T, User$tournamentPredictionArgs<ExtArgs>>): Prisma__TournamentPredictionClient<$Result.GetResult<Prisma.$TournamentPredictionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly displayName: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly isAdmin: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.matchPredictions
   */
  export type User$matchPredictionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchPrediction
     */
    select?: MatchPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchPrediction
     */
    omit?: MatchPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchPredictionInclude<ExtArgs> | null
    where?: MatchPredictionWhereInput
    orderBy?: MatchPredictionOrderByWithRelationInput | MatchPredictionOrderByWithRelationInput[]
    cursor?: MatchPredictionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchPredictionScalarFieldEnum | MatchPredictionScalarFieldEnum[]
  }

  /**
   * User.tournamentPrediction
   */
  export type User$tournamentPredictionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentPrediction
     */
    select?: TournamentPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TournamentPrediction
     */
    omit?: TournamentPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentPredictionInclude<ExtArgs> | null
    where?: TournamentPredictionWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Match
   */

  export type AggregateMatch = {
    _count: MatchCountAggregateOutputType | null
    _avg: MatchAvgAggregateOutputType | null
    _sum: MatchSumAggregateOutputType | null
    _min: MatchMinAggregateOutputType | null
    _max: MatchMaxAggregateOutputType | null
  }

  export type MatchAvgAggregateOutputType = {
    id: number | null
    finalHomeScore: number | null
    finalAwayScore: number | null
    finalYellowCards: number | null
    finalTotalCorners: number | null
    finalRedCards: number | null
  }

  export type MatchSumAggregateOutputType = {
    id: number | null
    finalHomeScore: number | null
    finalAwayScore: number | null
    finalYellowCards: number | null
    finalTotalCorners: number | null
    finalRedCards: number | null
  }

  export type MatchMinAggregateOutputType = {
    id: number | null
    stage: string | null
    kickoff: Date | null
    venue: string | null
    homeTeam: string | null
    awayTeam: string | null
    isLocked: boolean | null
    finalHomeScore: number | null
    finalAwayScore: number | null
    finalYellowCards: number | null
    finalTotalCorners: number | null
    finalRedCards: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MatchMaxAggregateOutputType = {
    id: number | null
    stage: string | null
    kickoff: Date | null
    venue: string | null
    homeTeam: string | null
    awayTeam: string | null
    isLocked: boolean | null
    finalHomeScore: number | null
    finalAwayScore: number | null
    finalYellowCards: number | null
    finalTotalCorners: number | null
    finalRedCards: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MatchCountAggregateOutputType = {
    id: number
    stage: number
    kickoff: number
    venue: number
    homeTeam: number
    awayTeam: number
    isLocked: number
    finalHomeScore: number
    finalAwayScore: number
    finalYellowCards: number
    finalTotalCorners: number
    finalRedCards: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MatchAvgAggregateInputType = {
    id?: true
    finalHomeScore?: true
    finalAwayScore?: true
    finalYellowCards?: true
    finalTotalCorners?: true
    finalRedCards?: true
  }

  export type MatchSumAggregateInputType = {
    id?: true
    finalHomeScore?: true
    finalAwayScore?: true
    finalYellowCards?: true
    finalTotalCorners?: true
    finalRedCards?: true
  }

  export type MatchMinAggregateInputType = {
    id?: true
    stage?: true
    kickoff?: true
    venue?: true
    homeTeam?: true
    awayTeam?: true
    isLocked?: true
    finalHomeScore?: true
    finalAwayScore?: true
    finalYellowCards?: true
    finalTotalCorners?: true
    finalRedCards?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MatchMaxAggregateInputType = {
    id?: true
    stage?: true
    kickoff?: true
    venue?: true
    homeTeam?: true
    awayTeam?: true
    isLocked?: true
    finalHomeScore?: true
    finalAwayScore?: true
    finalYellowCards?: true
    finalTotalCorners?: true
    finalRedCards?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MatchCountAggregateInputType = {
    id?: true
    stage?: true
    kickoff?: true
    venue?: true
    homeTeam?: true
    awayTeam?: true
    isLocked?: true
    finalHomeScore?: true
    finalAwayScore?: true
    finalYellowCards?: true
    finalTotalCorners?: true
    finalRedCards?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MatchAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Match to aggregate.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Matches
    **/
    _count?: true | MatchCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MatchAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MatchSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MatchMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MatchMaxAggregateInputType
  }

  export type GetMatchAggregateType<T extends MatchAggregateArgs> = {
        [P in keyof T & keyof AggregateMatch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMatch[P]>
      : GetScalarType<T[P], AggregateMatch[P]>
  }




  export type MatchGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithAggregationInput | MatchOrderByWithAggregationInput[]
    by: MatchScalarFieldEnum[] | MatchScalarFieldEnum
    having?: MatchScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MatchCountAggregateInputType | true
    _avg?: MatchAvgAggregateInputType
    _sum?: MatchSumAggregateInputType
    _min?: MatchMinAggregateInputType
    _max?: MatchMaxAggregateInputType
  }

  export type MatchGroupByOutputType = {
    id: number
    stage: string
    kickoff: Date
    venue: string
    homeTeam: string
    awayTeam: string
    isLocked: boolean
    finalHomeScore: number | null
    finalAwayScore: number | null
    finalYellowCards: number | null
    finalTotalCorners: number | null
    finalRedCards: number | null
    createdAt: Date
    updatedAt: Date
    _count: MatchCountAggregateOutputType | null
    _avg: MatchAvgAggregateOutputType | null
    _sum: MatchSumAggregateOutputType | null
    _min: MatchMinAggregateOutputType | null
    _max: MatchMaxAggregateOutputType | null
  }

  type GetMatchGroupByPayload<T extends MatchGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MatchGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MatchGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MatchGroupByOutputType[P]>
            : GetScalarType<T[P], MatchGroupByOutputType[P]>
        }
      >
    >


  export type MatchSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    stage?: boolean
    kickoff?: boolean
    venue?: boolean
    homeTeam?: boolean
    awayTeam?: boolean
    isLocked?: boolean
    finalHomeScore?: boolean
    finalAwayScore?: boolean
    finalYellowCards?: boolean
    finalTotalCorners?: boolean
    finalRedCards?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    predictions?: boolean | Match$predictionsArgs<ExtArgs>
    _count?: boolean | MatchCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["match"]>

  export type MatchSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    stage?: boolean
    kickoff?: boolean
    venue?: boolean
    homeTeam?: boolean
    awayTeam?: boolean
    isLocked?: boolean
    finalHomeScore?: boolean
    finalAwayScore?: boolean
    finalYellowCards?: boolean
    finalTotalCorners?: boolean
    finalRedCards?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["match"]>

  export type MatchSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    stage?: boolean
    kickoff?: boolean
    venue?: boolean
    homeTeam?: boolean
    awayTeam?: boolean
    isLocked?: boolean
    finalHomeScore?: boolean
    finalAwayScore?: boolean
    finalYellowCards?: boolean
    finalTotalCorners?: boolean
    finalRedCards?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["match"]>

  export type MatchSelectScalar = {
    id?: boolean
    stage?: boolean
    kickoff?: boolean
    venue?: boolean
    homeTeam?: boolean
    awayTeam?: boolean
    isLocked?: boolean
    finalHomeScore?: boolean
    finalAwayScore?: boolean
    finalYellowCards?: boolean
    finalTotalCorners?: boolean
    finalRedCards?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MatchOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "stage" | "kickoff" | "venue" | "homeTeam" | "awayTeam" | "isLocked" | "finalHomeScore" | "finalAwayScore" | "finalYellowCards" | "finalTotalCorners" | "finalRedCards" | "createdAt" | "updatedAt", ExtArgs["result"]["match"]>
  export type MatchInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    predictions?: boolean | Match$predictionsArgs<ExtArgs>
    _count?: boolean | MatchCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MatchIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MatchIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MatchPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Match"
    objects: {
      predictions: Prisma.$MatchPredictionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      stage: string
      kickoff: Date
      venue: string
      homeTeam: string
      awayTeam: string
      isLocked: boolean
      finalHomeScore: number | null
      finalAwayScore: number | null
      finalYellowCards: number | null
      finalTotalCorners: number | null
      finalRedCards: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["match"]>
    composites: {}
  }

  type MatchGetPayload<S extends boolean | null | undefined | MatchDefaultArgs> = $Result.GetResult<Prisma.$MatchPayload, S>

  type MatchCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MatchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MatchCountAggregateInputType | true
    }

  export interface MatchDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Match'], meta: { name: 'Match' } }
    /**
     * Find zero or one Match that matches the filter.
     * @param {MatchFindUniqueArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchFindUniqueArgs>(args: SelectSubset<T, MatchFindUniqueArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Match that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchFindUniqueOrThrowArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchFindUniqueOrThrowArgs>(args: SelectSubset<T, MatchFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Match that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindFirstArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchFindFirstArgs>(args?: SelectSubset<T, MatchFindFirstArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Match that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindFirstOrThrowArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchFindFirstOrThrowArgs>(args?: SelectSubset<T, MatchFindFirstOrThrowArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Matches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Matches
     * const matches = await prisma.match.findMany()
     * 
     * // Get first 10 Matches
     * const matches = await prisma.match.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const matchWithIdOnly = await prisma.match.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MatchFindManyArgs>(args?: SelectSubset<T, MatchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Match.
     * @param {MatchCreateArgs} args - Arguments to create a Match.
     * @example
     * // Create one Match
     * const Match = await prisma.match.create({
     *   data: {
     *     // ... data to create a Match
     *   }
     * })
     * 
     */
    create<T extends MatchCreateArgs>(args: SelectSubset<T, MatchCreateArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Matches.
     * @param {MatchCreateManyArgs} args - Arguments to create many Matches.
     * @example
     * // Create many Matches
     * const match = await prisma.match.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MatchCreateManyArgs>(args?: SelectSubset<T, MatchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Matches and returns the data saved in the database.
     * @param {MatchCreateManyAndReturnArgs} args - Arguments to create many Matches.
     * @example
     * // Create many Matches
     * const match = await prisma.match.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Matches and only return the `id`
     * const matchWithIdOnly = await prisma.match.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MatchCreateManyAndReturnArgs>(args?: SelectSubset<T, MatchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Match.
     * @param {MatchDeleteArgs} args - Arguments to delete one Match.
     * @example
     * // Delete one Match
     * const Match = await prisma.match.delete({
     *   where: {
     *     // ... filter to delete one Match
     *   }
     * })
     * 
     */
    delete<T extends MatchDeleteArgs>(args: SelectSubset<T, MatchDeleteArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Match.
     * @param {MatchUpdateArgs} args - Arguments to update one Match.
     * @example
     * // Update one Match
     * const match = await prisma.match.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MatchUpdateArgs>(args: SelectSubset<T, MatchUpdateArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Matches.
     * @param {MatchDeleteManyArgs} args - Arguments to filter Matches to delete.
     * @example
     * // Delete a few Matches
     * const { count } = await prisma.match.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MatchDeleteManyArgs>(args?: SelectSubset<T, MatchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Matches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Matches
     * const match = await prisma.match.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MatchUpdateManyArgs>(args: SelectSubset<T, MatchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Matches and returns the data updated in the database.
     * @param {MatchUpdateManyAndReturnArgs} args - Arguments to update many Matches.
     * @example
     * // Update many Matches
     * const match = await prisma.match.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Matches and only return the `id`
     * const matchWithIdOnly = await prisma.match.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MatchUpdateManyAndReturnArgs>(args: SelectSubset<T, MatchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Match.
     * @param {MatchUpsertArgs} args - Arguments to update or create a Match.
     * @example
     * // Update or create a Match
     * const match = await prisma.match.upsert({
     *   create: {
     *     // ... data to create a Match
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Match we want to update
     *   }
     * })
     */
    upsert<T extends MatchUpsertArgs>(args: SelectSubset<T, MatchUpsertArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Matches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchCountArgs} args - Arguments to filter Matches to count.
     * @example
     * // Count the number of Matches
     * const count = await prisma.match.count({
     *   where: {
     *     // ... the filter for the Matches we want to count
     *   }
     * })
    **/
    count<T extends MatchCountArgs>(
      args?: Subset<T, MatchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MatchCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Match.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MatchAggregateArgs>(args: Subset<T, MatchAggregateArgs>): Prisma.PrismaPromise<GetMatchAggregateType<T>>

    /**
     * Group by Match.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MatchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MatchGroupByArgs['orderBy'] }
        : { orderBy?: MatchGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MatchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Match model
   */
  readonly fields: MatchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Match.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MatchClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    predictions<T extends Match$predictionsArgs<ExtArgs> = {}>(args?: Subset<T, Match$predictionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPredictionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Match model
   */
  interface MatchFieldRefs {
    readonly id: FieldRef<"Match", 'Int'>
    readonly stage: FieldRef<"Match", 'String'>
    readonly kickoff: FieldRef<"Match", 'DateTime'>
    readonly venue: FieldRef<"Match", 'String'>
    readonly homeTeam: FieldRef<"Match", 'String'>
    readonly awayTeam: FieldRef<"Match", 'String'>
    readonly isLocked: FieldRef<"Match", 'Boolean'>
    readonly finalHomeScore: FieldRef<"Match", 'Int'>
    readonly finalAwayScore: FieldRef<"Match", 'Int'>
    readonly finalYellowCards: FieldRef<"Match", 'Int'>
    readonly finalTotalCorners: FieldRef<"Match", 'Int'>
    readonly finalRedCards: FieldRef<"Match", 'Int'>
    readonly createdAt: FieldRef<"Match", 'DateTime'>
    readonly updatedAt: FieldRef<"Match", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Match findUnique
   */
  export type MatchFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match findUniqueOrThrow
   */
  export type MatchFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match findFirst
   */
  export type MatchFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Matches.
     */
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match findFirstOrThrow
   */
  export type MatchFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Matches.
     */
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match findMany
   */
  export type MatchFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Matches to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match create
   */
  export type MatchCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The data needed to create a Match.
     */
    data: XOR<MatchCreateInput, MatchUncheckedCreateInput>
  }

  /**
   * Match createMany
   */
  export type MatchCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Matches.
     */
    data: MatchCreateManyInput | MatchCreateManyInput[]
  }

  /**
   * Match createManyAndReturn
   */
  export type MatchCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * The data used to create many Matches.
     */
    data: MatchCreateManyInput | MatchCreateManyInput[]
  }

  /**
   * Match update
   */
  export type MatchUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The data needed to update a Match.
     */
    data: XOR<MatchUpdateInput, MatchUncheckedUpdateInput>
    /**
     * Choose, which Match to update.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match updateMany
   */
  export type MatchUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Matches.
     */
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyInput>
    /**
     * Filter which Matches to update
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to update.
     */
    limit?: number
  }

  /**
   * Match updateManyAndReturn
   */
  export type MatchUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * The data used to update Matches.
     */
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyInput>
    /**
     * Filter which Matches to update
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to update.
     */
    limit?: number
  }

  /**
   * Match upsert
   */
  export type MatchUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The filter to search for the Match to update in case it exists.
     */
    where: MatchWhereUniqueInput
    /**
     * In case the Match found by the `where` argument doesn't exist, create a new Match with this data.
     */
    create: XOR<MatchCreateInput, MatchUncheckedCreateInput>
    /**
     * In case the Match was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MatchUpdateInput, MatchUncheckedUpdateInput>
  }

  /**
   * Match delete
   */
  export type MatchDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter which Match to delete.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match deleteMany
   */
  export type MatchDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Matches to delete
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to delete.
     */
    limit?: number
  }

  /**
   * Match.predictions
   */
  export type Match$predictionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchPrediction
     */
    select?: MatchPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchPrediction
     */
    omit?: MatchPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchPredictionInclude<ExtArgs> | null
    where?: MatchPredictionWhereInput
    orderBy?: MatchPredictionOrderByWithRelationInput | MatchPredictionOrderByWithRelationInput[]
    cursor?: MatchPredictionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchPredictionScalarFieldEnum | MatchPredictionScalarFieldEnum[]
  }

  /**
   * Match without action
   */
  export type MatchDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
  }


  /**
   * Model MatchPrediction
   */

  export type AggregateMatchPrediction = {
    _count: MatchPredictionCountAggregateOutputType | null
    _avg: MatchPredictionAvgAggregateOutputType | null
    _sum: MatchPredictionSumAggregateOutputType | null
    _min: MatchPredictionMinAggregateOutputType | null
    _max: MatchPredictionMaxAggregateOutputType | null
  }

  export type MatchPredictionAvgAggregateOutputType = {
    matchId: number | null
    homeScore: number | null
    awayScore: number | null
  }

  export type MatchPredictionSumAggregateOutputType = {
    matchId: number | null
    homeScore: number | null
    awayScore: number | null
  }

  export type MatchPredictionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    matchId: number | null
    winner: string | null
    homeScore: number | null
    awayScore: number | null
    totalGoalsLine: string | null
    totalCornersLine: string | null
    yellowCardsLine: string | null
    redCardsLine: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MatchPredictionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    matchId: number | null
    winner: string | null
    homeScore: number | null
    awayScore: number | null
    totalGoalsLine: string | null
    totalCornersLine: string | null
    yellowCardsLine: string | null
    redCardsLine: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MatchPredictionCountAggregateOutputType = {
    id: number
    userId: number
    matchId: number
    winner: number
    homeScore: number
    awayScore: number
    totalGoalsLine: number
    totalCornersLine: number
    yellowCardsLine: number
    redCardsLine: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MatchPredictionAvgAggregateInputType = {
    matchId?: true
    homeScore?: true
    awayScore?: true
  }

  export type MatchPredictionSumAggregateInputType = {
    matchId?: true
    homeScore?: true
    awayScore?: true
  }

  export type MatchPredictionMinAggregateInputType = {
    id?: true
    userId?: true
    matchId?: true
    winner?: true
    homeScore?: true
    awayScore?: true
    totalGoalsLine?: true
    totalCornersLine?: true
    yellowCardsLine?: true
    redCardsLine?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MatchPredictionMaxAggregateInputType = {
    id?: true
    userId?: true
    matchId?: true
    winner?: true
    homeScore?: true
    awayScore?: true
    totalGoalsLine?: true
    totalCornersLine?: true
    yellowCardsLine?: true
    redCardsLine?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MatchPredictionCountAggregateInputType = {
    id?: true
    userId?: true
    matchId?: true
    winner?: true
    homeScore?: true
    awayScore?: true
    totalGoalsLine?: true
    totalCornersLine?: true
    yellowCardsLine?: true
    redCardsLine?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MatchPredictionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MatchPrediction to aggregate.
     */
    where?: MatchPredictionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchPredictions to fetch.
     */
    orderBy?: MatchPredictionOrderByWithRelationInput | MatchPredictionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MatchPredictionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchPredictions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchPredictions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MatchPredictions
    **/
    _count?: true | MatchPredictionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MatchPredictionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MatchPredictionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MatchPredictionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MatchPredictionMaxAggregateInputType
  }

  export type GetMatchPredictionAggregateType<T extends MatchPredictionAggregateArgs> = {
        [P in keyof T & keyof AggregateMatchPrediction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMatchPrediction[P]>
      : GetScalarType<T[P], AggregateMatchPrediction[P]>
  }




  export type MatchPredictionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchPredictionWhereInput
    orderBy?: MatchPredictionOrderByWithAggregationInput | MatchPredictionOrderByWithAggregationInput[]
    by: MatchPredictionScalarFieldEnum[] | MatchPredictionScalarFieldEnum
    having?: MatchPredictionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MatchPredictionCountAggregateInputType | true
    _avg?: MatchPredictionAvgAggregateInputType
    _sum?: MatchPredictionSumAggregateInputType
    _min?: MatchPredictionMinAggregateInputType
    _max?: MatchPredictionMaxAggregateInputType
  }

  export type MatchPredictionGroupByOutputType = {
    id: string
    userId: string
    matchId: number
    winner: string
    homeScore: number | null
    awayScore: number | null
    totalGoalsLine: string
    totalCornersLine: string
    yellowCardsLine: string
    redCardsLine: string
    createdAt: Date
    updatedAt: Date
    _count: MatchPredictionCountAggregateOutputType | null
    _avg: MatchPredictionAvgAggregateOutputType | null
    _sum: MatchPredictionSumAggregateOutputType | null
    _min: MatchPredictionMinAggregateOutputType | null
    _max: MatchPredictionMaxAggregateOutputType | null
  }

  type GetMatchPredictionGroupByPayload<T extends MatchPredictionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MatchPredictionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MatchPredictionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MatchPredictionGroupByOutputType[P]>
            : GetScalarType<T[P], MatchPredictionGroupByOutputType[P]>
        }
      >
    >


  export type MatchPredictionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    matchId?: boolean
    winner?: boolean
    homeScore?: boolean
    awayScore?: boolean
    totalGoalsLine?: boolean
    totalCornersLine?: boolean
    yellowCardsLine?: boolean
    redCardsLine?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    match?: boolean | MatchDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matchPrediction"]>

  export type MatchPredictionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    matchId?: boolean
    winner?: boolean
    homeScore?: boolean
    awayScore?: boolean
    totalGoalsLine?: boolean
    totalCornersLine?: boolean
    yellowCardsLine?: boolean
    redCardsLine?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    match?: boolean | MatchDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matchPrediction"]>

  export type MatchPredictionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    matchId?: boolean
    winner?: boolean
    homeScore?: boolean
    awayScore?: boolean
    totalGoalsLine?: boolean
    totalCornersLine?: boolean
    yellowCardsLine?: boolean
    redCardsLine?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    match?: boolean | MatchDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matchPrediction"]>

  export type MatchPredictionSelectScalar = {
    id?: boolean
    userId?: boolean
    matchId?: boolean
    winner?: boolean
    homeScore?: boolean
    awayScore?: boolean
    totalGoalsLine?: boolean
    totalCornersLine?: boolean
    yellowCardsLine?: boolean
    redCardsLine?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MatchPredictionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "matchId" | "winner" | "homeScore" | "awayScore" | "totalGoalsLine" | "totalCornersLine" | "yellowCardsLine" | "redCardsLine" | "createdAt" | "updatedAt", ExtArgs["result"]["matchPrediction"]>
  export type MatchPredictionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MatchPredictionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MatchPredictionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MatchPredictionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MatchPrediction"
    objects: {
      match: Prisma.$MatchPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      matchId: number
      winner: string
      homeScore: number | null
      awayScore: number | null
      totalGoalsLine: string
      totalCornersLine: string
      yellowCardsLine: string
      redCardsLine: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["matchPrediction"]>
    composites: {}
  }

  type MatchPredictionGetPayload<S extends boolean | null | undefined | MatchPredictionDefaultArgs> = $Result.GetResult<Prisma.$MatchPredictionPayload, S>

  type MatchPredictionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MatchPredictionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MatchPredictionCountAggregateInputType | true
    }

  export interface MatchPredictionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MatchPrediction'], meta: { name: 'MatchPrediction' } }
    /**
     * Find zero or one MatchPrediction that matches the filter.
     * @param {MatchPredictionFindUniqueArgs} args - Arguments to find a MatchPrediction
     * @example
     * // Get one MatchPrediction
     * const matchPrediction = await prisma.matchPrediction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchPredictionFindUniqueArgs>(args: SelectSubset<T, MatchPredictionFindUniqueArgs<ExtArgs>>): Prisma__MatchPredictionClient<$Result.GetResult<Prisma.$MatchPredictionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MatchPrediction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchPredictionFindUniqueOrThrowArgs} args - Arguments to find a MatchPrediction
     * @example
     * // Get one MatchPrediction
     * const matchPrediction = await prisma.matchPrediction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchPredictionFindUniqueOrThrowArgs>(args: SelectSubset<T, MatchPredictionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MatchPredictionClient<$Result.GetResult<Prisma.$MatchPredictionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MatchPrediction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchPredictionFindFirstArgs} args - Arguments to find a MatchPrediction
     * @example
     * // Get one MatchPrediction
     * const matchPrediction = await prisma.matchPrediction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchPredictionFindFirstArgs>(args?: SelectSubset<T, MatchPredictionFindFirstArgs<ExtArgs>>): Prisma__MatchPredictionClient<$Result.GetResult<Prisma.$MatchPredictionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MatchPrediction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchPredictionFindFirstOrThrowArgs} args - Arguments to find a MatchPrediction
     * @example
     * // Get one MatchPrediction
     * const matchPrediction = await prisma.matchPrediction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchPredictionFindFirstOrThrowArgs>(args?: SelectSubset<T, MatchPredictionFindFirstOrThrowArgs<ExtArgs>>): Prisma__MatchPredictionClient<$Result.GetResult<Prisma.$MatchPredictionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MatchPredictions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchPredictionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MatchPredictions
     * const matchPredictions = await prisma.matchPrediction.findMany()
     * 
     * // Get first 10 MatchPredictions
     * const matchPredictions = await prisma.matchPrediction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const matchPredictionWithIdOnly = await prisma.matchPrediction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MatchPredictionFindManyArgs>(args?: SelectSubset<T, MatchPredictionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPredictionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MatchPrediction.
     * @param {MatchPredictionCreateArgs} args - Arguments to create a MatchPrediction.
     * @example
     * // Create one MatchPrediction
     * const MatchPrediction = await prisma.matchPrediction.create({
     *   data: {
     *     // ... data to create a MatchPrediction
     *   }
     * })
     * 
     */
    create<T extends MatchPredictionCreateArgs>(args: SelectSubset<T, MatchPredictionCreateArgs<ExtArgs>>): Prisma__MatchPredictionClient<$Result.GetResult<Prisma.$MatchPredictionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MatchPredictions.
     * @param {MatchPredictionCreateManyArgs} args - Arguments to create many MatchPredictions.
     * @example
     * // Create many MatchPredictions
     * const matchPrediction = await prisma.matchPrediction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MatchPredictionCreateManyArgs>(args?: SelectSubset<T, MatchPredictionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MatchPredictions and returns the data saved in the database.
     * @param {MatchPredictionCreateManyAndReturnArgs} args - Arguments to create many MatchPredictions.
     * @example
     * // Create many MatchPredictions
     * const matchPrediction = await prisma.matchPrediction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MatchPredictions and only return the `id`
     * const matchPredictionWithIdOnly = await prisma.matchPrediction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MatchPredictionCreateManyAndReturnArgs>(args?: SelectSubset<T, MatchPredictionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPredictionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MatchPrediction.
     * @param {MatchPredictionDeleteArgs} args - Arguments to delete one MatchPrediction.
     * @example
     * // Delete one MatchPrediction
     * const MatchPrediction = await prisma.matchPrediction.delete({
     *   where: {
     *     // ... filter to delete one MatchPrediction
     *   }
     * })
     * 
     */
    delete<T extends MatchPredictionDeleteArgs>(args: SelectSubset<T, MatchPredictionDeleteArgs<ExtArgs>>): Prisma__MatchPredictionClient<$Result.GetResult<Prisma.$MatchPredictionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MatchPrediction.
     * @param {MatchPredictionUpdateArgs} args - Arguments to update one MatchPrediction.
     * @example
     * // Update one MatchPrediction
     * const matchPrediction = await prisma.matchPrediction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MatchPredictionUpdateArgs>(args: SelectSubset<T, MatchPredictionUpdateArgs<ExtArgs>>): Prisma__MatchPredictionClient<$Result.GetResult<Prisma.$MatchPredictionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MatchPredictions.
     * @param {MatchPredictionDeleteManyArgs} args - Arguments to filter MatchPredictions to delete.
     * @example
     * // Delete a few MatchPredictions
     * const { count } = await prisma.matchPrediction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MatchPredictionDeleteManyArgs>(args?: SelectSubset<T, MatchPredictionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MatchPredictions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchPredictionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MatchPredictions
     * const matchPrediction = await prisma.matchPrediction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MatchPredictionUpdateManyArgs>(args: SelectSubset<T, MatchPredictionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MatchPredictions and returns the data updated in the database.
     * @param {MatchPredictionUpdateManyAndReturnArgs} args - Arguments to update many MatchPredictions.
     * @example
     * // Update many MatchPredictions
     * const matchPrediction = await prisma.matchPrediction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MatchPredictions and only return the `id`
     * const matchPredictionWithIdOnly = await prisma.matchPrediction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MatchPredictionUpdateManyAndReturnArgs>(args: SelectSubset<T, MatchPredictionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPredictionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MatchPrediction.
     * @param {MatchPredictionUpsertArgs} args - Arguments to update or create a MatchPrediction.
     * @example
     * // Update or create a MatchPrediction
     * const matchPrediction = await prisma.matchPrediction.upsert({
     *   create: {
     *     // ... data to create a MatchPrediction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MatchPrediction we want to update
     *   }
     * })
     */
    upsert<T extends MatchPredictionUpsertArgs>(args: SelectSubset<T, MatchPredictionUpsertArgs<ExtArgs>>): Prisma__MatchPredictionClient<$Result.GetResult<Prisma.$MatchPredictionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MatchPredictions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchPredictionCountArgs} args - Arguments to filter MatchPredictions to count.
     * @example
     * // Count the number of MatchPredictions
     * const count = await prisma.matchPrediction.count({
     *   where: {
     *     // ... the filter for the MatchPredictions we want to count
     *   }
     * })
    **/
    count<T extends MatchPredictionCountArgs>(
      args?: Subset<T, MatchPredictionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MatchPredictionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MatchPrediction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchPredictionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MatchPredictionAggregateArgs>(args: Subset<T, MatchPredictionAggregateArgs>): Prisma.PrismaPromise<GetMatchPredictionAggregateType<T>>

    /**
     * Group by MatchPrediction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchPredictionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MatchPredictionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MatchPredictionGroupByArgs['orderBy'] }
        : { orderBy?: MatchPredictionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MatchPredictionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchPredictionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MatchPrediction model
   */
  readonly fields: MatchPredictionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MatchPrediction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MatchPredictionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    match<T extends MatchDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MatchDefaultArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MatchPrediction model
   */
  interface MatchPredictionFieldRefs {
    readonly id: FieldRef<"MatchPrediction", 'String'>
    readonly userId: FieldRef<"MatchPrediction", 'String'>
    readonly matchId: FieldRef<"MatchPrediction", 'Int'>
    readonly winner: FieldRef<"MatchPrediction", 'String'>
    readonly homeScore: FieldRef<"MatchPrediction", 'Int'>
    readonly awayScore: FieldRef<"MatchPrediction", 'Int'>
    readonly totalGoalsLine: FieldRef<"MatchPrediction", 'String'>
    readonly totalCornersLine: FieldRef<"MatchPrediction", 'String'>
    readonly yellowCardsLine: FieldRef<"MatchPrediction", 'String'>
    readonly redCardsLine: FieldRef<"MatchPrediction", 'String'>
    readonly createdAt: FieldRef<"MatchPrediction", 'DateTime'>
    readonly updatedAt: FieldRef<"MatchPrediction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MatchPrediction findUnique
   */
  export type MatchPredictionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchPrediction
     */
    select?: MatchPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchPrediction
     */
    omit?: MatchPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchPredictionInclude<ExtArgs> | null
    /**
     * Filter, which MatchPrediction to fetch.
     */
    where: MatchPredictionWhereUniqueInput
  }

  /**
   * MatchPrediction findUniqueOrThrow
   */
  export type MatchPredictionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchPrediction
     */
    select?: MatchPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchPrediction
     */
    omit?: MatchPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchPredictionInclude<ExtArgs> | null
    /**
     * Filter, which MatchPrediction to fetch.
     */
    where: MatchPredictionWhereUniqueInput
  }

  /**
   * MatchPrediction findFirst
   */
  export type MatchPredictionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchPrediction
     */
    select?: MatchPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchPrediction
     */
    omit?: MatchPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchPredictionInclude<ExtArgs> | null
    /**
     * Filter, which MatchPrediction to fetch.
     */
    where?: MatchPredictionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchPredictions to fetch.
     */
    orderBy?: MatchPredictionOrderByWithRelationInput | MatchPredictionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MatchPredictions.
     */
    cursor?: MatchPredictionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchPredictions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchPredictions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MatchPredictions.
     */
    distinct?: MatchPredictionScalarFieldEnum | MatchPredictionScalarFieldEnum[]
  }

  /**
   * MatchPrediction findFirstOrThrow
   */
  export type MatchPredictionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchPrediction
     */
    select?: MatchPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchPrediction
     */
    omit?: MatchPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchPredictionInclude<ExtArgs> | null
    /**
     * Filter, which MatchPrediction to fetch.
     */
    where?: MatchPredictionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchPredictions to fetch.
     */
    orderBy?: MatchPredictionOrderByWithRelationInput | MatchPredictionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MatchPredictions.
     */
    cursor?: MatchPredictionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchPredictions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchPredictions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MatchPredictions.
     */
    distinct?: MatchPredictionScalarFieldEnum | MatchPredictionScalarFieldEnum[]
  }

  /**
   * MatchPrediction findMany
   */
  export type MatchPredictionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchPrediction
     */
    select?: MatchPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchPrediction
     */
    omit?: MatchPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchPredictionInclude<ExtArgs> | null
    /**
     * Filter, which MatchPredictions to fetch.
     */
    where?: MatchPredictionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchPredictions to fetch.
     */
    orderBy?: MatchPredictionOrderByWithRelationInput | MatchPredictionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MatchPredictions.
     */
    cursor?: MatchPredictionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchPredictions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchPredictions.
     */
    skip?: number
    distinct?: MatchPredictionScalarFieldEnum | MatchPredictionScalarFieldEnum[]
  }

  /**
   * MatchPrediction create
   */
  export type MatchPredictionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchPrediction
     */
    select?: MatchPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchPrediction
     */
    omit?: MatchPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchPredictionInclude<ExtArgs> | null
    /**
     * The data needed to create a MatchPrediction.
     */
    data: XOR<MatchPredictionCreateInput, MatchPredictionUncheckedCreateInput>
  }

  /**
   * MatchPrediction createMany
   */
  export type MatchPredictionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MatchPredictions.
     */
    data: MatchPredictionCreateManyInput | MatchPredictionCreateManyInput[]
  }

  /**
   * MatchPrediction createManyAndReturn
   */
  export type MatchPredictionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchPrediction
     */
    select?: MatchPredictionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MatchPrediction
     */
    omit?: MatchPredictionOmit<ExtArgs> | null
    /**
     * The data used to create many MatchPredictions.
     */
    data: MatchPredictionCreateManyInput | MatchPredictionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchPredictionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MatchPrediction update
   */
  export type MatchPredictionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchPrediction
     */
    select?: MatchPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchPrediction
     */
    omit?: MatchPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchPredictionInclude<ExtArgs> | null
    /**
     * The data needed to update a MatchPrediction.
     */
    data: XOR<MatchPredictionUpdateInput, MatchPredictionUncheckedUpdateInput>
    /**
     * Choose, which MatchPrediction to update.
     */
    where: MatchPredictionWhereUniqueInput
  }

  /**
   * MatchPrediction updateMany
   */
  export type MatchPredictionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MatchPredictions.
     */
    data: XOR<MatchPredictionUpdateManyMutationInput, MatchPredictionUncheckedUpdateManyInput>
    /**
     * Filter which MatchPredictions to update
     */
    where?: MatchPredictionWhereInput
    /**
     * Limit how many MatchPredictions to update.
     */
    limit?: number
  }

  /**
   * MatchPrediction updateManyAndReturn
   */
  export type MatchPredictionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchPrediction
     */
    select?: MatchPredictionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MatchPrediction
     */
    omit?: MatchPredictionOmit<ExtArgs> | null
    /**
     * The data used to update MatchPredictions.
     */
    data: XOR<MatchPredictionUpdateManyMutationInput, MatchPredictionUncheckedUpdateManyInput>
    /**
     * Filter which MatchPredictions to update
     */
    where?: MatchPredictionWhereInput
    /**
     * Limit how many MatchPredictions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchPredictionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MatchPrediction upsert
   */
  export type MatchPredictionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchPrediction
     */
    select?: MatchPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchPrediction
     */
    omit?: MatchPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchPredictionInclude<ExtArgs> | null
    /**
     * The filter to search for the MatchPrediction to update in case it exists.
     */
    where: MatchPredictionWhereUniqueInput
    /**
     * In case the MatchPrediction found by the `where` argument doesn't exist, create a new MatchPrediction with this data.
     */
    create: XOR<MatchPredictionCreateInput, MatchPredictionUncheckedCreateInput>
    /**
     * In case the MatchPrediction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MatchPredictionUpdateInput, MatchPredictionUncheckedUpdateInput>
  }

  /**
   * MatchPrediction delete
   */
  export type MatchPredictionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchPrediction
     */
    select?: MatchPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchPrediction
     */
    omit?: MatchPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchPredictionInclude<ExtArgs> | null
    /**
     * Filter which MatchPrediction to delete.
     */
    where: MatchPredictionWhereUniqueInput
  }

  /**
   * MatchPrediction deleteMany
   */
  export type MatchPredictionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MatchPredictions to delete
     */
    where?: MatchPredictionWhereInput
    /**
     * Limit how many MatchPredictions to delete.
     */
    limit?: number
  }

  /**
   * MatchPrediction without action
   */
  export type MatchPredictionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchPrediction
     */
    select?: MatchPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchPrediction
     */
    omit?: MatchPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchPredictionInclude<ExtArgs> | null
  }


  /**
   * Model TournamentPrediction
   */

  export type AggregateTournamentPrediction = {
    _count: TournamentPredictionCountAggregateOutputType | null
    _min: TournamentPredictionMinAggregateOutputType | null
    _max: TournamentPredictionMaxAggregateOutputType | null
  }

  export type TournamentPredictionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    champion: string | null
    runnerUp: string | null
    goldenBoot: string | null
    bestYoungPlayer: string | null
    groupWinners: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TournamentPredictionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    champion: string | null
    runnerUp: string | null
    goldenBoot: string | null
    bestYoungPlayer: string | null
    groupWinners: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TournamentPredictionCountAggregateOutputType = {
    id: number
    userId: number
    champion: number
    runnerUp: number
    goldenBoot: number
    bestYoungPlayer: number
    groupWinners: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TournamentPredictionMinAggregateInputType = {
    id?: true
    userId?: true
    champion?: true
    runnerUp?: true
    goldenBoot?: true
    bestYoungPlayer?: true
    groupWinners?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TournamentPredictionMaxAggregateInputType = {
    id?: true
    userId?: true
    champion?: true
    runnerUp?: true
    goldenBoot?: true
    bestYoungPlayer?: true
    groupWinners?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TournamentPredictionCountAggregateInputType = {
    id?: true
    userId?: true
    champion?: true
    runnerUp?: true
    goldenBoot?: true
    bestYoungPlayer?: true
    groupWinners?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TournamentPredictionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TournamentPrediction to aggregate.
     */
    where?: TournamentPredictionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TournamentPredictions to fetch.
     */
    orderBy?: TournamentPredictionOrderByWithRelationInput | TournamentPredictionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TournamentPredictionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TournamentPredictions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TournamentPredictions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TournamentPredictions
    **/
    _count?: true | TournamentPredictionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TournamentPredictionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TournamentPredictionMaxAggregateInputType
  }

  export type GetTournamentPredictionAggregateType<T extends TournamentPredictionAggregateArgs> = {
        [P in keyof T & keyof AggregateTournamentPrediction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTournamentPrediction[P]>
      : GetScalarType<T[P], AggregateTournamentPrediction[P]>
  }




  export type TournamentPredictionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TournamentPredictionWhereInput
    orderBy?: TournamentPredictionOrderByWithAggregationInput | TournamentPredictionOrderByWithAggregationInput[]
    by: TournamentPredictionScalarFieldEnum[] | TournamentPredictionScalarFieldEnum
    having?: TournamentPredictionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TournamentPredictionCountAggregateInputType | true
    _min?: TournamentPredictionMinAggregateInputType
    _max?: TournamentPredictionMaxAggregateInputType
  }

  export type TournamentPredictionGroupByOutputType = {
    id: string
    userId: string
    champion: string | null
    runnerUp: string | null
    goldenBoot: string | null
    bestYoungPlayer: string | null
    groupWinners: string
    createdAt: Date
    updatedAt: Date
    _count: TournamentPredictionCountAggregateOutputType | null
    _min: TournamentPredictionMinAggregateOutputType | null
    _max: TournamentPredictionMaxAggregateOutputType | null
  }

  type GetTournamentPredictionGroupByPayload<T extends TournamentPredictionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TournamentPredictionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TournamentPredictionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TournamentPredictionGroupByOutputType[P]>
            : GetScalarType<T[P], TournamentPredictionGroupByOutputType[P]>
        }
      >
    >


  export type TournamentPredictionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    champion?: boolean
    runnerUp?: boolean
    goldenBoot?: boolean
    bestYoungPlayer?: boolean
    groupWinners?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tournamentPrediction"]>

  export type TournamentPredictionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    champion?: boolean
    runnerUp?: boolean
    goldenBoot?: boolean
    bestYoungPlayer?: boolean
    groupWinners?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tournamentPrediction"]>

  export type TournamentPredictionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    champion?: boolean
    runnerUp?: boolean
    goldenBoot?: boolean
    bestYoungPlayer?: boolean
    groupWinners?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tournamentPrediction"]>

  export type TournamentPredictionSelectScalar = {
    id?: boolean
    userId?: boolean
    champion?: boolean
    runnerUp?: boolean
    goldenBoot?: boolean
    bestYoungPlayer?: boolean
    groupWinners?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TournamentPredictionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "champion" | "runnerUp" | "goldenBoot" | "bestYoungPlayer" | "groupWinners" | "createdAt" | "updatedAt", ExtArgs["result"]["tournamentPrediction"]>
  export type TournamentPredictionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TournamentPredictionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TournamentPredictionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TournamentPredictionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TournamentPrediction"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      champion: string | null
      runnerUp: string | null
      goldenBoot: string | null
      bestYoungPlayer: string | null
      groupWinners: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tournamentPrediction"]>
    composites: {}
  }

  type TournamentPredictionGetPayload<S extends boolean | null | undefined | TournamentPredictionDefaultArgs> = $Result.GetResult<Prisma.$TournamentPredictionPayload, S>

  type TournamentPredictionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TournamentPredictionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TournamentPredictionCountAggregateInputType | true
    }

  export interface TournamentPredictionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TournamentPrediction'], meta: { name: 'TournamentPrediction' } }
    /**
     * Find zero or one TournamentPrediction that matches the filter.
     * @param {TournamentPredictionFindUniqueArgs} args - Arguments to find a TournamentPrediction
     * @example
     * // Get one TournamentPrediction
     * const tournamentPrediction = await prisma.tournamentPrediction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TournamentPredictionFindUniqueArgs>(args: SelectSubset<T, TournamentPredictionFindUniqueArgs<ExtArgs>>): Prisma__TournamentPredictionClient<$Result.GetResult<Prisma.$TournamentPredictionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TournamentPrediction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TournamentPredictionFindUniqueOrThrowArgs} args - Arguments to find a TournamentPrediction
     * @example
     * // Get one TournamentPrediction
     * const tournamentPrediction = await prisma.tournamentPrediction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TournamentPredictionFindUniqueOrThrowArgs>(args: SelectSubset<T, TournamentPredictionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TournamentPredictionClient<$Result.GetResult<Prisma.$TournamentPredictionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TournamentPrediction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentPredictionFindFirstArgs} args - Arguments to find a TournamentPrediction
     * @example
     * // Get one TournamentPrediction
     * const tournamentPrediction = await prisma.tournamentPrediction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TournamentPredictionFindFirstArgs>(args?: SelectSubset<T, TournamentPredictionFindFirstArgs<ExtArgs>>): Prisma__TournamentPredictionClient<$Result.GetResult<Prisma.$TournamentPredictionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TournamentPrediction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentPredictionFindFirstOrThrowArgs} args - Arguments to find a TournamentPrediction
     * @example
     * // Get one TournamentPrediction
     * const tournamentPrediction = await prisma.tournamentPrediction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TournamentPredictionFindFirstOrThrowArgs>(args?: SelectSubset<T, TournamentPredictionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TournamentPredictionClient<$Result.GetResult<Prisma.$TournamentPredictionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TournamentPredictions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentPredictionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TournamentPredictions
     * const tournamentPredictions = await prisma.tournamentPrediction.findMany()
     * 
     * // Get first 10 TournamentPredictions
     * const tournamentPredictions = await prisma.tournamentPrediction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tournamentPredictionWithIdOnly = await prisma.tournamentPrediction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TournamentPredictionFindManyArgs>(args?: SelectSubset<T, TournamentPredictionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TournamentPredictionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TournamentPrediction.
     * @param {TournamentPredictionCreateArgs} args - Arguments to create a TournamentPrediction.
     * @example
     * // Create one TournamentPrediction
     * const TournamentPrediction = await prisma.tournamentPrediction.create({
     *   data: {
     *     // ... data to create a TournamentPrediction
     *   }
     * })
     * 
     */
    create<T extends TournamentPredictionCreateArgs>(args: SelectSubset<T, TournamentPredictionCreateArgs<ExtArgs>>): Prisma__TournamentPredictionClient<$Result.GetResult<Prisma.$TournamentPredictionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TournamentPredictions.
     * @param {TournamentPredictionCreateManyArgs} args - Arguments to create many TournamentPredictions.
     * @example
     * // Create many TournamentPredictions
     * const tournamentPrediction = await prisma.tournamentPrediction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TournamentPredictionCreateManyArgs>(args?: SelectSubset<T, TournamentPredictionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TournamentPredictions and returns the data saved in the database.
     * @param {TournamentPredictionCreateManyAndReturnArgs} args - Arguments to create many TournamentPredictions.
     * @example
     * // Create many TournamentPredictions
     * const tournamentPrediction = await prisma.tournamentPrediction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TournamentPredictions and only return the `id`
     * const tournamentPredictionWithIdOnly = await prisma.tournamentPrediction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TournamentPredictionCreateManyAndReturnArgs>(args?: SelectSubset<T, TournamentPredictionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TournamentPredictionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TournamentPrediction.
     * @param {TournamentPredictionDeleteArgs} args - Arguments to delete one TournamentPrediction.
     * @example
     * // Delete one TournamentPrediction
     * const TournamentPrediction = await prisma.tournamentPrediction.delete({
     *   where: {
     *     // ... filter to delete one TournamentPrediction
     *   }
     * })
     * 
     */
    delete<T extends TournamentPredictionDeleteArgs>(args: SelectSubset<T, TournamentPredictionDeleteArgs<ExtArgs>>): Prisma__TournamentPredictionClient<$Result.GetResult<Prisma.$TournamentPredictionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TournamentPrediction.
     * @param {TournamentPredictionUpdateArgs} args - Arguments to update one TournamentPrediction.
     * @example
     * // Update one TournamentPrediction
     * const tournamentPrediction = await prisma.tournamentPrediction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TournamentPredictionUpdateArgs>(args: SelectSubset<T, TournamentPredictionUpdateArgs<ExtArgs>>): Prisma__TournamentPredictionClient<$Result.GetResult<Prisma.$TournamentPredictionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TournamentPredictions.
     * @param {TournamentPredictionDeleteManyArgs} args - Arguments to filter TournamentPredictions to delete.
     * @example
     * // Delete a few TournamentPredictions
     * const { count } = await prisma.tournamentPrediction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TournamentPredictionDeleteManyArgs>(args?: SelectSubset<T, TournamentPredictionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TournamentPredictions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentPredictionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TournamentPredictions
     * const tournamentPrediction = await prisma.tournamentPrediction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TournamentPredictionUpdateManyArgs>(args: SelectSubset<T, TournamentPredictionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TournamentPredictions and returns the data updated in the database.
     * @param {TournamentPredictionUpdateManyAndReturnArgs} args - Arguments to update many TournamentPredictions.
     * @example
     * // Update many TournamentPredictions
     * const tournamentPrediction = await prisma.tournamentPrediction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TournamentPredictions and only return the `id`
     * const tournamentPredictionWithIdOnly = await prisma.tournamentPrediction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TournamentPredictionUpdateManyAndReturnArgs>(args: SelectSubset<T, TournamentPredictionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TournamentPredictionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TournamentPrediction.
     * @param {TournamentPredictionUpsertArgs} args - Arguments to update or create a TournamentPrediction.
     * @example
     * // Update or create a TournamentPrediction
     * const tournamentPrediction = await prisma.tournamentPrediction.upsert({
     *   create: {
     *     // ... data to create a TournamentPrediction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TournamentPrediction we want to update
     *   }
     * })
     */
    upsert<T extends TournamentPredictionUpsertArgs>(args: SelectSubset<T, TournamentPredictionUpsertArgs<ExtArgs>>): Prisma__TournamentPredictionClient<$Result.GetResult<Prisma.$TournamentPredictionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TournamentPredictions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentPredictionCountArgs} args - Arguments to filter TournamentPredictions to count.
     * @example
     * // Count the number of TournamentPredictions
     * const count = await prisma.tournamentPrediction.count({
     *   where: {
     *     // ... the filter for the TournamentPredictions we want to count
     *   }
     * })
    **/
    count<T extends TournamentPredictionCountArgs>(
      args?: Subset<T, TournamentPredictionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TournamentPredictionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TournamentPrediction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentPredictionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TournamentPredictionAggregateArgs>(args: Subset<T, TournamentPredictionAggregateArgs>): Prisma.PrismaPromise<GetTournamentPredictionAggregateType<T>>

    /**
     * Group by TournamentPrediction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentPredictionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TournamentPredictionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TournamentPredictionGroupByArgs['orderBy'] }
        : { orderBy?: TournamentPredictionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TournamentPredictionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTournamentPredictionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TournamentPrediction model
   */
  readonly fields: TournamentPredictionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TournamentPrediction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TournamentPredictionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TournamentPrediction model
   */
  interface TournamentPredictionFieldRefs {
    readonly id: FieldRef<"TournamentPrediction", 'String'>
    readonly userId: FieldRef<"TournamentPrediction", 'String'>
    readonly champion: FieldRef<"TournamentPrediction", 'String'>
    readonly runnerUp: FieldRef<"TournamentPrediction", 'String'>
    readonly goldenBoot: FieldRef<"TournamentPrediction", 'String'>
    readonly bestYoungPlayer: FieldRef<"TournamentPrediction", 'String'>
    readonly groupWinners: FieldRef<"TournamentPrediction", 'String'>
    readonly createdAt: FieldRef<"TournamentPrediction", 'DateTime'>
    readonly updatedAt: FieldRef<"TournamentPrediction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TournamentPrediction findUnique
   */
  export type TournamentPredictionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentPrediction
     */
    select?: TournamentPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TournamentPrediction
     */
    omit?: TournamentPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentPredictionInclude<ExtArgs> | null
    /**
     * Filter, which TournamentPrediction to fetch.
     */
    where: TournamentPredictionWhereUniqueInput
  }

  /**
   * TournamentPrediction findUniqueOrThrow
   */
  export type TournamentPredictionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentPrediction
     */
    select?: TournamentPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TournamentPrediction
     */
    omit?: TournamentPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentPredictionInclude<ExtArgs> | null
    /**
     * Filter, which TournamentPrediction to fetch.
     */
    where: TournamentPredictionWhereUniqueInput
  }

  /**
   * TournamentPrediction findFirst
   */
  export type TournamentPredictionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentPrediction
     */
    select?: TournamentPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TournamentPrediction
     */
    omit?: TournamentPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentPredictionInclude<ExtArgs> | null
    /**
     * Filter, which TournamentPrediction to fetch.
     */
    where?: TournamentPredictionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TournamentPredictions to fetch.
     */
    orderBy?: TournamentPredictionOrderByWithRelationInput | TournamentPredictionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TournamentPredictions.
     */
    cursor?: TournamentPredictionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TournamentPredictions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TournamentPredictions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TournamentPredictions.
     */
    distinct?: TournamentPredictionScalarFieldEnum | TournamentPredictionScalarFieldEnum[]
  }

  /**
   * TournamentPrediction findFirstOrThrow
   */
  export type TournamentPredictionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentPrediction
     */
    select?: TournamentPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TournamentPrediction
     */
    omit?: TournamentPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentPredictionInclude<ExtArgs> | null
    /**
     * Filter, which TournamentPrediction to fetch.
     */
    where?: TournamentPredictionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TournamentPredictions to fetch.
     */
    orderBy?: TournamentPredictionOrderByWithRelationInput | TournamentPredictionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TournamentPredictions.
     */
    cursor?: TournamentPredictionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TournamentPredictions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TournamentPredictions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TournamentPredictions.
     */
    distinct?: TournamentPredictionScalarFieldEnum | TournamentPredictionScalarFieldEnum[]
  }

  /**
   * TournamentPrediction findMany
   */
  export type TournamentPredictionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentPrediction
     */
    select?: TournamentPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TournamentPrediction
     */
    omit?: TournamentPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentPredictionInclude<ExtArgs> | null
    /**
     * Filter, which TournamentPredictions to fetch.
     */
    where?: TournamentPredictionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TournamentPredictions to fetch.
     */
    orderBy?: TournamentPredictionOrderByWithRelationInput | TournamentPredictionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TournamentPredictions.
     */
    cursor?: TournamentPredictionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TournamentPredictions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TournamentPredictions.
     */
    skip?: number
    distinct?: TournamentPredictionScalarFieldEnum | TournamentPredictionScalarFieldEnum[]
  }

  /**
   * TournamentPrediction create
   */
  export type TournamentPredictionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentPrediction
     */
    select?: TournamentPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TournamentPrediction
     */
    omit?: TournamentPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentPredictionInclude<ExtArgs> | null
    /**
     * The data needed to create a TournamentPrediction.
     */
    data: XOR<TournamentPredictionCreateInput, TournamentPredictionUncheckedCreateInput>
  }

  /**
   * TournamentPrediction createMany
   */
  export type TournamentPredictionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TournamentPredictions.
     */
    data: TournamentPredictionCreateManyInput | TournamentPredictionCreateManyInput[]
  }

  /**
   * TournamentPrediction createManyAndReturn
   */
  export type TournamentPredictionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentPrediction
     */
    select?: TournamentPredictionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TournamentPrediction
     */
    omit?: TournamentPredictionOmit<ExtArgs> | null
    /**
     * The data used to create many TournamentPredictions.
     */
    data: TournamentPredictionCreateManyInput | TournamentPredictionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentPredictionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TournamentPrediction update
   */
  export type TournamentPredictionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentPrediction
     */
    select?: TournamentPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TournamentPrediction
     */
    omit?: TournamentPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentPredictionInclude<ExtArgs> | null
    /**
     * The data needed to update a TournamentPrediction.
     */
    data: XOR<TournamentPredictionUpdateInput, TournamentPredictionUncheckedUpdateInput>
    /**
     * Choose, which TournamentPrediction to update.
     */
    where: TournamentPredictionWhereUniqueInput
  }

  /**
   * TournamentPrediction updateMany
   */
  export type TournamentPredictionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TournamentPredictions.
     */
    data: XOR<TournamentPredictionUpdateManyMutationInput, TournamentPredictionUncheckedUpdateManyInput>
    /**
     * Filter which TournamentPredictions to update
     */
    where?: TournamentPredictionWhereInput
    /**
     * Limit how many TournamentPredictions to update.
     */
    limit?: number
  }

  /**
   * TournamentPrediction updateManyAndReturn
   */
  export type TournamentPredictionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentPrediction
     */
    select?: TournamentPredictionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TournamentPrediction
     */
    omit?: TournamentPredictionOmit<ExtArgs> | null
    /**
     * The data used to update TournamentPredictions.
     */
    data: XOR<TournamentPredictionUpdateManyMutationInput, TournamentPredictionUncheckedUpdateManyInput>
    /**
     * Filter which TournamentPredictions to update
     */
    where?: TournamentPredictionWhereInput
    /**
     * Limit how many TournamentPredictions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentPredictionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TournamentPrediction upsert
   */
  export type TournamentPredictionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentPrediction
     */
    select?: TournamentPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TournamentPrediction
     */
    omit?: TournamentPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentPredictionInclude<ExtArgs> | null
    /**
     * The filter to search for the TournamentPrediction to update in case it exists.
     */
    where: TournamentPredictionWhereUniqueInput
    /**
     * In case the TournamentPrediction found by the `where` argument doesn't exist, create a new TournamentPrediction with this data.
     */
    create: XOR<TournamentPredictionCreateInput, TournamentPredictionUncheckedCreateInput>
    /**
     * In case the TournamentPrediction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TournamentPredictionUpdateInput, TournamentPredictionUncheckedUpdateInput>
  }

  /**
   * TournamentPrediction delete
   */
  export type TournamentPredictionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentPrediction
     */
    select?: TournamentPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TournamentPrediction
     */
    omit?: TournamentPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentPredictionInclude<ExtArgs> | null
    /**
     * Filter which TournamentPrediction to delete.
     */
    where: TournamentPredictionWhereUniqueInput
  }

  /**
   * TournamentPrediction deleteMany
   */
  export type TournamentPredictionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TournamentPredictions to delete
     */
    where?: TournamentPredictionWhereInput
    /**
     * Limit how many TournamentPredictions to delete.
     */
    limit?: number
  }

  /**
   * TournamentPrediction without action
   */
  export type TournamentPredictionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentPrediction
     */
    select?: TournamentPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TournamentPrediction
     */
    omit?: TournamentPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentPredictionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    displayName: 'displayName',
    passwordHash: 'passwordHash',
    isAdmin: 'isAdmin',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const MatchScalarFieldEnum: {
    id: 'id',
    stage: 'stage',
    kickoff: 'kickoff',
    venue: 'venue',
    homeTeam: 'homeTeam',
    awayTeam: 'awayTeam',
    isLocked: 'isLocked',
    finalHomeScore: 'finalHomeScore',
    finalAwayScore: 'finalAwayScore',
    finalYellowCards: 'finalYellowCards',
    finalTotalCorners: 'finalTotalCorners',
    finalRedCards: 'finalRedCards',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MatchScalarFieldEnum = (typeof MatchScalarFieldEnum)[keyof typeof MatchScalarFieldEnum]


  export const MatchPredictionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    matchId: 'matchId',
    winner: 'winner',
    homeScore: 'homeScore',
    awayScore: 'awayScore',
    totalGoalsLine: 'totalGoalsLine',
    totalCornersLine: 'totalCornersLine',
    yellowCardsLine: 'yellowCardsLine',
    redCardsLine: 'redCardsLine',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MatchPredictionScalarFieldEnum = (typeof MatchPredictionScalarFieldEnum)[keyof typeof MatchPredictionScalarFieldEnum]


  export const TournamentPredictionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    champion: 'champion',
    runnerUp: 'runnerUp',
    goldenBoot: 'goldenBoot',
    bestYoungPlayer: 'bestYoungPlayer',
    groupWinners: 'groupWinners',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TournamentPredictionScalarFieldEnum = (typeof TournamentPredictionScalarFieldEnum)[keyof typeof TournamentPredictionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    displayName?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    isAdmin?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    matchPredictions?: MatchPredictionListRelationFilter
    tournamentPrediction?: XOR<TournamentPredictionNullableScalarRelationFilter, TournamentPredictionWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    displayName?: SortOrder
    passwordHash?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    matchPredictions?: MatchPredictionOrderByRelationAggregateInput
    tournamentPrediction?: TournamentPredictionOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    displayName?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    isAdmin?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    matchPredictions?: MatchPredictionListRelationFilter
    tournamentPrediction?: XOR<TournamentPredictionNullableScalarRelationFilter, TournamentPredictionWhereInput> | null
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    displayName?: SortOrder
    passwordHash?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    displayName?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    isAdmin?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type MatchWhereInput = {
    AND?: MatchWhereInput | MatchWhereInput[]
    OR?: MatchWhereInput[]
    NOT?: MatchWhereInput | MatchWhereInput[]
    id?: IntFilter<"Match"> | number
    stage?: StringFilter<"Match"> | string
    kickoff?: DateTimeFilter<"Match"> | Date | string
    venue?: StringFilter<"Match"> | string
    homeTeam?: StringFilter<"Match"> | string
    awayTeam?: StringFilter<"Match"> | string
    isLocked?: BoolFilter<"Match"> | boolean
    finalHomeScore?: IntNullableFilter<"Match"> | number | null
    finalAwayScore?: IntNullableFilter<"Match"> | number | null
    finalYellowCards?: IntNullableFilter<"Match"> | number | null
    finalTotalCorners?: IntNullableFilter<"Match"> | number | null
    finalRedCards?: IntNullableFilter<"Match"> | number | null
    createdAt?: DateTimeFilter<"Match"> | Date | string
    updatedAt?: DateTimeFilter<"Match"> | Date | string
    predictions?: MatchPredictionListRelationFilter
  }

  export type MatchOrderByWithRelationInput = {
    id?: SortOrder
    stage?: SortOrder
    kickoff?: SortOrder
    venue?: SortOrder
    homeTeam?: SortOrder
    awayTeam?: SortOrder
    isLocked?: SortOrder
    finalHomeScore?: SortOrderInput | SortOrder
    finalAwayScore?: SortOrderInput | SortOrder
    finalYellowCards?: SortOrderInput | SortOrder
    finalTotalCorners?: SortOrderInput | SortOrder
    finalRedCards?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    predictions?: MatchPredictionOrderByRelationAggregateInput
  }

  export type MatchWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: MatchWhereInput | MatchWhereInput[]
    OR?: MatchWhereInput[]
    NOT?: MatchWhereInput | MatchWhereInput[]
    stage?: StringFilter<"Match"> | string
    kickoff?: DateTimeFilter<"Match"> | Date | string
    venue?: StringFilter<"Match"> | string
    homeTeam?: StringFilter<"Match"> | string
    awayTeam?: StringFilter<"Match"> | string
    isLocked?: BoolFilter<"Match"> | boolean
    finalHomeScore?: IntNullableFilter<"Match"> | number | null
    finalAwayScore?: IntNullableFilter<"Match"> | number | null
    finalYellowCards?: IntNullableFilter<"Match"> | number | null
    finalTotalCorners?: IntNullableFilter<"Match"> | number | null
    finalRedCards?: IntNullableFilter<"Match"> | number | null
    createdAt?: DateTimeFilter<"Match"> | Date | string
    updatedAt?: DateTimeFilter<"Match"> | Date | string
    predictions?: MatchPredictionListRelationFilter
  }, "id">

  export type MatchOrderByWithAggregationInput = {
    id?: SortOrder
    stage?: SortOrder
    kickoff?: SortOrder
    venue?: SortOrder
    homeTeam?: SortOrder
    awayTeam?: SortOrder
    isLocked?: SortOrder
    finalHomeScore?: SortOrderInput | SortOrder
    finalAwayScore?: SortOrderInput | SortOrder
    finalYellowCards?: SortOrderInput | SortOrder
    finalTotalCorners?: SortOrderInput | SortOrder
    finalRedCards?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MatchCountOrderByAggregateInput
    _avg?: MatchAvgOrderByAggregateInput
    _max?: MatchMaxOrderByAggregateInput
    _min?: MatchMinOrderByAggregateInput
    _sum?: MatchSumOrderByAggregateInput
  }

  export type MatchScalarWhereWithAggregatesInput = {
    AND?: MatchScalarWhereWithAggregatesInput | MatchScalarWhereWithAggregatesInput[]
    OR?: MatchScalarWhereWithAggregatesInput[]
    NOT?: MatchScalarWhereWithAggregatesInput | MatchScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Match"> | number
    stage?: StringWithAggregatesFilter<"Match"> | string
    kickoff?: DateTimeWithAggregatesFilter<"Match"> | Date | string
    venue?: StringWithAggregatesFilter<"Match"> | string
    homeTeam?: StringWithAggregatesFilter<"Match"> | string
    awayTeam?: StringWithAggregatesFilter<"Match"> | string
    isLocked?: BoolWithAggregatesFilter<"Match"> | boolean
    finalHomeScore?: IntNullableWithAggregatesFilter<"Match"> | number | null
    finalAwayScore?: IntNullableWithAggregatesFilter<"Match"> | number | null
    finalYellowCards?: IntNullableWithAggregatesFilter<"Match"> | number | null
    finalTotalCorners?: IntNullableWithAggregatesFilter<"Match"> | number | null
    finalRedCards?: IntNullableWithAggregatesFilter<"Match"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Match"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Match"> | Date | string
  }

  export type MatchPredictionWhereInput = {
    AND?: MatchPredictionWhereInput | MatchPredictionWhereInput[]
    OR?: MatchPredictionWhereInput[]
    NOT?: MatchPredictionWhereInput | MatchPredictionWhereInput[]
    id?: StringFilter<"MatchPrediction"> | string
    userId?: StringFilter<"MatchPrediction"> | string
    matchId?: IntFilter<"MatchPrediction"> | number
    winner?: StringFilter<"MatchPrediction"> | string
    homeScore?: IntNullableFilter<"MatchPrediction"> | number | null
    awayScore?: IntNullableFilter<"MatchPrediction"> | number | null
    totalGoalsLine?: StringFilter<"MatchPrediction"> | string
    totalCornersLine?: StringFilter<"MatchPrediction"> | string
    yellowCardsLine?: StringFilter<"MatchPrediction"> | string
    redCardsLine?: StringFilter<"MatchPrediction"> | string
    createdAt?: DateTimeFilter<"MatchPrediction"> | Date | string
    updatedAt?: DateTimeFilter<"MatchPrediction"> | Date | string
    match?: XOR<MatchScalarRelationFilter, MatchWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type MatchPredictionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    matchId?: SortOrder
    winner?: SortOrder
    homeScore?: SortOrderInput | SortOrder
    awayScore?: SortOrderInput | SortOrder
    totalGoalsLine?: SortOrder
    totalCornersLine?: SortOrder
    yellowCardsLine?: SortOrder
    redCardsLine?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    match?: MatchOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type MatchPredictionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_matchId?: MatchPredictionUserIdMatchIdCompoundUniqueInput
    AND?: MatchPredictionWhereInput | MatchPredictionWhereInput[]
    OR?: MatchPredictionWhereInput[]
    NOT?: MatchPredictionWhereInput | MatchPredictionWhereInput[]
    userId?: StringFilter<"MatchPrediction"> | string
    matchId?: IntFilter<"MatchPrediction"> | number
    winner?: StringFilter<"MatchPrediction"> | string
    homeScore?: IntNullableFilter<"MatchPrediction"> | number | null
    awayScore?: IntNullableFilter<"MatchPrediction"> | number | null
    totalGoalsLine?: StringFilter<"MatchPrediction"> | string
    totalCornersLine?: StringFilter<"MatchPrediction"> | string
    yellowCardsLine?: StringFilter<"MatchPrediction"> | string
    redCardsLine?: StringFilter<"MatchPrediction"> | string
    createdAt?: DateTimeFilter<"MatchPrediction"> | Date | string
    updatedAt?: DateTimeFilter<"MatchPrediction"> | Date | string
    match?: XOR<MatchScalarRelationFilter, MatchWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId_matchId">

  export type MatchPredictionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    matchId?: SortOrder
    winner?: SortOrder
    homeScore?: SortOrderInput | SortOrder
    awayScore?: SortOrderInput | SortOrder
    totalGoalsLine?: SortOrder
    totalCornersLine?: SortOrder
    yellowCardsLine?: SortOrder
    redCardsLine?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MatchPredictionCountOrderByAggregateInput
    _avg?: MatchPredictionAvgOrderByAggregateInput
    _max?: MatchPredictionMaxOrderByAggregateInput
    _min?: MatchPredictionMinOrderByAggregateInput
    _sum?: MatchPredictionSumOrderByAggregateInput
  }

  export type MatchPredictionScalarWhereWithAggregatesInput = {
    AND?: MatchPredictionScalarWhereWithAggregatesInput | MatchPredictionScalarWhereWithAggregatesInput[]
    OR?: MatchPredictionScalarWhereWithAggregatesInput[]
    NOT?: MatchPredictionScalarWhereWithAggregatesInput | MatchPredictionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MatchPrediction"> | string
    userId?: StringWithAggregatesFilter<"MatchPrediction"> | string
    matchId?: IntWithAggregatesFilter<"MatchPrediction"> | number
    winner?: StringWithAggregatesFilter<"MatchPrediction"> | string
    homeScore?: IntNullableWithAggregatesFilter<"MatchPrediction"> | number | null
    awayScore?: IntNullableWithAggregatesFilter<"MatchPrediction"> | number | null
    totalGoalsLine?: StringWithAggregatesFilter<"MatchPrediction"> | string
    totalCornersLine?: StringWithAggregatesFilter<"MatchPrediction"> | string
    yellowCardsLine?: StringWithAggregatesFilter<"MatchPrediction"> | string
    redCardsLine?: StringWithAggregatesFilter<"MatchPrediction"> | string
    createdAt?: DateTimeWithAggregatesFilter<"MatchPrediction"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MatchPrediction"> | Date | string
  }

  export type TournamentPredictionWhereInput = {
    AND?: TournamentPredictionWhereInput | TournamentPredictionWhereInput[]
    OR?: TournamentPredictionWhereInput[]
    NOT?: TournamentPredictionWhereInput | TournamentPredictionWhereInput[]
    id?: StringFilter<"TournamentPrediction"> | string
    userId?: StringFilter<"TournamentPrediction"> | string
    champion?: StringNullableFilter<"TournamentPrediction"> | string | null
    runnerUp?: StringNullableFilter<"TournamentPrediction"> | string | null
    goldenBoot?: StringNullableFilter<"TournamentPrediction"> | string | null
    bestYoungPlayer?: StringNullableFilter<"TournamentPrediction"> | string | null
    groupWinners?: StringFilter<"TournamentPrediction"> | string
    createdAt?: DateTimeFilter<"TournamentPrediction"> | Date | string
    updatedAt?: DateTimeFilter<"TournamentPrediction"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type TournamentPredictionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    champion?: SortOrderInput | SortOrder
    runnerUp?: SortOrderInput | SortOrder
    goldenBoot?: SortOrderInput | SortOrder
    bestYoungPlayer?: SortOrderInput | SortOrder
    groupWinners?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type TournamentPredictionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: TournamentPredictionWhereInput | TournamentPredictionWhereInput[]
    OR?: TournamentPredictionWhereInput[]
    NOT?: TournamentPredictionWhereInput | TournamentPredictionWhereInput[]
    champion?: StringNullableFilter<"TournamentPrediction"> | string | null
    runnerUp?: StringNullableFilter<"TournamentPrediction"> | string | null
    goldenBoot?: StringNullableFilter<"TournamentPrediction"> | string | null
    bestYoungPlayer?: StringNullableFilter<"TournamentPrediction"> | string | null
    groupWinners?: StringFilter<"TournamentPrediction"> | string
    createdAt?: DateTimeFilter<"TournamentPrediction"> | Date | string
    updatedAt?: DateTimeFilter<"TournamentPrediction"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type TournamentPredictionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    champion?: SortOrderInput | SortOrder
    runnerUp?: SortOrderInput | SortOrder
    goldenBoot?: SortOrderInput | SortOrder
    bestYoungPlayer?: SortOrderInput | SortOrder
    groupWinners?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TournamentPredictionCountOrderByAggregateInput
    _max?: TournamentPredictionMaxOrderByAggregateInput
    _min?: TournamentPredictionMinOrderByAggregateInput
  }

  export type TournamentPredictionScalarWhereWithAggregatesInput = {
    AND?: TournamentPredictionScalarWhereWithAggregatesInput | TournamentPredictionScalarWhereWithAggregatesInput[]
    OR?: TournamentPredictionScalarWhereWithAggregatesInput[]
    NOT?: TournamentPredictionScalarWhereWithAggregatesInput | TournamentPredictionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TournamentPrediction"> | string
    userId?: StringWithAggregatesFilter<"TournamentPrediction"> | string
    champion?: StringNullableWithAggregatesFilter<"TournamentPrediction"> | string | null
    runnerUp?: StringNullableWithAggregatesFilter<"TournamentPrediction"> | string | null
    goldenBoot?: StringNullableWithAggregatesFilter<"TournamentPrediction"> | string | null
    bestYoungPlayer?: StringNullableWithAggregatesFilter<"TournamentPrediction"> | string | null
    groupWinners?: StringWithAggregatesFilter<"TournamentPrediction"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TournamentPrediction"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TournamentPrediction"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    displayName: string
    passwordHash: string
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    matchPredictions?: MatchPredictionCreateNestedManyWithoutUserInput
    tournamentPrediction?: TournamentPredictionCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    displayName: string
    passwordHash: string
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    matchPredictions?: MatchPredictionUncheckedCreateNestedManyWithoutUserInput
    tournamentPrediction?: TournamentPredictionUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matchPredictions?: MatchPredictionUpdateManyWithoutUserNestedInput
    tournamentPrediction?: TournamentPredictionUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matchPredictions?: MatchPredictionUncheckedUpdateManyWithoutUserNestedInput
    tournamentPrediction?: TournamentPredictionUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    displayName: string
    passwordHash: string
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchCreateInput = {
    id: number
    stage: string
    kickoff: Date | string
    venue: string
    homeTeam: string
    awayTeam: string
    isLocked?: boolean
    finalHomeScore?: number | null
    finalAwayScore?: number | null
    finalYellowCards?: number | null
    finalTotalCorners?: number | null
    finalRedCards?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    predictions?: MatchPredictionCreateNestedManyWithoutMatchInput
  }

  export type MatchUncheckedCreateInput = {
    id: number
    stage: string
    kickoff: Date | string
    venue: string
    homeTeam: string
    awayTeam: string
    isLocked?: boolean
    finalHomeScore?: number | null
    finalAwayScore?: number | null
    finalYellowCards?: number | null
    finalTotalCorners?: number | null
    finalRedCards?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    predictions?: MatchPredictionUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    stage?: StringFieldUpdateOperationsInput | string
    kickoff?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    homeTeam?: StringFieldUpdateOperationsInput | string
    awayTeam?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    finalHomeScore?: NullableIntFieldUpdateOperationsInput | number | null
    finalAwayScore?: NullableIntFieldUpdateOperationsInput | number | null
    finalYellowCards?: NullableIntFieldUpdateOperationsInput | number | null
    finalTotalCorners?: NullableIntFieldUpdateOperationsInput | number | null
    finalRedCards?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    predictions?: MatchPredictionUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    stage?: StringFieldUpdateOperationsInput | string
    kickoff?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    homeTeam?: StringFieldUpdateOperationsInput | string
    awayTeam?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    finalHomeScore?: NullableIntFieldUpdateOperationsInput | number | null
    finalAwayScore?: NullableIntFieldUpdateOperationsInput | number | null
    finalYellowCards?: NullableIntFieldUpdateOperationsInput | number | null
    finalTotalCorners?: NullableIntFieldUpdateOperationsInput | number | null
    finalRedCards?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    predictions?: MatchPredictionUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type MatchCreateManyInput = {
    id: number
    stage: string
    kickoff: Date | string
    venue: string
    homeTeam: string
    awayTeam: string
    isLocked?: boolean
    finalHomeScore?: number | null
    finalAwayScore?: number | null
    finalYellowCards?: number | null
    finalTotalCorners?: number | null
    finalRedCards?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MatchUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    stage?: StringFieldUpdateOperationsInput | string
    kickoff?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    homeTeam?: StringFieldUpdateOperationsInput | string
    awayTeam?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    finalHomeScore?: NullableIntFieldUpdateOperationsInput | number | null
    finalAwayScore?: NullableIntFieldUpdateOperationsInput | number | null
    finalYellowCards?: NullableIntFieldUpdateOperationsInput | number | null
    finalTotalCorners?: NullableIntFieldUpdateOperationsInput | number | null
    finalRedCards?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    stage?: StringFieldUpdateOperationsInput | string
    kickoff?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    homeTeam?: StringFieldUpdateOperationsInput | string
    awayTeam?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    finalHomeScore?: NullableIntFieldUpdateOperationsInput | number | null
    finalAwayScore?: NullableIntFieldUpdateOperationsInput | number | null
    finalYellowCards?: NullableIntFieldUpdateOperationsInput | number | null
    finalTotalCorners?: NullableIntFieldUpdateOperationsInput | number | null
    finalRedCards?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchPredictionCreateInput = {
    id?: string
    winner: string
    homeScore?: number | null
    awayScore?: number | null
    totalGoalsLine: string
    totalCornersLine?: string
    yellowCardsLine: string
    redCardsLine?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    match: MatchCreateNestedOneWithoutPredictionsInput
    user: UserCreateNestedOneWithoutMatchPredictionsInput
  }

  export type MatchPredictionUncheckedCreateInput = {
    id?: string
    userId: string
    matchId: number
    winner: string
    homeScore?: number | null
    awayScore?: number | null
    totalGoalsLine: string
    totalCornersLine?: string
    yellowCardsLine: string
    redCardsLine?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MatchPredictionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    winner?: StringFieldUpdateOperationsInput | string
    homeScore?: NullableIntFieldUpdateOperationsInput | number | null
    awayScore?: NullableIntFieldUpdateOperationsInput | number | null
    totalGoalsLine?: StringFieldUpdateOperationsInput | string
    totalCornersLine?: StringFieldUpdateOperationsInput | string
    yellowCardsLine?: StringFieldUpdateOperationsInput | string
    redCardsLine?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    match?: MatchUpdateOneRequiredWithoutPredictionsNestedInput
    user?: UserUpdateOneRequiredWithoutMatchPredictionsNestedInput
  }

  export type MatchPredictionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    matchId?: IntFieldUpdateOperationsInput | number
    winner?: StringFieldUpdateOperationsInput | string
    homeScore?: NullableIntFieldUpdateOperationsInput | number | null
    awayScore?: NullableIntFieldUpdateOperationsInput | number | null
    totalGoalsLine?: StringFieldUpdateOperationsInput | string
    totalCornersLine?: StringFieldUpdateOperationsInput | string
    yellowCardsLine?: StringFieldUpdateOperationsInput | string
    redCardsLine?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchPredictionCreateManyInput = {
    id?: string
    userId: string
    matchId: number
    winner: string
    homeScore?: number | null
    awayScore?: number | null
    totalGoalsLine: string
    totalCornersLine?: string
    yellowCardsLine: string
    redCardsLine?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MatchPredictionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    winner?: StringFieldUpdateOperationsInput | string
    homeScore?: NullableIntFieldUpdateOperationsInput | number | null
    awayScore?: NullableIntFieldUpdateOperationsInput | number | null
    totalGoalsLine?: StringFieldUpdateOperationsInput | string
    totalCornersLine?: StringFieldUpdateOperationsInput | string
    yellowCardsLine?: StringFieldUpdateOperationsInput | string
    redCardsLine?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchPredictionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    matchId?: IntFieldUpdateOperationsInput | number
    winner?: StringFieldUpdateOperationsInput | string
    homeScore?: NullableIntFieldUpdateOperationsInput | number | null
    awayScore?: NullableIntFieldUpdateOperationsInput | number | null
    totalGoalsLine?: StringFieldUpdateOperationsInput | string
    totalCornersLine?: StringFieldUpdateOperationsInput | string
    yellowCardsLine?: StringFieldUpdateOperationsInput | string
    redCardsLine?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TournamentPredictionCreateInput = {
    id?: string
    champion?: string | null
    runnerUp?: string | null
    goldenBoot?: string | null
    bestYoungPlayer?: string | null
    groupWinners?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTournamentPredictionInput
  }

  export type TournamentPredictionUncheckedCreateInput = {
    id?: string
    userId: string
    champion?: string | null
    runnerUp?: string | null
    goldenBoot?: string | null
    bestYoungPlayer?: string | null
    groupWinners?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TournamentPredictionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    champion?: NullableStringFieldUpdateOperationsInput | string | null
    runnerUp?: NullableStringFieldUpdateOperationsInput | string | null
    goldenBoot?: NullableStringFieldUpdateOperationsInput | string | null
    bestYoungPlayer?: NullableStringFieldUpdateOperationsInput | string | null
    groupWinners?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTournamentPredictionNestedInput
  }

  export type TournamentPredictionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    champion?: NullableStringFieldUpdateOperationsInput | string | null
    runnerUp?: NullableStringFieldUpdateOperationsInput | string | null
    goldenBoot?: NullableStringFieldUpdateOperationsInput | string | null
    bestYoungPlayer?: NullableStringFieldUpdateOperationsInput | string | null
    groupWinners?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TournamentPredictionCreateManyInput = {
    id?: string
    userId: string
    champion?: string | null
    runnerUp?: string | null
    goldenBoot?: string | null
    bestYoungPlayer?: string | null
    groupWinners?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TournamentPredictionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    champion?: NullableStringFieldUpdateOperationsInput | string | null
    runnerUp?: NullableStringFieldUpdateOperationsInput | string | null
    goldenBoot?: NullableStringFieldUpdateOperationsInput | string | null
    bestYoungPlayer?: NullableStringFieldUpdateOperationsInput | string | null
    groupWinners?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TournamentPredictionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    champion?: NullableStringFieldUpdateOperationsInput | string | null
    runnerUp?: NullableStringFieldUpdateOperationsInput | string | null
    goldenBoot?: NullableStringFieldUpdateOperationsInput | string | null
    bestYoungPlayer?: NullableStringFieldUpdateOperationsInput | string | null
    groupWinners?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type MatchPredictionListRelationFilter = {
    every?: MatchPredictionWhereInput
    some?: MatchPredictionWhereInput
    none?: MatchPredictionWhereInput
  }

  export type TournamentPredictionNullableScalarRelationFilter = {
    is?: TournamentPredictionWhereInput | null
    isNot?: TournamentPredictionWhereInput | null
  }

  export type MatchPredictionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    displayName?: SortOrder
    passwordHash?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    displayName?: SortOrder
    passwordHash?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    displayName?: SortOrder
    passwordHash?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type MatchCountOrderByAggregateInput = {
    id?: SortOrder
    stage?: SortOrder
    kickoff?: SortOrder
    venue?: SortOrder
    homeTeam?: SortOrder
    awayTeam?: SortOrder
    isLocked?: SortOrder
    finalHomeScore?: SortOrder
    finalAwayScore?: SortOrder
    finalYellowCards?: SortOrder
    finalTotalCorners?: SortOrder
    finalRedCards?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MatchAvgOrderByAggregateInput = {
    id?: SortOrder
    finalHomeScore?: SortOrder
    finalAwayScore?: SortOrder
    finalYellowCards?: SortOrder
    finalTotalCorners?: SortOrder
    finalRedCards?: SortOrder
  }

  export type MatchMaxOrderByAggregateInput = {
    id?: SortOrder
    stage?: SortOrder
    kickoff?: SortOrder
    venue?: SortOrder
    homeTeam?: SortOrder
    awayTeam?: SortOrder
    isLocked?: SortOrder
    finalHomeScore?: SortOrder
    finalAwayScore?: SortOrder
    finalYellowCards?: SortOrder
    finalTotalCorners?: SortOrder
    finalRedCards?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MatchMinOrderByAggregateInput = {
    id?: SortOrder
    stage?: SortOrder
    kickoff?: SortOrder
    venue?: SortOrder
    homeTeam?: SortOrder
    awayTeam?: SortOrder
    isLocked?: SortOrder
    finalHomeScore?: SortOrder
    finalAwayScore?: SortOrder
    finalYellowCards?: SortOrder
    finalTotalCorners?: SortOrder
    finalRedCards?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MatchSumOrderByAggregateInput = {
    id?: SortOrder
    finalHomeScore?: SortOrder
    finalAwayScore?: SortOrder
    finalYellowCards?: SortOrder
    finalTotalCorners?: SortOrder
    finalRedCards?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type MatchScalarRelationFilter = {
    is?: MatchWhereInput
    isNot?: MatchWhereInput
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type MatchPredictionUserIdMatchIdCompoundUniqueInput = {
    userId: string
    matchId: number
  }

  export type MatchPredictionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    matchId?: SortOrder
    winner?: SortOrder
    homeScore?: SortOrder
    awayScore?: SortOrder
    totalGoalsLine?: SortOrder
    totalCornersLine?: SortOrder
    yellowCardsLine?: SortOrder
    redCardsLine?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MatchPredictionAvgOrderByAggregateInput = {
    matchId?: SortOrder
    homeScore?: SortOrder
    awayScore?: SortOrder
  }

  export type MatchPredictionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    matchId?: SortOrder
    winner?: SortOrder
    homeScore?: SortOrder
    awayScore?: SortOrder
    totalGoalsLine?: SortOrder
    totalCornersLine?: SortOrder
    yellowCardsLine?: SortOrder
    redCardsLine?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MatchPredictionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    matchId?: SortOrder
    winner?: SortOrder
    homeScore?: SortOrder
    awayScore?: SortOrder
    totalGoalsLine?: SortOrder
    totalCornersLine?: SortOrder
    yellowCardsLine?: SortOrder
    redCardsLine?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MatchPredictionSumOrderByAggregateInput = {
    matchId?: SortOrder
    homeScore?: SortOrder
    awayScore?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type TournamentPredictionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    champion?: SortOrder
    runnerUp?: SortOrder
    goldenBoot?: SortOrder
    bestYoungPlayer?: SortOrder
    groupWinners?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TournamentPredictionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    champion?: SortOrder
    runnerUp?: SortOrder
    goldenBoot?: SortOrder
    bestYoungPlayer?: SortOrder
    groupWinners?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TournamentPredictionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    champion?: SortOrder
    runnerUp?: SortOrder
    goldenBoot?: SortOrder
    bestYoungPlayer?: SortOrder
    groupWinners?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type MatchPredictionCreateNestedManyWithoutUserInput = {
    create?: XOR<MatchPredictionCreateWithoutUserInput, MatchPredictionUncheckedCreateWithoutUserInput> | MatchPredictionCreateWithoutUserInput[] | MatchPredictionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MatchPredictionCreateOrConnectWithoutUserInput | MatchPredictionCreateOrConnectWithoutUserInput[]
    createMany?: MatchPredictionCreateManyUserInputEnvelope
    connect?: MatchPredictionWhereUniqueInput | MatchPredictionWhereUniqueInput[]
  }

  export type TournamentPredictionCreateNestedOneWithoutUserInput = {
    create?: XOR<TournamentPredictionCreateWithoutUserInput, TournamentPredictionUncheckedCreateWithoutUserInput>
    connectOrCreate?: TournamentPredictionCreateOrConnectWithoutUserInput
    connect?: TournamentPredictionWhereUniqueInput
  }

  export type MatchPredictionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<MatchPredictionCreateWithoutUserInput, MatchPredictionUncheckedCreateWithoutUserInput> | MatchPredictionCreateWithoutUserInput[] | MatchPredictionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MatchPredictionCreateOrConnectWithoutUserInput | MatchPredictionCreateOrConnectWithoutUserInput[]
    createMany?: MatchPredictionCreateManyUserInputEnvelope
    connect?: MatchPredictionWhereUniqueInput | MatchPredictionWhereUniqueInput[]
  }

  export type TournamentPredictionUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<TournamentPredictionCreateWithoutUserInput, TournamentPredictionUncheckedCreateWithoutUserInput>
    connectOrCreate?: TournamentPredictionCreateOrConnectWithoutUserInput
    connect?: TournamentPredictionWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type MatchPredictionUpdateManyWithoutUserNestedInput = {
    create?: XOR<MatchPredictionCreateWithoutUserInput, MatchPredictionUncheckedCreateWithoutUserInput> | MatchPredictionCreateWithoutUserInput[] | MatchPredictionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MatchPredictionCreateOrConnectWithoutUserInput | MatchPredictionCreateOrConnectWithoutUserInput[]
    upsert?: MatchPredictionUpsertWithWhereUniqueWithoutUserInput | MatchPredictionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MatchPredictionCreateManyUserInputEnvelope
    set?: MatchPredictionWhereUniqueInput | MatchPredictionWhereUniqueInput[]
    disconnect?: MatchPredictionWhereUniqueInput | MatchPredictionWhereUniqueInput[]
    delete?: MatchPredictionWhereUniqueInput | MatchPredictionWhereUniqueInput[]
    connect?: MatchPredictionWhereUniqueInput | MatchPredictionWhereUniqueInput[]
    update?: MatchPredictionUpdateWithWhereUniqueWithoutUserInput | MatchPredictionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MatchPredictionUpdateManyWithWhereWithoutUserInput | MatchPredictionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MatchPredictionScalarWhereInput | MatchPredictionScalarWhereInput[]
  }

  export type TournamentPredictionUpdateOneWithoutUserNestedInput = {
    create?: XOR<TournamentPredictionCreateWithoutUserInput, TournamentPredictionUncheckedCreateWithoutUserInput>
    connectOrCreate?: TournamentPredictionCreateOrConnectWithoutUserInput
    upsert?: TournamentPredictionUpsertWithoutUserInput
    disconnect?: TournamentPredictionWhereInput | boolean
    delete?: TournamentPredictionWhereInput | boolean
    connect?: TournamentPredictionWhereUniqueInput
    update?: XOR<XOR<TournamentPredictionUpdateToOneWithWhereWithoutUserInput, TournamentPredictionUpdateWithoutUserInput>, TournamentPredictionUncheckedUpdateWithoutUserInput>
  }

  export type MatchPredictionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<MatchPredictionCreateWithoutUserInput, MatchPredictionUncheckedCreateWithoutUserInput> | MatchPredictionCreateWithoutUserInput[] | MatchPredictionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MatchPredictionCreateOrConnectWithoutUserInput | MatchPredictionCreateOrConnectWithoutUserInput[]
    upsert?: MatchPredictionUpsertWithWhereUniqueWithoutUserInput | MatchPredictionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MatchPredictionCreateManyUserInputEnvelope
    set?: MatchPredictionWhereUniqueInput | MatchPredictionWhereUniqueInput[]
    disconnect?: MatchPredictionWhereUniqueInput | MatchPredictionWhereUniqueInput[]
    delete?: MatchPredictionWhereUniqueInput | MatchPredictionWhereUniqueInput[]
    connect?: MatchPredictionWhereUniqueInput | MatchPredictionWhereUniqueInput[]
    update?: MatchPredictionUpdateWithWhereUniqueWithoutUserInput | MatchPredictionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MatchPredictionUpdateManyWithWhereWithoutUserInput | MatchPredictionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MatchPredictionScalarWhereInput | MatchPredictionScalarWhereInput[]
  }

  export type TournamentPredictionUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<TournamentPredictionCreateWithoutUserInput, TournamentPredictionUncheckedCreateWithoutUserInput>
    connectOrCreate?: TournamentPredictionCreateOrConnectWithoutUserInput
    upsert?: TournamentPredictionUpsertWithoutUserInput
    disconnect?: TournamentPredictionWhereInput | boolean
    delete?: TournamentPredictionWhereInput | boolean
    connect?: TournamentPredictionWhereUniqueInput
    update?: XOR<XOR<TournamentPredictionUpdateToOneWithWhereWithoutUserInput, TournamentPredictionUpdateWithoutUserInput>, TournamentPredictionUncheckedUpdateWithoutUserInput>
  }

  export type MatchPredictionCreateNestedManyWithoutMatchInput = {
    create?: XOR<MatchPredictionCreateWithoutMatchInput, MatchPredictionUncheckedCreateWithoutMatchInput> | MatchPredictionCreateWithoutMatchInput[] | MatchPredictionUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: MatchPredictionCreateOrConnectWithoutMatchInput | MatchPredictionCreateOrConnectWithoutMatchInput[]
    createMany?: MatchPredictionCreateManyMatchInputEnvelope
    connect?: MatchPredictionWhereUniqueInput | MatchPredictionWhereUniqueInput[]
  }

  export type MatchPredictionUncheckedCreateNestedManyWithoutMatchInput = {
    create?: XOR<MatchPredictionCreateWithoutMatchInput, MatchPredictionUncheckedCreateWithoutMatchInput> | MatchPredictionCreateWithoutMatchInput[] | MatchPredictionUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: MatchPredictionCreateOrConnectWithoutMatchInput | MatchPredictionCreateOrConnectWithoutMatchInput[]
    createMany?: MatchPredictionCreateManyMatchInputEnvelope
    connect?: MatchPredictionWhereUniqueInput | MatchPredictionWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type MatchPredictionUpdateManyWithoutMatchNestedInput = {
    create?: XOR<MatchPredictionCreateWithoutMatchInput, MatchPredictionUncheckedCreateWithoutMatchInput> | MatchPredictionCreateWithoutMatchInput[] | MatchPredictionUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: MatchPredictionCreateOrConnectWithoutMatchInput | MatchPredictionCreateOrConnectWithoutMatchInput[]
    upsert?: MatchPredictionUpsertWithWhereUniqueWithoutMatchInput | MatchPredictionUpsertWithWhereUniqueWithoutMatchInput[]
    createMany?: MatchPredictionCreateManyMatchInputEnvelope
    set?: MatchPredictionWhereUniqueInput | MatchPredictionWhereUniqueInput[]
    disconnect?: MatchPredictionWhereUniqueInput | MatchPredictionWhereUniqueInput[]
    delete?: MatchPredictionWhereUniqueInput | MatchPredictionWhereUniqueInput[]
    connect?: MatchPredictionWhereUniqueInput | MatchPredictionWhereUniqueInput[]
    update?: MatchPredictionUpdateWithWhereUniqueWithoutMatchInput | MatchPredictionUpdateWithWhereUniqueWithoutMatchInput[]
    updateMany?: MatchPredictionUpdateManyWithWhereWithoutMatchInput | MatchPredictionUpdateManyWithWhereWithoutMatchInput[]
    deleteMany?: MatchPredictionScalarWhereInput | MatchPredictionScalarWhereInput[]
  }

  export type MatchPredictionUncheckedUpdateManyWithoutMatchNestedInput = {
    create?: XOR<MatchPredictionCreateWithoutMatchInput, MatchPredictionUncheckedCreateWithoutMatchInput> | MatchPredictionCreateWithoutMatchInput[] | MatchPredictionUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: MatchPredictionCreateOrConnectWithoutMatchInput | MatchPredictionCreateOrConnectWithoutMatchInput[]
    upsert?: MatchPredictionUpsertWithWhereUniqueWithoutMatchInput | MatchPredictionUpsertWithWhereUniqueWithoutMatchInput[]
    createMany?: MatchPredictionCreateManyMatchInputEnvelope
    set?: MatchPredictionWhereUniqueInput | MatchPredictionWhereUniqueInput[]
    disconnect?: MatchPredictionWhereUniqueInput | MatchPredictionWhereUniqueInput[]
    delete?: MatchPredictionWhereUniqueInput | MatchPredictionWhereUniqueInput[]
    connect?: MatchPredictionWhereUniqueInput | MatchPredictionWhereUniqueInput[]
    update?: MatchPredictionUpdateWithWhereUniqueWithoutMatchInput | MatchPredictionUpdateWithWhereUniqueWithoutMatchInput[]
    updateMany?: MatchPredictionUpdateManyWithWhereWithoutMatchInput | MatchPredictionUpdateManyWithWhereWithoutMatchInput[]
    deleteMany?: MatchPredictionScalarWhereInput | MatchPredictionScalarWhereInput[]
  }

  export type MatchCreateNestedOneWithoutPredictionsInput = {
    create?: XOR<MatchCreateWithoutPredictionsInput, MatchUncheckedCreateWithoutPredictionsInput>
    connectOrCreate?: MatchCreateOrConnectWithoutPredictionsInput
    connect?: MatchWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutMatchPredictionsInput = {
    create?: XOR<UserCreateWithoutMatchPredictionsInput, UserUncheckedCreateWithoutMatchPredictionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMatchPredictionsInput
    connect?: UserWhereUniqueInput
  }

  export type MatchUpdateOneRequiredWithoutPredictionsNestedInput = {
    create?: XOR<MatchCreateWithoutPredictionsInput, MatchUncheckedCreateWithoutPredictionsInput>
    connectOrCreate?: MatchCreateOrConnectWithoutPredictionsInput
    upsert?: MatchUpsertWithoutPredictionsInput
    connect?: MatchWhereUniqueInput
    update?: XOR<XOR<MatchUpdateToOneWithWhereWithoutPredictionsInput, MatchUpdateWithoutPredictionsInput>, MatchUncheckedUpdateWithoutPredictionsInput>
  }

  export type UserUpdateOneRequiredWithoutMatchPredictionsNestedInput = {
    create?: XOR<UserCreateWithoutMatchPredictionsInput, UserUncheckedCreateWithoutMatchPredictionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMatchPredictionsInput
    upsert?: UserUpsertWithoutMatchPredictionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMatchPredictionsInput, UserUpdateWithoutMatchPredictionsInput>, UserUncheckedUpdateWithoutMatchPredictionsInput>
  }

  export type UserCreateNestedOneWithoutTournamentPredictionInput = {
    create?: XOR<UserCreateWithoutTournamentPredictionInput, UserUncheckedCreateWithoutTournamentPredictionInput>
    connectOrCreate?: UserCreateOrConnectWithoutTournamentPredictionInput
    connect?: UserWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserUpdateOneRequiredWithoutTournamentPredictionNestedInput = {
    create?: XOR<UserCreateWithoutTournamentPredictionInput, UserUncheckedCreateWithoutTournamentPredictionInput>
    connectOrCreate?: UserCreateOrConnectWithoutTournamentPredictionInput
    upsert?: UserUpsertWithoutTournamentPredictionInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTournamentPredictionInput, UserUpdateWithoutTournamentPredictionInput>, UserUncheckedUpdateWithoutTournamentPredictionInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type MatchPredictionCreateWithoutUserInput = {
    id?: string
    winner: string
    homeScore?: number | null
    awayScore?: number | null
    totalGoalsLine: string
    totalCornersLine?: string
    yellowCardsLine: string
    redCardsLine?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    match: MatchCreateNestedOneWithoutPredictionsInput
  }

  export type MatchPredictionUncheckedCreateWithoutUserInput = {
    id?: string
    matchId: number
    winner: string
    homeScore?: number | null
    awayScore?: number | null
    totalGoalsLine: string
    totalCornersLine?: string
    yellowCardsLine: string
    redCardsLine?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MatchPredictionCreateOrConnectWithoutUserInput = {
    where: MatchPredictionWhereUniqueInput
    create: XOR<MatchPredictionCreateWithoutUserInput, MatchPredictionUncheckedCreateWithoutUserInput>
  }

  export type MatchPredictionCreateManyUserInputEnvelope = {
    data: MatchPredictionCreateManyUserInput | MatchPredictionCreateManyUserInput[]
  }

  export type TournamentPredictionCreateWithoutUserInput = {
    id?: string
    champion?: string | null
    runnerUp?: string | null
    goldenBoot?: string | null
    bestYoungPlayer?: string | null
    groupWinners?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TournamentPredictionUncheckedCreateWithoutUserInput = {
    id?: string
    champion?: string | null
    runnerUp?: string | null
    goldenBoot?: string | null
    bestYoungPlayer?: string | null
    groupWinners?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TournamentPredictionCreateOrConnectWithoutUserInput = {
    where: TournamentPredictionWhereUniqueInput
    create: XOR<TournamentPredictionCreateWithoutUserInput, TournamentPredictionUncheckedCreateWithoutUserInput>
  }

  export type MatchPredictionUpsertWithWhereUniqueWithoutUserInput = {
    where: MatchPredictionWhereUniqueInput
    update: XOR<MatchPredictionUpdateWithoutUserInput, MatchPredictionUncheckedUpdateWithoutUserInput>
    create: XOR<MatchPredictionCreateWithoutUserInput, MatchPredictionUncheckedCreateWithoutUserInput>
  }

  export type MatchPredictionUpdateWithWhereUniqueWithoutUserInput = {
    where: MatchPredictionWhereUniqueInput
    data: XOR<MatchPredictionUpdateWithoutUserInput, MatchPredictionUncheckedUpdateWithoutUserInput>
  }

  export type MatchPredictionUpdateManyWithWhereWithoutUserInput = {
    where: MatchPredictionScalarWhereInput
    data: XOR<MatchPredictionUpdateManyMutationInput, MatchPredictionUncheckedUpdateManyWithoutUserInput>
  }

  export type MatchPredictionScalarWhereInput = {
    AND?: MatchPredictionScalarWhereInput | MatchPredictionScalarWhereInput[]
    OR?: MatchPredictionScalarWhereInput[]
    NOT?: MatchPredictionScalarWhereInput | MatchPredictionScalarWhereInput[]
    id?: StringFilter<"MatchPrediction"> | string
    userId?: StringFilter<"MatchPrediction"> | string
    matchId?: IntFilter<"MatchPrediction"> | number
    winner?: StringFilter<"MatchPrediction"> | string
    homeScore?: IntNullableFilter<"MatchPrediction"> | number | null
    awayScore?: IntNullableFilter<"MatchPrediction"> | number | null
    totalGoalsLine?: StringFilter<"MatchPrediction"> | string
    totalCornersLine?: StringFilter<"MatchPrediction"> | string
    yellowCardsLine?: StringFilter<"MatchPrediction"> | string
    redCardsLine?: StringFilter<"MatchPrediction"> | string
    createdAt?: DateTimeFilter<"MatchPrediction"> | Date | string
    updatedAt?: DateTimeFilter<"MatchPrediction"> | Date | string
  }

  export type TournamentPredictionUpsertWithoutUserInput = {
    update: XOR<TournamentPredictionUpdateWithoutUserInput, TournamentPredictionUncheckedUpdateWithoutUserInput>
    create: XOR<TournamentPredictionCreateWithoutUserInput, TournamentPredictionUncheckedCreateWithoutUserInput>
    where?: TournamentPredictionWhereInput
  }

  export type TournamentPredictionUpdateToOneWithWhereWithoutUserInput = {
    where?: TournamentPredictionWhereInput
    data: XOR<TournamentPredictionUpdateWithoutUserInput, TournamentPredictionUncheckedUpdateWithoutUserInput>
  }

  export type TournamentPredictionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    champion?: NullableStringFieldUpdateOperationsInput | string | null
    runnerUp?: NullableStringFieldUpdateOperationsInput | string | null
    goldenBoot?: NullableStringFieldUpdateOperationsInput | string | null
    bestYoungPlayer?: NullableStringFieldUpdateOperationsInput | string | null
    groupWinners?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TournamentPredictionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    champion?: NullableStringFieldUpdateOperationsInput | string | null
    runnerUp?: NullableStringFieldUpdateOperationsInput | string | null
    goldenBoot?: NullableStringFieldUpdateOperationsInput | string | null
    bestYoungPlayer?: NullableStringFieldUpdateOperationsInput | string | null
    groupWinners?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchPredictionCreateWithoutMatchInput = {
    id?: string
    winner: string
    homeScore?: number | null
    awayScore?: number | null
    totalGoalsLine: string
    totalCornersLine?: string
    yellowCardsLine: string
    redCardsLine?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutMatchPredictionsInput
  }

  export type MatchPredictionUncheckedCreateWithoutMatchInput = {
    id?: string
    userId: string
    winner: string
    homeScore?: number | null
    awayScore?: number | null
    totalGoalsLine: string
    totalCornersLine?: string
    yellowCardsLine: string
    redCardsLine?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MatchPredictionCreateOrConnectWithoutMatchInput = {
    where: MatchPredictionWhereUniqueInput
    create: XOR<MatchPredictionCreateWithoutMatchInput, MatchPredictionUncheckedCreateWithoutMatchInput>
  }

  export type MatchPredictionCreateManyMatchInputEnvelope = {
    data: MatchPredictionCreateManyMatchInput | MatchPredictionCreateManyMatchInput[]
  }

  export type MatchPredictionUpsertWithWhereUniqueWithoutMatchInput = {
    where: MatchPredictionWhereUniqueInput
    update: XOR<MatchPredictionUpdateWithoutMatchInput, MatchPredictionUncheckedUpdateWithoutMatchInput>
    create: XOR<MatchPredictionCreateWithoutMatchInput, MatchPredictionUncheckedCreateWithoutMatchInput>
  }

  export type MatchPredictionUpdateWithWhereUniqueWithoutMatchInput = {
    where: MatchPredictionWhereUniqueInput
    data: XOR<MatchPredictionUpdateWithoutMatchInput, MatchPredictionUncheckedUpdateWithoutMatchInput>
  }

  export type MatchPredictionUpdateManyWithWhereWithoutMatchInput = {
    where: MatchPredictionScalarWhereInput
    data: XOR<MatchPredictionUpdateManyMutationInput, MatchPredictionUncheckedUpdateManyWithoutMatchInput>
  }

  export type MatchCreateWithoutPredictionsInput = {
    id: number
    stage: string
    kickoff: Date | string
    venue: string
    homeTeam: string
    awayTeam: string
    isLocked?: boolean
    finalHomeScore?: number | null
    finalAwayScore?: number | null
    finalYellowCards?: number | null
    finalTotalCorners?: number | null
    finalRedCards?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MatchUncheckedCreateWithoutPredictionsInput = {
    id: number
    stage: string
    kickoff: Date | string
    venue: string
    homeTeam: string
    awayTeam: string
    isLocked?: boolean
    finalHomeScore?: number | null
    finalAwayScore?: number | null
    finalYellowCards?: number | null
    finalTotalCorners?: number | null
    finalRedCards?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MatchCreateOrConnectWithoutPredictionsInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutPredictionsInput, MatchUncheckedCreateWithoutPredictionsInput>
  }

  export type UserCreateWithoutMatchPredictionsInput = {
    id?: string
    email: string
    displayName: string
    passwordHash: string
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tournamentPrediction?: TournamentPredictionCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMatchPredictionsInput = {
    id?: string
    email: string
    displayName: string
    passwordHash: string
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tournamentPrediction?: TournamentPredictionUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMatchPredictionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMatchPredictionsInput, UserUncheckedCreateWithoutMatchPredictionsInput>
  }

  export type MatchUpsertWithoutPredictionsInput = {
    update: XOR<MatchUpdateWithoutPredictionsInput, MatchUncheckedUpdateWithoutPredictionsInput>
    create: XOR<MatchCreateWithoutPredictionsInput, MatchUncheckedCreateWithoutPredictionsInput>
    where?: MatchWhereInput
  }

  export type MatchUpdateToOneWithWhereWithoutPredictionsInput = {
    where?: MatchWhereInput
    data: XOR<MatchUpdateWithoutPredictionsInput, MatchUncheckedUpdateWithoutPredictionsInput>
  }

  export type MatchUpdateWithoutPredictionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    stage?: StringFieldUpdateOperationsInput | string
    kickoff?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    homeTeam?: StringFieldUpdateOperationsInput | string
    awayTeam?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    finalHomeScore?: NullableIntFieldUpdateOperationsInput | number | null
    finalAwayScore?: NullableIntFieldUpdateOperationsInput | number | null
    finalYellowCards?: NullableIntFieldUpdateOperationsInput | number | null
    finalTotalCorners?: NullableIntFieldUpdateOperationsInput | number | null
    finalRedCards?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchUncheckedUpdateWithoutPredictionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    stage?: StringFieldUpdateOperationsInput | string
    kickoff?: DateTimeFieldUpdateOperationsInput | Date | string
    venue?: StringFieldUpdateOperationsInput | string
    homeTeam?: StringFieldUpdateOperationsInput | string
    awayTeam?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    finalHomeScore?: NullableIntFieldUpdateOperationsInput | number | null
    finalAwayScore?: NullableIntFieldUpdateOperationsInput | number | null
    finalYellowCards?: NullableIntFieldUpdateOperationsInput | number | null
    finalTotalCorners?: NullableIntFieldUpdateOperationsInput | number | null
    finalRedCards?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutMatchPredictionsInput = {
    update: XOR<UserUpdateWithoutMatchPredictionsInput, UserUncheckedUpdateWithoutMatchPredictionsInput>
    create: XOR<UserCreateWithoutMatchPredictionsInput, UserUncheckedCreateWithoutMatchPredictionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMatchPredictionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMatchPredictionsInput, UserUncheckedUpdateWithoutMatchPredictionsInput>
  }

  export type UserUpdateWithoutMatchPredictionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tournamentPrediction?: TournamentPredictionUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMatchPredictionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tournamentPrediction?: TournamentPredictionUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutTournamentPredictionInput = {
    id?: string
    email: string
    displayName: string
    passwordHash: string
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    matchPredictions?: MatchPredictionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTournamentPredictionInput = {
    id?: string
    email: string
    displayName: string
    passwordHash: string
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    matchPredictions?: MatchPredictionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTournamentPredictionInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTournamentPredictionInput, UserUncheckedCreateWithoutTournamentPredictionInput>
  }

  export type UserUpsertWithoutTournamentPredictionInput = {
    update: XOR<UserUpdateWithoutTournamentPredictionInput, UserUncheckedUpdateWithoutTournamentPredictionInput>
    create: XOR<UserCreateWithoutTournamentPredictionInput, UserUncheckedCreateWithoutTournamentPredictionInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTournamentPredictionInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTournamentPredictionInput, UserUncheckedUpdateWithoutTournamentPredictionInput>
  }

  export type UserUpdateWithoutTournamentPredictionInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matchPredictions?: MatchPredictionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTournamentPredictionInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matchPredictions?: MatchPredictionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MatchPredictionCreateManyUserInput = {
    id?: string
    matchId: number
    winner: string
    homeScore?: number | null
    awayScore?: number | null
    totalGoalsLine: string
    totalCornersLine?: string
    yellowCardsLine: string
    redCardsLine?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MatchPredictionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    winner?: StringFieldUpdateOperationsInput | string
    homeScore?: NullableIntFieldUpdateOperationsInput | number | null
    awayScore?: NullableIntFieldUpdateOperationsInput | number | null
    totalGoalsLine?: StringFieldUpdateOperationsInput | string
    totalCornersLine?: StringFieldUpdateOperationsInput | string
    yellowCardsLine?: StringFieldUpdateOperationsInput | string
    redCardsLine?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    match?: MatchUpdateOneRequiredWithoutPredictionsNestedInput
  }

  export type MatchPredictionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: IntFieldUpdateOperationsInput | number
    winner?: StringFieldUpdateOperationsInput | string
    homeScore?: NullableIntFieldUpdateOperationsInput | number | null
    awayScore?: NullableIntFieldUpdateOperationsInput | number | null
    totalGoalsLine?: StringFieldUpdateOperationsInput | string
    totalCornersLine?: StringFieldUpdateOperationsInput | string
    yellowCardsLine?: StringFieldUpdateOperationsInput | string
    redCardsLine?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchPredictionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: IntFieldUpdateOperationsInput | number
    winner?: StringFieldUpdateOperationsInput | string
    homeScore?: NullableIntFieldUpdateOperationsInput | number | null
    awayScore?: NullableIntFieldUpdateOperationsInput | number | null
    totalGoalsLine?: StringFieldUpdateOperationsInput | string
    totalCornersLine?: StringFieldUpdateOperationsInput | string
    yellowCardsLine?: StringFieldUpdateOperationsInput | string
    redCardsLine?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchPredictionCreateManyMatchInput = {
    id?: string
    userId: string
    winner: string
    homeScore?: number | null
    awayScore?: number | null
    totalGoalsLine: string
    totalCornersLine?: string
    yellowCardsLine: string
    redCardsLine?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MatchPredictionUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    winner?: StringFieldUpdateOperationsInput | string
    homeScore?: NullableIntFieldUpdateOperationsInput | number | null
    awayScore?: NullableIntFieldUpdateOperationsInput | number | null
    totalGoalsLine?: StringFieldUpdateOperationsInput | string
    totalCornersLine?: StringFieldUpdateOperationsInput | string
    yellowCardsLine?: StringFieldUpdateOperationsInput | string
    redCardsLine?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMatchPredictionsNestedInput
  }

  export type MatchPredictionUncheckedUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    winner?: StringFieldUpdateOperationsInput | string
    homeScore?: NullableIntFieldUpdateOperationsInput | number | null
    awayScore?: NullableIntFieldUpdateOperationsInput | number | null
    totalGoalsLine?: StringFieldUpdateOperationsInput | string
    totalCornersLine?: StringFieldUpdateOperationsInput | string
    yellowCardsLine?: StringFieldUpdateOperationsInput | string
    redCardsLine?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchPredictionUncheckedUpdateManyWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    winner?: StringFieldUpdateOperationsInput | string
    homeScore?: NullableIntFieldUpdateOperationsInput | number | null
    awayScore?: NullableIntFieldUpdateOperationsInput | number | null
    totalGoalsLine?: StringFieldUpdateOperationsInput | string
    totalCornersLine?: StringFieldUpdateOperationsInput | string
    yellowCardsLine?: StringFieldUpdateOperationsInput | string
    redCardsLine?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}