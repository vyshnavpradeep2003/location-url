import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  const [userPosition, setUserPosition] = useState(null);
  const [websitePosition, setWebsitePosition] = useState(null);
  const [domain, setDomain] = useState('');
  const [error, setError] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserPosition({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      }, () => {
        setError('Unable to retrieve your location');
      });
    } else {
      setError('Geolocation is not supported by this browser');
    }
  };

  const locateWebsite = async () => {
    const domainPattern = /^(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    if (!domainPattern.test(domain)) {
      setError('Please enter a valid domain');
      return;
    }

    try {
      const response = await axios.get(`https://cors-anywhere.herokuapp.com/http://ip-api.com/json/${domain}`);
      if (response.data.status === 'success') {
        setWebsitePosition({
          lat: response.data.lat,
          lon: response.data.lon,
          city: response.data.city,
          country: response.data.country,
        });
        setError(null);
      } else {
        setError('Unable to locate the website');
      }
    } catch {
      setError('Error while locating the website');
    }
  };

  const resetLocation = () => {
    setUserPosition(null);
  };

  return (
    <Container>
      <Row className="mt-3">
        <Col>
          <h1>GeoLocation App</h1>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md={6}>
          <Button onClick={getLocation}>My Location</Button>
          <Button variant="danger" className="ml-3" onClick={resetLocation}>Reset Location</Button>
        </Col>
        <Col md={6}>
          <Form>
            <Form.Group>
              <Form.Label>Website Domain</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter domain (e.g., www.example.com)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </Form.Group>
            <Button onClick={locateWebsite}>Locate</Button>
          </Form>
        </Col>
      </Row>
      {error && <Row className="mt-3">
        <Col>
          <Alert variant="danger">{error}</Alert>
        </Col>
      </Row>}
      <Row className="mt-3">
        <Col>
          <MapContainer center={[51.505, -0.09]} zoom={2} style={{ height: '500px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {userPosition && (
              <Marker position={[userPosition.lat, userPosition.lon]}>
                <Popup>Your Location</Popup>
              </Marker>
            )}
            {websitePosition && (
              <Marker position={[websitePosition.lat, websitePosition.lon]}>
                <Popup>
                  Website Location<br />
                  {websitePosition.city}, {websitePosition.country}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
