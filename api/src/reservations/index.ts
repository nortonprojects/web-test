import * as ReservationsAPI from './Reservations.api';
import * as ReservationsSettingsAPI from './ReservationSettings.api';
import * as ReservationsModel from './Reservation.model';
import * as ReservationSettingModel from './ReservationSetting.model';
import * as ReservationSlot from './ReservationSlot.model';

export const controllers = {
  ...ReservationsAPI,
  ...ReservationsSettingsAPI,
};

export const models = {
  ...ReservationsModel,
  ...ReservationSettingModel,
  ...ReservationSlot,
};