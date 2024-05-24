import React from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader, CardTitle, Button } from 'reactstrap';

function SafeFollowingDistance() {
  // Constants for calculation
  const feetPerMile = 5280;
  const mph = 65;
  const seconds = 2; // Updated to 2 seconds

  // Calculate the safe following distance in feet
  const feetPerHour = feetPerMile * mph;
  const feetPerMinute = feetPerHour / 60;
  const feetPerSecond = feetPerMinute / 60;
  const safeDistanceFeet = feetPerSecond * seconds;

  // Convert feet to meters (1 foot = 0.3048 meters)
  const safeDistanceMeters = (safeDistanceFeet * 0.3048).toFixed(2);

  return (
    <Container className="mt-4">
      <Row>
        <Col md={{ size: 8, offset: 2 }}>
          <Card>
            <CardHeader>
              <CardTitle tag="h2">What Is a Safe Following Distance?</CardTitle>
              <p>Published: June 8, 2021</p>
            </CardHeader>
            <CardBody>
              <p>
                You're driving down the road, look in your rear-view mirror, and realize the car behind you is way too close. If you need to stop abruptly, they'll surely slam into the back of you. This situation can be frustrating and dangerous which is why it's so important to give the cars around you enough space. But what is a safe following distance?
              </p>
              <h4>What Is a Safe Following Distance While Driving?</h4>
              <p>
                When you're driving behind another vehicle, you can determine a safe distance between cars with the two-second rule. That means that when a car passes any given point, you should be able to count to at least two (one Mississippi, two Mississippi) before you cross that same point.
              </p>
              <p>
                This is just the minimum safe distance between cars. More space is better when possible and is recommended when the road conditions aren't ideal. You'll also want to give yourself more space if you're driving a larger vehicle and/or towing a trailer, as it will take longer to stop.
              </p>
              <p>
                <strong>While some guidelines may suggest a three-second rule, the two-second rule is the internationally accepted standard.</strong>
              </p>
              <h4>How Many Feet Should You Stay Behind a Car?</h4>
              <p>
                Now that you know the two-second rule, how does it translate into the number of feet you should leave between you and the car in front of you?
              </p>
              <p>
                Start with the number of feet in a mile; 5,280. You'll want to multiply your speed by 5,280. So if you are traveling at 65 MPH, you would multiply 5280*65 and find out you drive 343,200 feet in an hour.
              </p>
              <p>
                Next, divide the feet per hour by the number of minutes in an hour (60). In this case, 343,200/60 gives you 5,720 feet per minute.
              </p>
              <p>
                Then, you'll want to divide the feet per minute by the number of seconds in a minute (60). In this case, 5,720/60 is about 95 feet.
              </p>
              <p>
                Lastly, take the number of feet per second and multiply it by two to get your safe following distance. In this case, 95*2 tells you that a safe distance between cars driving 65 MPH is 190 feet.
              </p>
              <p>
                This formula can help you to figure out a safe driving distance in terms of feet based on your speed. Of course, you'll want to figure this out before getting behind the wheel.
              </p>
              <h4>Safe Following Distance in Meters</h4>
              <p>
                For those who prefer metric measurements, the safe following distance for a car traveling at 65 MPH is approximately {safeDistanceFeet} feet or <strong>{safeDistanceMeters} meters</strong>.
              </p>
              <h4>Adjusting Following Distance for Different Traffic Conditions</h4>
              <p>
                While the two-second rule is a good baseline, the ideal following distance can vary based on traffic conditions:
              </p>
              <ul>
                <li>
                  <strong>Heavy Traffic:</strong> In heavy traffic, it may not be possible to maintain a two-second gap. However, strive to keep as much distance as possible to allow for sudden stops.
                </li>
                <li>
                  <strong>Free Flowing Traffic:</strong> On highways or roads with free-flowing traffic, the two-second rule is easier to maintain and provides ample time to react.
                </li>
                <li>
                  <strong>Adverse Weather Conditions:</strong> Increase your following distance beyond two seconds during rain, fog, or icy conditions. A three to four-second gap can provide additional safety.
                </li>
                <li>
                  <strong>Night Driving:</strong> At night, it’s harder to judge distances and speeds. Increasing the following distance slightly can help compensate for reduced visibility.
                </li>
                <li>
                  <strong>Behind Large Vehicles:</strong> When driving behind trucks or buses, increase your following distance to see around the vehicle and have more time to react.
                </li>
              </ul>
              <h4>Why Is a Safe Following Distance Important?</h4>
              <p>
                Car accidents that involve one vehicle rear-ending another are one of the most common types of accidents and also one of the most dangerous. A study by the National Highway Traffic Safety Administration found that almost 30% of all traffic accidents that result in a serious injury are caused by rear-end collisions.
              </p>
              <p>
                You can help avoid hitting someone else or being hit by following the two-second rule whenever possible. If someone is too close behind you, it's best to let them pass so they aren't too close to stop in time, when necessary.
              </p>
              <h4>Defensive Driving Techniques Can Keep You Safe on the Road</h4>
              <p>
                When heading out on the road, it's important to be aware of what can go wrong. Then, you can take proactive steps to prevent accidents. For example, by knowing rear-end collisions are common and dangerous, you can ensure you keep a safe following distance and that others aren't too close behind you.
              </p>
              <Button color="primary" href="https://driversed.com/trending/what-safe-following-distance" target="_blank">
                Learn more about safe distances
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SafeFollowingDistance;
