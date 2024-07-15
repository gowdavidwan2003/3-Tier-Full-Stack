require('dotenv').config(); // Add this line at the top of your test file

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Campground = require('../app/models/campground');
const express = require('express');
const campgroundsRoute = require('../app/routes/campgrounds');
const app = express();

app.use(express.json());
app.use('/campgrounds', campgroundsRoute);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Campgrounds API', () => {
  it('should create a new campground', async () => {
    const newCampground = {
      title: 'Test Camp',
      price: 10,
      description: 'Test description',
      location: 'Test Location',
      geometry: {
        type: 'Point',
        coordinates: [10, 10]
      }
    };

    const response = await request(app)
      .post('/campgrounds')
      .send(newCampground)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.title).toBe('Test Camp');
    expect(response.body.price).toBe(10);
    expect(response.body.description).toBe('Test description');
  });

  it('should get all campgrounds', async () => {
    const response = await request(app)
      .get('/campgrounds')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should get a campground by ID', async () => {
    const campground = new Campground({
      title: 'Test Camp',
      price: 10,
      description: 'Test description',
      location: 'Test Location',
      geometry: {
        type: 'Point',
        coordinates: [10, 10]
      }
    });
    await campground.save();

    const response = await request(app)
      .get(`/campgrounds/${campground._id}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.title).toBe('Test Camp');
  });

  it('should update a campground by ID', async () => {
    const campground = new Campground({
      title: 'Test Camp',
      price: 10,
      description: 'Test description',
      location: 'Test Location',
      geometry: {
        type: 'Point',
        coordinates: [10, 10]
      }
    });
    await campground.save();

    const updatedCampground = {
      title: 'Updated Camp',
      price: 20,
      description: 'Updated description',
    };

    const response = await request(app)
      .put(`/campgrounds/${campground._id}`)
      .send(updatedCampground)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.title).toBe('Updated Camp');
    expect(response.body.price).toBe(20);
    expect(response.body.description).toBe('Updated description');
  });

  it('should delete a campground by ID', async () => {
    const campground = new Campground({
      title: 'Test Camp',
      price: 10,
      description: 'Test description',
      location: 'Test Location',
      geometry: {
        type: 'Point',
        coordinates: [10, 10]
      }
    });
    await campground.save();

    await request(app)
      .delete(`/campgrounds/${campground._id}`)
      .expect(200);

    const foundCampground = await Campground.findById(campground._id);
    expect(foundCampground).toBeNull();
  });
});
