import React, { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import axios from 'axios';
import { Chart } from 'chart.js';

const chartColor = "#18ce0f";

function Dashboard() {
  const [distanceData, setDistanceData] = useState({ distance1: [], distance2: [] });
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchDistanceData = async () => {
      try {
        const response = await axios.get("http://192.168.1.20:3000/api/distances");
        if (response.status === 200) {
          const data = response.data;

          // Extract distance1, distance2, and corresponding times
          const distance1 = data.map(item => item.distance1);
          const distance2 = data.map(item => item.distance2);
          const times = data.map(item => new Date(item.createdAt).toLocaleTimeString()).reverse();

          setDistanceData({ distance1: distance1.reverse(), distance2: distance2.reverse() });
          setLabels(times);
        } else {
          throw new Error('Failed to fetch distance data');
        }
      } catch (error) {
        console.error('Error fetching distance data:', error);
        setDistanceData({ distance1: [], distance2: [] });
      }
    };

    fetchDistanceData();
    const intervalId = setInterval(fetchDistanceData, 1000); // Update every 1 second

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const getLineColor = (value) => {
    if (value < 50) return 'rgba(255, 0, 0, 1)'; // Red for below 50 meters
    if (value >= 50 && value <= 100) return 'rgba(255, 255, 0, 0.6)'; // Yellow for 50 to 100 meters
    return 'rgba(0, 128, 0, 0.3)'; // Green for above 100 meters
  };

  const createChartData = (data, label) => ({
    labels,
    datasets: [
      {
        label: label,
        data,
        borderColor: data.map(value => getLineColor(value)),
        pointBorderColor: "transparent",
        pointBackgroundColor: "transparent",
        pointHoverBackgroundColor: "transparent",
        pointHoverBorderColor: "transparent",
        pointBorderWidth: 0,
        pointHoverRadius: 0,
        pointHoverBorderWidth: 0,
        pointRadius: 0,
        fill: false,
        borderWidth: 1,
        tension: 0.4,
        segment: {
          borderColor: ctx => {
            const value = ctx.p1.parsed.y;
            return getLineColor(value);
          },
        },
      },
    ],
  });

  const createPieData = (data) => {
    const counts = {
      red: data.filter(value => value < 50).length,
      yellow: data.filter(value => value >= 50 && value <= 100).length,
      green: data.filter(value => value > 100).length,
    };

    return {
      labels: ['Below 50', '50 to 100', 'Above 100'],
      datasets: [
        {
          data: [counts.red, counts.yellow, counts.green],
          backgroundColor: ['rgba(255, 0, 0, 1)', 'rgba(255, 255, 0, 0.6)', 'rgba(0, 128, 0, 0.3)'],
        },
      ],
    };
  };

  const chartOptions = {
    scales: {
      x: {
        display: false, // Hide time labels
      },
      y: {
        display: true,
        reverse: true, // Zero at the top
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  const panelHeaderStyle = {
    padding: '10px 0', // Adjust padding to reduce height
    fontSize: '1.5rem', // Adjust font size if needed
  };

  return (
    <>
      <PanelHeader
        size="md"
        content={
          <div className="header text-center" style={panelHeaderStyle}>
            <h2 className="title">Distance Over Time</h2>
            <p className="category">Front and Back Distances</p>
          </div>
        }
      />
      <div className="content">
        <Row>
          <Col xs={12} md={6}>
            <Card>
              <CardHeader>
                <CardTitle>Distance Front</CardTitle>
              </CardHeader>
              <CardBody>
                <Line
                  data={createChartData(distanceData.distance1, "Front")}
                  options={chartOptions}
                />
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Distribution of Distance Front</CardTitle>
              </CardHeader>
              <CardBody>
                <Pie
                  data={createPieData(distanceData.distance1)}
                />
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card>
              <CardHeader>
                <CardTitle>Distance Back</CardTitle>
              </CardHeader>
              <CardBody>
                <Line
                  data={createChartData(distanceData.distance2, "Back")}
                  options={chartOptions}
                />
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Distribution of Distance Back</CardTitle>
              </CardHeader>
              <CardBody>
                <Pie
                  data={createPieData(distanceData.distance2)}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
