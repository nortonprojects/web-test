import { Controller, Get, Post, ChildControllers, ClassOptions, Middleware } from '@overnightjs/core'
import { Request, Response } from 'express'
import { param, body } from 'express-validator'

import { ReservationsAPI } from '../reservations/Reservations.api'
import { Restaurant } from './Restaurant.model'
import { ReservationSettingsAPI } from '../reservations/ReservationSettings.api'
import { checkValidation } from '../validationHandler.middleware'

const attributeArr = [ 'id', 'name', 'address' ];

@Controller('restaurants/:restaurantId')
@ClassOptions({ mergeParams: true })
@ChildControllers([new ReservationsAPI(), new ReservationSettingsAPI()])
export class RestaurantAPI {
  @Get()
  @Middleware([
    param('restaurantId').isInt(),
    checkValidation
  ])
  private async get(req: Request, res: Response) {
    const restaurant = await Restaurant.findOne({
      attributes: attributeArr,
      where: { id: req.params.restaurantId }
    });
    return restaurant ? res.send(restaurant) : res.sendStatus(404)
  }
}

@Controller('restaurants')
export class AllRestaurantsAPI {
  @Get()
  private async get(req: Request, res: Response) {
    const restaurants = await Restaurant.findAll({
      attributes: attributeArr,
    });
    return res.send(restaurants);
  }

  @Post()
  @Middleware([
    body('name').exists(),
    body('address').exists(),
  ])
  private async post(req: Request, res: Response) {
    const restaurant = await Restaurant.create({
      name: req.body.name,
      address: req.body.address,
    });
    const {id, name, address} = restaurant;
    return res.send({ id, name, address });
  }
}