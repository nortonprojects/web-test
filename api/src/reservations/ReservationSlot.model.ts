import {
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript'

import {ReservationSetting} from './ReservationSetting.model';
import {Reservation} from './Reservation.model';
import { Restaurant } from '../restaurant/Restaurant.model';

@Table({ tableName: 'reservation_slots' })
export class ReservationSlot extends Model<ReservationSlot> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number

  @Column
  date: Date

  @Column
  time: string

  @ForeignKey(() => ReservationSetting)
  @Column
  settingId: number

  @BelongsTo(() => ReservationSetting)
  setting: ReservationSetting

  @HasMany(() => Reservation)
  reservations: Reservation[]

  @ForeignKey(() => Restaurant)
  @Column
  restaurantId: number

  @BelongsTo(() => Restaurant)
  restaurant: Restaurant

  @DeletedAt
  deleted_at: string

  @CreatedAt
  created_at: string

  @UpdatedAt
  updated_at: string
}
