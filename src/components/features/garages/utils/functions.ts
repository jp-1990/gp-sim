import { UserProfile } from '@auth0/nextjs-auth0';

import { FormStateType } from '../../../shared/Form/types';
import { CreateGarageFormStateType } from '../types';
import { CreateGarageDataType } from '../../../../types';

interface MapCreateGarageFormStateToRequestInputArgs {
  formState: FormStateType<CreateGarageFormStateType>;
  user: UserProfile | undefined;
}
export const mapCreateGarageFormStateToRequestInput = ({
  formState,
  user
}: MapCreateGarageFormStateToRequestInputArgs): Omit<
  CreateGarageDataType,
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
    title: formState.title,
    description: formState.description,
    creator: {
      id: user.sub,
      displayName: user.nickname || '',
      image: user.picture
    }
  };
};
