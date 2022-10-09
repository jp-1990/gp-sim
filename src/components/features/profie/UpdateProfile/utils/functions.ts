import { FormStateType } from '../../../../shared/Form/types';
import { UpdateProfileFormStateType } from '../types';
import { UpdateUserProfileDataType } from '../../../../../types';

interface MapUpdateProfileFormStateToRequestInputArgs {
  formState: FormStateType<UpdateProfileFormStateType>;
  user: any | undefined;
}
export const mapUpdateProfileFormStateToRequestInput = ({
  formState,
  user
}: MapUpdateProfileFormStateToRequestInputArgs): Omit<
  UpdateUserProfileDataType,
  'imageFiles'
> => {
  if (process.env.NODE_ENV === 'development') {
    user = {
      sub: `${new Date(Date.now()).valueOf()}`,
      displayName: 'dev-testing',
      image: ''
    };
  }
  if (!user?.sub) throw new Error('No user found');
  return {
    id: user.sub,
    about: formState.about || '',
    forename: formState.forename || '',
    surname: formState.surname || '',
    displayName: formState.displayName,
    email: formState.email
  };
};
