const chai = require('chai');
const chaiHttp = require('chai-http');

const { app } = require('../server');

// Get should assertion from chai.
const should = chai.should();
const expect = chai.expect();

// Use chaiHttp middleware on chai.
chai.use(chaiHttp);

// Expected outcomes
describe('Recipes', function() {
  it('Should make a GET request to the recipes path.', function(done) {
    chai.request(app)
      .get('/recipes')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.above(0);
      });
    done();
  });

  it('Should make a POST request to the recipes path.', function(done) {
    const newRecipe = {
      name: 'chocolate milkshake',
      ingredients: [
        'Chocolate Syrup',
        'Milk',
        'Vanilla Ice Cream'
      ]
    };
    chai.request(app)
      .post('/recipes')
      .send(newRecipe)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.name.should.equal(newRecipe.name);
        res.body.ingredients.should.be.a('array');
      });
    done();
  });

  it('Should make a PUT request to the recipes path.', function() {
    const updateRecipe = {
      name: 'My New Recipe',
      ingredients: [
        'Ice Cream Cake',
        'Lactaid Milk',
        'Cookie Dough'
      ]
    };
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        updateRecipe.id = res.body[0].id;
        return chai.request(app)
          .put(`/recipes/${updateRecipe.id}`)
          .send(updateRecipe)
      })
      .then(function(res) {
        res.should.have.status(200);
      });
  });

  it('Should make a DELETE request to the recipes path.', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        return chai.request(app)
          .delete(`/recipes/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});
