import {
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  PrimaryKey, Table,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript'

import {Restaurant} from '../restaurant/Restaurant.model';
import { ReservationSlot } from './ReservationSlot.model';

@Table({ tableName: 'reservation_settings' })
export class ReservationSetting extends Model<ReservationSetting> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number

  @Column
  startTime: string

  @Column
  endTime: string

  @Column
  availableReservations: number

  @ForeignKey(() => Restaurant)
  @Column
  restaurantId: number

  @BelongsTo(() => Restaurant)
  restaurant: Restaurant


  @HasMany(() => ReservationSlot)
  reservations: ReservationSlot[]

  @DeletedAt
  deleted_at: string

  @CreatedAt
  created_at: string

  @UpdatedAt
  updated_at: string
}
