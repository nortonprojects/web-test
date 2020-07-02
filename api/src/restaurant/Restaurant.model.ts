import {
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  PrimaryKey, Table,
  UpdatedAt,
  HasMany
} from 'sequelize-typescript'

import { ReservationSetting } from '../reservations/ReservationSetting.model'
import { ReservationSlot } from '../reservations/ReservationSlot.model'
import { Reservation } from '../reservations/Reservation.model'

@Table({ tableName: 'restaurants' })
export class Restaurant extends Model<Restaurant> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number

  @Column
  name: string

  @Column
  address: string

  @HasMany(() => ReservationSetting)
  reservation_settings

  @HasMany(() => ReservationSlot)
  reservation_slots

  @HasMany(() => Reservation)
  reservations

  @DeletedAt
  deleted_at: string

  @CreatedAt
  created_at: string

  @UpdatedAt
  updated_at: string
}
