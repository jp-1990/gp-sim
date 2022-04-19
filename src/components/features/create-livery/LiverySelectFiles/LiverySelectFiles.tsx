import React from 'react';
import { Button, Flex, Grid, GridItem } from '@chakra-ui/react';
import { FormattedMessage } from 'react-intl';

import { SelectFiles } from '../../../shared';
import { commonStrings, formStrings } from '../../../../utils/intl';
import { stateKeys, validators } from '../config';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  DYNAMIC_LIVERY_FILE_NAME,
  LIVERY_FILE_NAMES
} from '../../../shared/Form/utils';

interface TableRowProps {
  requiredName: string;
  selectedName?: string;
  approved?: boolean;
  onRemove?: () => void;
}
const TableRow: React.FC<TableRowProps> = ({
  requiredName,
  selectedName = '-',
  approved,
  onRemove
}) => {
  const isApproved = (bool?: boolean) => {
    if (bool) return <CheckIcon w={3} h={3} color="green" />;
    return <CloseIcon w={3} h={2} color="red" />;
  };
  return (
    <GridItem colSpan={12} rowSpan={1}>
      <Grid
        templateColumns="repeat(12, 1fr)"
        templateRows="repeat(1,minmax(2rem, 2rem))"
      >
        <GridItem fontSize={'sm'} rowSpan={1} colSpan={4}>
          {requiredName}
        </GridItem>
        <GridItem fontSize={'sm'} rowSpan={1} colSpan={6}>
          {selectedName}
        </GridItem>
        <GridItem
          fontSize={'sm'}
          rowSpan={1}
          colSpan={1}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          mr={4}
        >
          {isApproved(approved)}
        </GridItem>
        <GridItem
          fontSize={'sm'}
          rowSpan={1}
          colSpan={1}
          alignItems="center"
          justifyContent="flex-end"
          mt={1}
        >
          {selectedName !== '-' && (
            <Button
              h={4}
              variant="ghost"
              lineHeight={1}
              fontSize={'xs'}
              colorScheme="red"
              onClick={onRemove}
            >
              <FormattedMessage {...commonStrings.remove} />
            </Button>
          )}
        </GridItem>
      </Grid>
    </GridItem>
  );
};

const LiverySelectFiles = () => {
  return (
    <SelectFiles<typeof stateKeys.LIVERY_FILES>
      max={5}
      validators={validators.liveryFiles}
      stateKey={stateKeys.LIVERY_FILES}
      label={<FormattedMessage {...formStrings.selectLiveryFiles} />}
      accept=".json,.dds,.png"
      helperText={
        <FormattedMessage {...formStrings.selectLiveryFilesHelperText} />
      }
    >
      {(state, onRemove) => {
        if (!state) return null;
        const { [stateKeys.LIVERY_FILES]: files } = { ...state };
        const stateFiles = [...files];

        const getId = (files: File[], name: string) =>
          files.findIndex((f) => f.name === name);

        const tableRows = () => {
          const requiredFiles = [
            {
              name: DYNAMIC_LIVERY_FILE_NAME,
              regex: /^[a-zA-Z0-9]+([-_\s]{1}[a-zA-Z0-9]+)(\.json)/g,
              file: undefined,
              index: 0
            },
            ...LIVERY_FILE_NAMES.map((name, index) => ({
              name,
              regex: new RegExp(`^${name}$`, 'g'),
              file: undefined,
              index: index + 1
            }))
          ];

          const availableIndexes = requiredFiles.map((_, i) => i);
          const outputRows = Array.from(Array(5));

          for (const { name, regex, index } of requiredFiles) {
            const targetFile = stateFiles.find((f, i) => {
              if (f.name.match(regex)) {
                stateFiles.splice(i, 1);
                return true;
              }
            });

            if (targetFile) {
              const approved = !!targetFile.name;
              outputRows[index] = (
                <TableRow
                  key={name}
                  requiredName={name}
                  selectedName={targetFile.name}
                  approved={approved}
                  onRemove={() => onRemove(getId(files, targetFile.name))}
                />
              );
              const indexToRemove = availableIndexes.findIndex(
                (i) => i === index
              );
              availableIndexes.splice(indexToRemove, 1);
            } else {
              outputRows[index] = <TableRow key={name} requiredName={name} />;
            }
          }
          for (const file of stateFiles) {
            const index = availableIndexes[0];
            outputRows[index] = (
              <TableRow
                key={requiredFiles[index].name}
                requiredName={requiredFiles[index].name}
                selectedName={file.name}
                approved={false}
                onRemove={() => onRemove(getId(files, file.name))}
              />
            );
            availableIndexes.shift();
          }
          return outputRows;
        };
        return (
          <>
            <Grid
              templateColumns="repeat(12, 1fr)"
              templateRows="repeat(6,minmax(2rem, 2rem))"
              gap={1}
              w="5xl"
              my={3}
              pl={3}
            >
              <GridItem
                fontWeight={'bold'}
                color="gray.800"
                rowSpan={1}
                colSpan={4}
              >
                <FormattedMessage {...commonStrings.requiredFiles} />
              </GridItem>
              <GridItem
                fontWeight={'bold'}
                color="gray.800"
                rowSpan={1}
                colSpan={6}
              >
                <FormattedMessage {...commonStrings.currentlySelected} />
              </GridItem>
              <GridItem
                fontWeight={'bold'}
                color="gray.800"
                rowSpan={1}
                colSpan={1}
              >
                <FormattedMessage {...commonStrings.approved} />
              </GridItem>
              <GridItem rowSpan={1} colSpan={1}></GridItem>
              {tableRows()}
            </Grid>
          </>
        );
      }}
    </SelectFiles>
  );
};

export default LiverySelectFiles;
