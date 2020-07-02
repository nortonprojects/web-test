import { validationResult } from 'express-validator';
import { Restaurant } from './restaurant/Restaurant.model';

export function checkValidation(req, res, next) {
  const validation = validationResult(req);
  if(!validation.isEmpty()) {
    return res.status(400).send(validation.mapped());
  }
  return next();
}

export function checkRestaurantExists(restaurantId) {
  const restaurant = Restaurant.findOne({
    where: {
      id: restaurantId,
    },
  });
  if(!restaurant) {
    throw new Error('Restaurant does not exist');
  }
  return true;
}