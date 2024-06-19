import React, { useState } from 'react';
import { Box, Button, Input, Table, Thead, Tbody, Tr, Th, Td, IconButton } from '@chakra-ui/react';
import { FaTrash, FaDownload } from 'react-icons/fa';
import { CSVReader } from 'react-papaparse';
import { CSVLink } from 'react-csv';

const Index = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleOnDrop = (data) => {
    const headers = data[0].meta.fields;
    const rows = data.map(row => row.data);
    setHeaders(headers);
    setData(rows);
  };

  const handleOnError = (err) => {
    console.error(err);
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => ({ ...acc, [header]: '' }), {});
    setData([...data, newRow]);
  };

  const handleRemoveRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleInputChange = (index, header, value) => {
    const newData = [...data];
    newData[index][header] = value;
    setData(newData);
  };

  return (
    <Box p={4}>
      <CSVReader onDrop={handleOnDrop} onError={handleOnError} addRemoveButton>
        <span>Drop CSV file here or click to upload.</span>
      </CSVReader>
      {data.length > 0 && (
        <>
          <Table variant="simple" mt={4}>
            <Thead>
              <Tr>
                {headers.map((header, index) => (
                  <Th key={index}>{header}</Th>
                ))}
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((row, rowIndex) => (
                <Tr key={rowIndex}>
                  {headers.map((header, colIndex) => (
                    <Td key={colIndex}>
                      <Input
                        value={row[header]}
                        onChange={(e) => handleInputChange(rowIndex, header, e.target.value)}
                      />
                    </Td>
                  ))}
                  <Td>
                    <IconButton
                      icon={<FaTrash />}
                      onClick={() => handleRemoveRow(rowIndex)}
                      aria-label="Remove row"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Button mt={4} onClick={handleAddRow}>Add Row</Button>
          <Button mt={4} ml={2}>
            <CSVLink data={data} headers={headers} filename={"edited_data.csv"}>
              <FaDownload /> Download CSV
            </CSVLink>
          </Button>
        </>
      )}
    </Box>
  );
};

export default Index;