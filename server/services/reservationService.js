const { Reservation, Merchant, User, Sequelize } = require('../models');

const { Op } = Sequelize;

class ReservationService {
  generateTimeSlots() {
    const slots = [];
    for (let hour = 9; hour <= 21; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }

  async getAvailableSlots(merchantId, dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);

    if (targetDate < today) {
      const err = new Error('预约日期不能早于今天');
      err.statusCode = 400;
      throw err;
    }

    const merchant = await Merchant.findByPk(merchantId);
    if (!merchant) {
      const err = new Error('商户不存在');
      err.statusCode = 404;
      throw err;
    }

    const allSlots = this.generateTimeSlots();

    const reservations = await Reservation.findAll({
      where: {
        merchant_id: merchantId,
        date: dateStr,
        status: { [Op.notIn]: ['cancelled'] }
      },
      attributes: ['time_slot']
    });

    const bookedSlots = new Set(reservations.map(r => r.time_slot));

    return allSlots.map(slot => ({
      time: slot,
      available: !bookedSlots.has(slot)
    }));
  }

  async createReservation(userId, { merchantId, date, timeSlot, contactPhone, remark }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    if (targetDate < today) {
      const err = new Error('预约日期不能早于今天');
      err.statusCode = 400;
      throw err;
    }

    const allSlots = this.generateTimeSlots();
    if (!allSlots.includes(timeSlot)) {
      const err = new Error('无效的预约时段');
      err.statusCode = 400;
      throw err;
    }

    if (targetDate.getTime() === today.getTime()) {
      const [hour, min] = timeSlot.split(':').map(Number);
      const now = new Date();
      const slotTime = new Date(today);
      slotTime.setHours(hour, min, 0, 0);
      if (slotTime <= now) {
        const err = new Error('该时段已过期');
        err.statusCode = 400;
        throw err;
      }
    }

    const merchant = await Merchant.findByPk(merchantId);
    if (!merchant) {
      const err = new Error('商户不存在');
      err.statusCode = 404;
      throw err;
    }

    const existing = await Reservation.findOne({
      where: {
        user_id: userId,
        merchant_id: merchantId,
        date,
        time_slot: timeSlot
      }
    });

    if (existing) {
      const err = new Error('您已预约该时段');
      err.statusCode = 400;
      throw err;
    }

    const bookedSlot = await Reservation.findOne({
      where: {
        merchant_id: merchantId,
        date,
        time_slot: timeSlot,
        status: { [Op.notIn]: ['cancelled'] }
      }
    });

    if (bookedSlot) {
      const err = new Error('该时段已被预约');
      err.statusCode = 400;
      throw err;
    }

    return await Reservation.create({
      user_id: userId,
      merchant_id: merchantId,
      date,
      time_slot: timeSlot,
      contact_phone: contactPhone,
      remark: remark || ''
    });
  }

  async updateReservationStatus(id, userId, newStatus) {
    const reservation = await Reservation.findByPk(id, {
      include: [{ model: Merchant, as: 'merchant', attributes: ['user_id'] }]
    });

    if (!reservation) {
      const err = new Error('预约不存在');
      err.statusCode = 404;
      throw err;
    }

    if (reservation.merchant.user_id !== userId) {
      const err = new Error('无权限操作此预约');
      err.statusCode = 403;
      throw err;
    }

    const currentStatus = reservation.status;
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['completed', 'cancelled'],
      completed: [],
      cancelled: []
    };

    if (!validTransitions[currentStatus] || !validTransitions[currentStatus].includes(newStatus)) {
      const err = new Error(`状态流转不允许：${currentStatus} -> ${newStatus}`);
      err.statusCode = 400;
      throw err;
    }

    await reservation.update({ status: newStatus });
    return reservation;
  }

  async getUserReservations(userId, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await Reservation.findAndCountAll({
      where: { user_id: userId },
      include: [
        {
          model: Merchant,
          as: 'merchant',
          attributes: ['id', 'name', 'images', 'address', 'phone']
        }
      ],
      order: [['date', 'DESC'], ['time_slot', 'DESC']],
      limit: parseInt(pageSize),
      offset
    });

    return {
      list: rows,
      total: count,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    };
  }

  async getMerchantReservations(merchantId, status, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const where = { merchant_id: merchantId };
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Reservation.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar', 'phone']
        },
        {
          model: Merchant,
          as: 'merchant',
          attributes: ['id', 'name']
        }
      ],
      order: [['date', 'DESC'], ['time_slot', 'DESC']],
      limit: parseInt(pageSize),
      offset
    });

    return {
      list: rows,
      total: count,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    };
  }
}

module.exports = new ReservationService();
