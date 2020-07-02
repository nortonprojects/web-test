import { Controller, Get, Put, ClassOptions, Middleware } from '@overnightjs/core'
import { Request, Response } from 'express'
import { param, body } from 'express-validator';

import { checkValidation, checkRestaurantExists } from '../validationHandler.middleware'
import { ReservationSetting } from './ReservationSetting.model';

@Controller('reservation-settings')
@ClassOptions({mergeParams: true})
export class ReservationSettingsAPI {
  @Get('')
  @Middleware([
    param('restaurantId').isInt(),
    param('restaurantId').custom(checkRestaurantExists),
    checkValidation,
  ])
  private async getAll(req: Request, res: Response) {
    const reservationSettings = await ReservationSetting.findAll({
      where: {restaurantId: req.params.restaurantId},
      attributes: ['id', 'startTime', 'endTime', 'availableReservations', 'restaurantId'],
    });
    return res.send(reservationSettings || []);
  }

  @Put('')
  @Middleware([
    param('restaurantId').isInt(),
    param('restaurantId').custom(checkRestaurantExists),
    body(['*.startTime', '*.endTime']).matches(/^(0[0-9]|1[0-9]|2[0-3]):(00|15|30|45)$/),
    body('*.availableReservations').isInt({min: 1}),
    body('*.startTime').custom((value, { req }) => {
      const vals = req.body.filter(item => item.startTime === value);
      if(vals.length > 1) {
        throw new Error('All startTime values must be unique');
      }
      return true;
    }),
    body().custom((value, { req }) => {
      req.body.forEach((item) => {
        if (item.endTime <= item.startTime) {
          throw new Error('All endTime values must be greater than their startTime values');
        }
      });
      return true;
    }),
    body().customSanitizer((value) =>
      value.sort((a,b) => a.startTime < b.startTime ? -1 : 1
    )).custom((value, { req }) => {
      req.body.forEach((item, index, arr) => {
        if(index + 1 < arr.length) {
          if(item.endTime >= arr[index + 1].startTime) {
            throw new Error('Items cannot have overlapping time spans');
          }
        }
      });
      return true;
    }),
    checkValidation,
  ])
  private async putAll(req: Request, res: Response) {
    await ReservationSetting.destroy({
      where: {
        restaurantId: req.params.restaurantId,
      }
    });
    const reservationSettings = await ReservationSetting.bulkCreate(req.body.map(item => ({
      ...item,
      restaurantId: req.params.restaurantId
    })));
    return res.send(reservationSettings.map(item => ({
      id: item.id,
      startTime: item.startTime,
      endTime: item.endTime,
      availableReservations: item.availableReservations,
      restaurantId: item.restaurantId,
    })));
  }
}
