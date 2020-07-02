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
} from 'sequelize-typescript'

import {ReservationSlot} from './ReservationSlot.model';
import { Restaurant } from '../restaurant/Restaurant.model';

@Table({ tableName: 'reservations' })
export class Reservation extends Model<Reservation> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number

  @Column
  name: string

  @Column
  email: string

  @Column
  partySize: number

  @ForeignKey(() => ReservationSlot)
  @Column
  slotId: number

  @BelongsTo(() => ReservationSlot, 'slotId')
  slot: ReservationSlot

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
