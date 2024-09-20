import ApiError from 'errors/ApiError';
import {IUser} from 'models/database/user';
import {PaymentStatus} from 'models/paymentStatus';
import PaymentRepository from 'repositories/paymentRepository';
import strings from 'strings';
import {delay, inject, injectable} from 'tsyringe';
import OrderService from './orderService';
import StripeService from './stripeService';

@injectable()
class PaymentService {
  constructor(
    private paymentRepository: PaymentRepository,
    private stripeService: StripeService,
    @inject(delay(() => OrderService)) private orderService: OrderService,
  ) {}

  createPayment = async (user: IUser, orderId: number, price: number) => {
    const stripePayment = await this.stripeService.createPayment(user, price);

    console.log({
      payment_intent_id: stripePayment.paymentIntentId,
      price,
      order_id: orderId,
    });

    const payment = await this.paymentRepository.create({
      payment_intent_id: stripePayment.paymentIntentId,
      price,
      order_id: orderId,
    });

    return {
      id: payment.id,
      ...stripePayment,
    };
  };

  getPayment = async (orderId: number) => {
    const payment = await this.paymentRepository.findOneByCondition({
      order_id: orderId,
    });
    if (!payment) {
      throw ApiError.notFound(strings.payment.notFound);
    }

    const stripePayment = await this.stripeService.getPaymentDetails(
      payment.payment_intent_id,
    );

    return {
      id: payment.id,
      ...stripePayment,
    };
  };

  confirmPayment = async (id: number) => {
    const payment = await this.paymentRepository.findOneByCondition({id});

    if (!payment) {
      throw ApiError.notFound(strings.payment.notFound);
    }

    if (payment.status == PaymentStatus.completed) {
      return;
    }

    const isPaymentConfirmed = await this.stripeService.isPaymentConfirmed(
      payment.payment_intent_id,
    );

    if (!isPaymentConfirmed) {
      throw ApiError.unprocessableEntity(strings.payment.notConfirmed);
    }

    payment.status = PaymentStatus.completed;
    await this.paymentRepository.update(payment);

    await this.orderService.changeStatusAfterPayment(payment.order_id);
  };
}

export default PaymentService;
