const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { sign } = require('../utils/jwt');

class AuthService {
  async sendCode(phone) {
    return { message: '验证码已发送，测试验证码为 123456' };
  }

  async login(phone, code) {
    if (code !== '123456') {
      const err = new Error('验证码错误');
      err.statusCode = 400;
      throw err;
    }

    let user = await User.findOne({ where: { phone } });
    if (!user) {
      user = await User.create({ phone, role: 'user' });
    }

    if (user.status === 'banned') {
      const err = new Error('账号已被封禁');
      err.statusCode = 403;
      throw err;
    }

    const token = sign({
      id: user.id,
      phone: user.phone,
      role: user.role
    });

    return { user, token };
  }

  async adminLogin(phone, password) {
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      const err = new Error('用户不存在');
      err.statusCode = 404;
      throw err;
    }

    if (user.role !== 'admin') {
      const err = new Error('权限不足，非管理员账号');
      err.statusCode = 403;
      throw err;
    }

    if (!user.password_hash) {
      const err = new Error('请先设置管理员密码');
      err.statusCode = 400;
      throw err;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      const err = new Error('密码错误');
      err.statusCode = 400;
      throw err;
    }

    const token = sign({
      id: user.id,
      phone: user.phone,
      role: user.role
    });

    return { user, token };
  }
}

module.exports = new AuthService();
