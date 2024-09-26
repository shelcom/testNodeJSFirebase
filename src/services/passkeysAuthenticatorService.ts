import PasskeysAuthenticatorRepository from 'repositories/passkeysAuthenticatorRepository';
import {injectable} from 'tsyringe';
import {VerifiedRegistrationResponse} from '@simplewebauthn/server';
import ApiError from 'errors/ApiError';
import strings from 'strings';
import {convertToBinaryFromBuffer} from 'helpers/convertBinary';

@injectable()
export class PasskeysAuthenticatorService {
  constructor(
    private passkeysAuthenticatorRepository: PasskeysAuthenticatorRepository,
  ) {}

  create = async (
    userPasskeysId: number,
    response: VerifiedRegistrationResponse,
  ) => {
    const authenticator =
      await this.passkeysAuthenticatorRepository.findOneByCondition({
        user_passkeys_id: userPasskeysId,
      });

    if (authenticator) {
      throw ApiError.unprocessableEntity(strings.user.alreadyFinalized);
    }

    await this.passkeysAuthenticatorRepository.create({
      credential_id: convertToBinaryFromBuffer(
        response.registrationInfo.credentialID,
      ),
      credential_public_key: convertToBinaryFromBuffer(
        response.registrationInfo.credentialPublicKey,
      ),
      counter: response.registrationInfo.counter,
      user_passkeys_id: userPasskeysId,
    });
  };
}
