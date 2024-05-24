import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardTitle, Table, Row, Col, FormGroup, Label, Input } from "reactstrap";
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import axios from "axios";

const fetchDistanceData = async () => {
  try {
    const response = await axios.get("http://192.168.1.20:3000/api/distances");
    return response.data;
  } catch (error) {
    console.error("Error fetching distance data:", error);
    return [];
  }
};

function DistanceTable() {
  const [distanceData, setDistanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await fetchDistanceData();
    setDistanceData(data);
    setFilteredData(data);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    filterData(searchTerm, startTime, endTime, distanceData);
  };

  const handleTimeFilter = () => {
    filterData(searchTerm, startTime, endTime, distanceData);
  };

  const filterData = (searchTerm, startTime, endTime, data) => {
    const filtered = data.filter(item => {
      const itemTime = new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const matchesSearchTerm = 
        item.distance1.toString().includes(searchTerm) || 
        item.distance2.toString().includes(searchTerm) ||
        itemTime.includes(searchTerm);

      const matchesTimeRange = 
        (!startTime || itemTime >= startTime) &&
        (!endTime || itemTime <= endTime);

      return matchesSearchTerm && matchesTimeRange;
    });

    setFilteredData(filtered);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    const sortedData = [...filteredData].sort((a, b) => {
      const valA = key.split('.').reduce((o, i) => o[i], a);
      const valB = key.split('.').reduce((o, i) => o[i], b);

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredData(sortedData);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleBack = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(Math.ceil(filteredData.length / itemsPerPage));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const visiblePageNumbers = pageNumbers.slice(
    Math.max(0, currentPage - 3),
    Math.min(currentPage + 2, pageNumbers.length)
  );

  const renderSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  const paginationStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px'
  };

  const buttonStyle = {
    margin: '0 5px',
    padding: '5px 10px',
    border: '1px solid #ccc',
    background: '#f8f9fa',
    cursor: 'pointer',
  };

  const activeButtonStyle = {
    ...buttonStyle,
    background: '#007bff',
    color: '#fff',
    cursor: 'default',
  };

  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Distance Data</CardTitle>
              </CardHeader>
              <CardBody>
                <FormGroup row>
                  <Label for="search" sm={2}>Search</Label>
                  <Col sm={10}>
                    <Input
                      type="text"
                      name="search"
                      id="search"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="startTime" sm={2}>Start Time</Label>
                  <Col sm={4}>
                    <Input
                      type="time"
                      name="startTime"
                      id="startTime"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </Col>
                  <Label for="endTime" sm={2}>End Time</Label>
                  <Col sm={4}>
                    <Input
                      type="time"
                      name="endTime"
                      id="endTime"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={{ size: 10, offset: 2 }}>
                    <button className="btn btn-primary" onClick={handleTimeFilter}>Filter</button>
                  </Col>
                </FormGroup>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th onClick={() => handleSort('createdAt')} style={{ fontWeight: 'bold' }}>
                        Time {renderSortIcon('createdAt')}
                      </th>
                      <th onClick={() => handleSort('distance1')} style={{ fontWeight: 'bold' }}>
                        Distance Front {renderSortIcon('distance1')}
                      </th>
                      <th onClick={() => handleSort('distance2')} style={{ fontWeight: 'bold' }}>
                        Distance Back {renderSortIcon('distance2')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, index) => (
                      <tr key={index}>
                        <td>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        <td>{item.distance1}</td>
                        <td>{item.distance2}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="pagination" style={paginationStyle}>
                  <button onClick={handleFirstPage} disabled={currentPage === 1} style={buttonStyle}>First</button>
                  <button onClick={handleBack} disabled={currentPage === 1} style={buttonStyle}>Back</button>
                  {visiblePageNumbers.map(number => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      style={number === currentPage ? activeButtonStyle : buttonStyle}
                    >
                      {number}
                    </button>
                  ))}
                  <button onClick={handleNext} disabled={currentPage === pageNumbers.length} style={buttonStyle}>Next</button>
                  <button onClick={handleLastPage} disabled={currentPage === pageNumbers.length} style={buttonStyle}>Last</button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default DistanceTable;
