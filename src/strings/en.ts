const en = {
  common: {
    notAuthorized: 'Not authorized',
    validationError: 'Validation error',
    unknownError: 'Unknown error!',
    forbidden: 'You do not have access.',
  },
  user: {
    emailAlreadyInUse: 'Such email is already in use',
    isNotRegistered: "Such user hasn't been registered.",
    wrongPassword: 'Wrong password',
    wrongUserId: 'Wrong user id',
    alreadyFinalized: 'Already finalized',
    userWasNotFound: 'User was not found',
    tokenWasExpired:
      'This token is not active now! Please resend the mail again.',
    wasNotVerifiedForSomeReason: 'The user was not verified for some reason.'
  },
  restaurant: {
    restaurantAlreadyExist: 'This name is already taken.',
    restaurantNotFound: 'This restaurant was not found.',
  },
  dish: {
    dishAlreadyExist: 'This name is already taken.',
    dishNotFound: 'This dish was not found.',
  },
  image: {
    format: 'Only images are allowed',
    imageNotFound: 'This image was not found.',
    imageWasNotFoundInBody: 'This image was not found in body',
    imageHasNotBeenUploaded:
      'This image was not found on our server. Please upload firstly and try again.',
  },
  order: {
    orderNotFound: 'This order was not found.',
  },
  mail: {
    forgetPasswordSubject: 'Recovering account',
    forgetPasswordText: (token: string) => `Recover there ${token}`,
    emailHasBeenSent: 'The mail with details has been successfully sent',
  },
  chat: {
    idsTheSame: 'You cannot create chat with your user id',
    notFound: 'This chat was not found.',
  },
  message: {
    notFound: 'This message was not found.',
  },
  chatSocket: {
    successfullyJoinedChat: 'You have successfully joined to chat',
    successfullyLeavedChat: 'You have successfully leaved to chat',
    messageSaved: 'Message saved',
  },
  locationSocket: {
    subscribedToOrder:
      'You have successfully subscribed to order for checking delivery updates.',
    unsubscribedToOrder: 'You have successfully unsubscribed from order.',
  },
  comment: {
    notFound: 'This comment was not found.',
  },
  payment: {
    notFound: 'This payment was not found',
    notConfirmed: 'This payment is still waiting for payment.',
  },
  purchase: {
    receiptNotValid: 'This receipt is not valid',
    receiptsAlreadyExist: 'This receipt is already using',
  },
  notification: {
    newOrdersAreAvailableNow: 'New orders are available now!',
    newRestaurantsAreAvailableNow:
      'New restaurants are available now! Just open the app and look at these ones!',
  },
};

export default en;
