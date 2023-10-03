import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableProducts1696304652129 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'serial4',
          },
          {
            name: 'name',
            type: 'varchar(255)',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar(255)',
            isNullable: true,
          },
          {
            name: 'price',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'category',
            type: 'varchar(255)',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}
