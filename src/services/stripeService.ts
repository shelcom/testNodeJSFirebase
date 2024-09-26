import {injectable} from 'tsyringe';
import Stripe from 'stripe';
import {IUser} from 'models/database/user';
import constants from '../constants';

@injectable()
export default class StripeService {
  private stripe: Stripe = null;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_TEST_API_KEY, {
      apiVersion: '2020-08-27',
    });
  }

  isPaymentConfirmed = async (paymentIntentId: string) => {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      paymentIntentId,
    );
    return paymentIntent.status == 'succeeded';
  };

  createPayment = async (user: IUser, price: number) => {
    const customer = await this.createCustomerIfNeeded(user);
    const paymentIntent = await this.createPaymentIntent(customer.id, price);
    const ephemeralKey = await this.createEphemeralKey(customer.id);

    return {
      paymentIntentId: paymentIntent.id,
      paymentIntentSecret: paymentIntent.client_secret,
      customerId: customer.id,
      ephemeralKeySecret: ephemeralKey.secret,
    };
  };

  getPaymentDetails = async (paymentIntentId: string) => {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      paymentIntentId,
    );
    console.log(paymentIntent);
    const customerId = paymentIntent.customer as string;
    console.log(customerId);
    const ephemeralKey = await this.createEphemeralKey(customerId);

    return {
      paymentIntentId: paymentIntent.id,
      paymentIntentSecret: paymentIntent.client_secret,
      customerId,
      ephemeralKeySecret: ephemeralKey.secret,
    };
  };

  private createPaymentIntent = async (customerId: string, price: number) => {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: price,
      currency: constants.PAYMENT.CURRENCY,
      customer: customerId,
    });

    return paymentIntent;
  };

  private createCustomerIfNeeded = async (user: IUser) => {
    const customers = await this.stripe.customers.list({email: user.email});

    let customer: Stripe.Customer = null;
    if (customers.data.length <= 0) {
      customer = await this.stripe.customers.create({
        email: user.email,
      });
    } else {
      customer = customers.data[0];
    }

    return customer;
  };

  private createEphemeralKey = async (customerId: string) => {
    const ephemeralKey = await this.stripe.ephemeralKeys.create(
      {customer: customerId},
      {apiVersion: '2020-08-27'},
    );

    return ephemeralKey;
  };
}
