const { Sequelize } = require("sequelize");

const CrudRepository = require("./crud-repositories");
const { Flight, Airplane, Airport, City } = require("../models");
const db = require("../models");
const { addRowLockOnFlights } = require("./queries");

class FlightRepository extends CrudRepository {
  constructor() {
    super(Flight);
  }

  /**
   * Get all flights with filters, sorting, and associations
   */
  async getAllFlights(filter, sort) {
    const response = await Flight.findAll({
      where: filter,
      order: sort,
      include: [
        {
          model: Airplane,
          required: true,
          as: "airplane_detail", 
        },
        {
          model: Airport,
          required: true,
          as: "departure_airport", 
          on: {
            col1: Sequelize.where(
              Sequelize.col("Flight.departureAirportId"),
              "=",
              Sequelize.col("departure_airport.code") 
            ),
          },
          include: {
            model: City,
            required: true,
          },
        },
        {
          model: Airport,
          required: true,
          as: "arrival_airport", 
          on: {
            col1: Sequelize.where(
              Sequelize.col("Flight.arrivalAirportId"),
              "=",
              Sequelize.col("arrival_airport.code") 
            ),
          },
          include: {
            model: City,
            required: true,
          },
        },
      ],
    });
    return response;
  }

  /**
   * Update remaining seats safely (with row lock)
   */
  async updateRemainingSeats(flightId, seats, dec = true) {
    const transaction = await db.sequelize.transaction();
    await db.sequelize.query(addRowLockOnFlights(flightId));

    const flight = await Flight.findByPk(flightId);

    //  Normalize dec to boolean
    const decStr = String(dec).toLowerCase().trim();
    const shouldDecrease = decStr === "true" || decStr === "1";

    console.log(
      "Normalized dec flag:",
      decStr,
      "Should decrease:",
      shouldDecrease
    );

    if (shouldDecrease) {
      await flight.decrement("totalSeats", { by: seats }, { transaction });
    } else {
      await flight.increment("totalSeats", { by: seats }, { transaction });
    }

    const updatedFlight = await Flight.findByPk(flightId);
    return updatedFlight;
  }
}

module.exports = FlightRepository;
