import {
  generateRegistrationOptions,
  VerifiedAuthenticationResponse,
  VerifiedRegistrationResponse,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import ApiError from 'errors/ApiError';
import {IUser} from 'models/database/user';
import UserPasskeysRepository from 'repositories/userPasskeysRepository';
import {injectable} from 'tsyringe';
import strings from 'strings';
import {PasskeysAuthenticatorService} from './passkeysAuthenticatorService';
import {IUserPasskeys} from 'models/database/userPasskeys';
import {convertFromBinaryToBuffer} from 'helpers/convertBinary';

export interface RegistrationPasskeysOptionsModel {
  id: string;
  rawId: string;
  type: string;
  response: {
    attestationObject: string;
    clientDataJSON: string;
  };
}

export interface LoginPasskeysOptionsModel {
  email: string;
  id: string;
  rawId: string;
  type: string;
  response: {
    authenticatorData: string;
    clientDataJSON: string;
    signature: string;
    userHandle: string;
  };
}

@injectable()
export class UserPasskeysService {
  constructor(
    private userPasskeysRepository: UserPasskeysRepository,
    private passkeysAuthenticatorService: PasskeysAuthenticatorService,
  ) {}

  createForRegistration = async (user: IUser) => {
    const options = generateRegistrationOptions({
      rpName: process.env.RP_NAME,
      rpID: process.env.RP_ID,
      userID: user.id.toString(),
      userName: user.email,
    });

    await this.userPasskeysRepository.create({
      user_id: user.id,
      challenge: options.challenge,
    });

    return options.challenge;
  };

  verifyRegistration = async (
    userPasskeysId: number,
    registrationOptions: RegistrationPasskeysOptionsModel,
  ) => {
    const userPasskeys = await this.userPasskeysRepository.findOneByCondition({
      id: userPasskeysId,
    });

    if (!userPasskeys) {
      throw ApiError.badRequest(strings.user.userWasNotFound);
    }

    let verification: VerifiedRegistrationResponse;
    try {
      verification = await verifyRegistrationResponse({
        credential: {
          ...registrationOptions,
          clientExtensionResults: {},
        },
        expectedChallenge: userPasskeys.challenge,
        expectedOrigin: process.env.ORIGIN,
      });
    } catch (error) {
      throw ApiError.unprocessableEntity(error.message);
    }

    if (!verification.verified) {
      throw ApiError.unprocessableEntity(
        strings.user.wasNotVerifiedForSomeReason,
      );
    }

    userPasskeys.credential_id = registrationOptions.id;
    await this.userPasskeysRepository.update(userPasskeys);

    await this.passkeysAuthenticatorService.create(
      userPasskeys.id,
      verification,
    );
  };

  verifyLogin = async (
    userPasskeys: IUserPasskeys,
    loginOptions: LoginPasskeysOptionsModel,
  ) => {
    let verification: VerifiedAuthenticationResponse;
    try {
      verification = verifyAuthenticationResponse({
        credential: {
          ...loginOptions,
          clientExtensionResults: {},
        },
        expectedChallenge: userPasskeys.challenge,
        expectedOrigin: process.env.ORIGIN,
        expectedRPID: process.env.RP_ID,
        authenticator: {
          credentialID: convertFromBinaryToBuffer(
            userPasskeys.authenticator.credential_id,
          ),
          credentialPublicKey: convertFromBinaryToBuffer(
            userPasskeys.authenticator.credential_public_key,
          ),
          counter: userPasskeys.authenticator.counter,
        },
      });
    } catch (error) {
      throw ApiError.unprocessableEntity(error.message);
    }

    if (!verification.verified) {
      throw ApiError.unprocessableEntity(
        strings.user.wasNotVerifiedForSomeReason,
      );
    }
  };
}
