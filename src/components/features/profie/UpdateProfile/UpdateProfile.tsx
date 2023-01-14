import { Grid, GridItem } from '@chakra-ui/react';
import React, { useEffect } from 'react';

import { useForm } from '../../../shared';
import DisplayName from './components/DisplayName/DisplayName';
import Email from './components/Email/Email';
import Forename from './components/Forename/Forename';
import Surname from './components/Surname/Surname';
import SelectProfileImage from './components/SelectProfileImage/SelectProfileImage';
import SubmitProfile from './components/SubmitProfile/SubmitProfile';
import About from './components/About/About';
import { UserDataType } from '../../../../types';
import { UpdateProfileFormStateType } from './types';

type Props = Pick<
  UserDataType,
  'about' | 'displayName' | 'email' | 'forename' | 'image' | 'surname'
> & { loading: boolean };
/**
 * @description Values for props should be existing values for the current user. value: string | null | undefined
 * @param {Props['about']} props.about
 * @param {Props['displayName']} props.displayName
 * @param {Props['email']} props.email
 * @param {Props['forename']} props.forename
 * @param {Props['image']} props.image
 * @param {Props['surname']} props.surname
 * @param {Props['loading']} props.loading
 */
const UpdateProfile: React.FC<Props> = ({
  about,
  displayName,
  email,
  forename,
  image,
  surname,
  loading
}) => {
  const { setStateImmutably } = useForm<UpdateProfileFormStateType>();

  useEffect(() => {
    setStateImmutably((state) => {
      state.about = about;
      state.imageFiles = image ? [image] : [];
      state.displayName = displayName;
      state.email = email;
      state.forename = forename;
      state.surname = surname;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const user = {
    about,
    image,
    displayName,
    email,
    forename,
    surname
  };

  return (
    <Grid
      templateColumns={`repeat(6, 1fr)`}
      gap={4}
      maxW="5xl"
      minW="5xl"
      mt={4}
    >
      <GridItem colSpan={4}>
        <SelectProfileImage />
      </GridItem>
      <GridItem colSpan={4}>
        <Forename />
      </GridItem>
      <GridItem colSpan={4}>
        <Surname />
      </GridItem>
      <GridItem colSpan={4}>
        <Email />
      </GridItem>
      <GridItem colSpan={4}>
        <DisplayName />
      </GridItem>
      <GridItem colSpan={4}>
        <About />
      </GridItem>
      <GridItem colSpan={4} mt={8}>
        <SubmitProfile user={user} />
      </GridItem>
    </Grid>
  );
};

export default UpdateProfile;
