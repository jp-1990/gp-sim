import {
  IoCarSportSharp as Car,
  IoTrashOutline as Delete,
  IoEyeOutline as View
} from 'react-icons/io5';
import { IoMdPeople as People } from 'react-icons/io';
import {
  AiOutlinePlus as Add,
  AiOutlinePlusCircle as AddCircle,
  AiOutlineDownload as Download,
  AiFillEdit as Edit,
  AiOutlineUpload as Upload
} from 'react-icons/ai';

import { IconBaseProps, IconContext, IconType } from 'react-icons';
import { Tooltip } from '@chakra-ui/react';
import { ReactNode } from 'react';

const withProvider = (Icon: IconType) => {
  const Icon_ = ({
    value,
    tooltip,
    ...iconProps
  }: {
    value?: IconContext;
    tooltip?: ReactNode;
  } & IconBaseProps) => {
    const defaultValue = {
      size: '1.5em'
    };
    let value_ = value ?? defaultValue;
    if (value) value_ = { ...defaultValue, ...value };

    return (
      <IconContext.Provider value={value_}>
        <Tooltip label={tooltip || ''}>
          <span>
            <Icon {...iconProps} />
          </span>
        </Tooltip>
      </IconContext.Provider>
    );
  };
  return Icon_;
};

export const Icons = {
  Add: withProvider(Add),
  AddCircle: withProvider(AddCircle),
  Car: withProvider(Car),
  Delete: withProvider(Delete),
  Download: withProvider(Download),
  Edit: withProvider(Edit),
  People: withProvider(People),
  Upload: withProvider(Upload),
  View: withProvider(View)
};
