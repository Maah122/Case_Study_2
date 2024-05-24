import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader, CardTitle, Spinner } from 'reactstrap';
import axios from 'axios';

function DriverAnalysis() {
  const [distanceData, setDistanceData] = useState([]);
  const [metrics, setMetrics] = useState({ averageDistance: 0, minDistance: 0 });
  const [driverProfile, setDriverProfile] = useState({ profile: '', color: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistanceData = async () => {
      try {
        const response = await axios.get("http://192.168.1.20:3000/api/distances");
        if (response.status === 200) {
          const data = response.data;
          setDistanceData(data);
          const calculatedMetrics = calculateMetrics(data);
          setMetrics(calculatedMetrics);
          const profile = analyzeDriverProfile(calculatedMetrics);
          setDriverProfile(profile);
        } else {
          console.error('Failed to fetch distance data');
        }
      } catch (error) {
        console.error('Error fetching distance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistanceData();
  }, []);

  const calculateMetrics = (data) => {
    const totalDistance = data.reduce((sum, item) => sum + item.distance1, 0);
    const minDistance = Math.min(...data.map(item => item.distance1));
    const averageDistance = totalDistance / data.length;

    return { averageDistance, minDistance };
  };

  const analyzeDriverProfile = (metrics) => {
    const safeThreshold = 100; // Safe following distance in centimeters
    const moderateThreshold = 50; // Moderate following distance in centimeters

    if (metrics.averageDistance >= safeThreshold) {
      return { profile: 'Safe Driver', color: 'green' };
    } else if (metrics.averageDistance >= moderateThreshold && metrics.averageDistance < safeThreshold) {
      return { profile: 'Moderate Driver', color: 'yellow' };
    } else {
      return { profile: 'Risky Driver', color: 'red' };
    }
  };

  const renderCircleGraph = (profile) => {
    const circleStyle = {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      border: `10px solid ${profile.color}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '20px',
      color: profile.color,
      textAlign: 'center',
    };

    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <div style={circleStyle}>
          {profile.profile}
        </div>
      </div>
    );
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={{ size: 8, offset: 2 }}>
          <Card>
            <CardHeader>
              <CardTitle tag="h2">Driver Analysis</CardTitle>
            </CardHeader>
            <CardBody>
              {loading ? (
                <Spinner color="primary" />
              ) : (
                <>
                  <p><strong>Average Following Distance:</strong> {metrics.averageDistance.toFixed(2)} centicentimeters</p>
                  <p><strong>Minimum Following Distance:</strong> {metrics.minDistance.toFixed(2)} centicentimeters</p>
                  <h4>Driver Profile: <strong style={{ color: driverProfile.color }}>{driverProfile.profile}</strong></h4>
                  <p>
                    Based on the analysis of your following distance data, you are classified as a <strong style={{ color: driverProfile.color }}>{driverProfile.profile}</strong>. 
                    Maintaining a safe following distance is crucial for preventing rear-end collisions and ensuring road safety.
                  </p>
                  <p>
                    <strong>How We Calculate Your Driver Profile:</strong>
                    <ul>
                      <li><strong>Total Distance:</strong> Sum of all front distances recorded.</li>
                      <li><strong>Average Distance:</strong> Total Distance divided by the number of data points.</li>
                      <li><strong>Minimum Distance:</strong> The smallest front distance recorded.</li>
                      <li><strong>Profile Classification:</strong>
                        <ul>
                          <li><strong>Safe Driver:</strong> If your average following distance is greater than or equal to 100 centimeters.</li>
                          <li><strong>Moderate Driver:</strong> If your average following distance is between 50 centimeters and 100 centimeters.</li>
                          <li><strong>Risky Driver:</strong> If your average following distance is less than 50 centimeters.</li>
                        </ul>
                      </li>
                    </ul>
                  </p>
                  {renderCircleGraph(driverProfile)}
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DriverAnalysis;
