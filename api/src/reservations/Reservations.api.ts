import { Controller, Get, Post, Put, ClassOptions, Middleware } from '@overnightjs/core'
import { Request, Response } from 'express'
import { param, body } from 'express-validator';
import { Op } from 'sequelize';

import {Reservation} from './Reservation.model';
import {ReservationSlot} from './ReservationSlot.model';
import { checkValidation, checkRestaurantExists } from '../validationHandler.middleware';
import { ReservationSetting } from './ReservationSetting.model';

@Controller('reservations')
@ClassOptions({mergeParams: true})
export class ReservationsAPI {
  @Get('')
  @Middleware([
    param('restaurantId').isInt(),
    param('restaurantId').custom(checkRestaurantExists),
    checkValidation,
  ])
  private async getAll(req: Request, res: Response) {
    const restaurantId = req.params.restaurantId;
    const reservationSlots = await ReservationSlot.findAll({
      where: {
        restaurantId
      },
      include: [ReservationSetting, Reservation],
    });
    return res.send(reservationSlots.map(item => ({
      id: item.id,
      time: item.time,
      date: item.date.toISOString().slice(0,10),
      restaurantId: item.restaurantId,
      reservationLimit: item.setting.availableReservations,
      reservations: item.reservations.length,
    })));
  }

  @Get(':slotId')
  @Middleware([
    param(['restaurantId', 'slotId']).isInt(),
    param('restaurantId').custom(checkRestaurantExists),
    checkValidation,
  ])
  private async get(req: Request, res: Response) {
    const slotId = req.params.slotId;
    const slot = await ReservationSlot.findByPk(slotId, {
      include: [Reservation, ReservationSetting],
    });
    return res.send({
      id: slot.id,
      time: slot.time,
      date: slot.date.toISOString().slice(0,10),
      restaurantId: req.params.restaurantId,
      reservationLimit: slot.setting.availableReservations,
      reservations: slot.reservations.map(item => ({
        name: item.name,
        email: item.email,
        partySize: item.partySize,
      }))
    });
  }

  @Post('')
  @Middleware([
    param('restaurantId').isInt(),
    param('restaurantId').custom(checkRestaurantExists),
    body('name').exists(),
    body('email').normalizeEmail().isEmail(),
    body('partySize').isInt({min:1}),
    body('date').isDate(),
    body('time').matches(/^(0[0-9]|1[0-9]|2[0-3]):(00|15|30|45)$/),
    body('time').custom(async (value, { req }) => {
      const reservationSetting = await ReservationSetting.findOne({
        where: {
          restaurantId: req.params.restaurantId,
          startTime: {
            [Op.lte]: value,
          },
          endTime: {
            [Op.gte]: value,
          },
        },
      });
      if(!reservationSetting) {
        throw new Error('Reservation times must be withing reservation settings');
      }
      return true;
    }),
    checkValidation,
  ])
  private async post(req: Request, res: Response) {
    const reservationSetting = await ReservationSetting.findOne({
      where: {
        restaurantId: req.params.restaurantId,
        startTime: {
          [Op.lte]: req.body.time,
        },
        endTime: {
          [Op.gte]: req.body.time,
        },
      },
    });
    const reservationSlot = await ReservationSlot.create({
      restaurantId: req.params.restaurantId,
      date: new Date(req.body.date),
      settingId: reservationSetting.id,
      time: req.body.time,
    });
    const reservation = await Reservation.create({
      name: req.body.name,
      email: req.body.email,
      partySize: req.body.partySize,
      slotId: reservationSlot.id,
      restaurantId: req.params.restaurantId,
    });
    return res.send({
      time: reservationSlot.time,
      date: reservationSlot.date.toISOString().slice(0,10),
      restaurantId: req.params.restaurantId,
      id: reservationSlot.id,
      reservations: [{
        name: reservation.name,
        email: reservation.email,
        partySize: req.body.partySize,
      }],
    });
  }

  @Put(':slotId')
  @Middleware([
    param(['restaurantId', 'slotId']).isInt(),
    param('restaurantId').custom(checkRestaurantExists),
    body('name').exists(),
    body('email').normalizeEmail().isEmail(),
    body('partySize').isInt({min:1}),
    param('slotId').custom(async (value) => {
      const slot = await ReservationSlot.findOne({
        where: {
          id: value,
        },
        include: [ReservationSetting, Reservation]
      });
      if(!slot) {
        throw new Error('Reservation slot does not exist');
      }
      if(slot.setting.availableReservations <= slot.reservations.length) {
        throw new Error('Reservation slot cannot accept more reservations');
      }
      return true;
    }),
    checkValidation,
  ])
  private async put(req: Request, res: Response) {
    const reservation = await Reservation.create({
      name: req.body.name,
      email: req.body.email,
      partySize: req.body.partySize,
      slotId: req.params.slotId,
      restaurantId: req.params.restaurantId,
    });
    const slot = await reservation.getSlot();
    const slotReservations = await slot.getReservations();
    const slotSetting = await slot.getSetting();
    return res.send({
      id: slot.id,
      time: slot.time,
      date: slot.date.toISOString().slice(0,10),
      restaurantId: req.params.restaurantId,
      reservationLimit: slotSetting.availableReservations,
      reservations: slotReservations.map(item => ({
        name: item.name,
        email: item.email,
        partySize: item.partySize,
      }))
    });
  }
}
