const db              = require( "../api/lib/db" );
const ObjectID        = require( "mongoose" ).Types.ObjectId;
const { genPassword } = require( "../api/lib/utils/password" );
const User            = require( "../api/lib/models/user" );
const Meeting         = require( "../api/lib/models/meeting" );
const { clean }       = require( "../api/test/utils/db" );
const faker           = require( "faker" );
const assert          = require( "assert" );

const TEST_PASS  = "test";
const TEST_USER  = "test";
const TEST_EMAIL = "test@test.com";

/**
 * Create the user for testing
 * @returns {Promise} test user doc
 */
async function createTestUser() {
  const { hash, salt } = genPassword( TEST_PASS );

  return User.create({
    username: TEST_USER,
    email:    TEST_EMAIL,
    hash,
    salt
  });
}

/**
 * Create users for testing
 * @param {Number} count - number of users
 * @returns {Promize} - users created
 */
async function populateFakeUsers( count ) {
  const users = [];

  for ( let i = 0; i < count; i++ ) {
    let { hash, salt } = genPassword( faker.internet.password() );

    const user = {
      username: faker.internet.userName(),
      email:    faker.internet.email(),
      hash,
      salt
    };

    users.push( user );
  }

  return User.insertMany( users );
}

/**
 * Create meetings for testing with provided ownerid
 * @param {Number} count - number of meetings to create
 * @param {String} userId - userId of meeting owner
 * @returns {Promise} - meetings created
 */
async function populateFakeMeetings( count, userId ) {
  const meetings = [];

  for ( let i = 0; i < count; i++ ) {
    const date = Math.random() > .2 ? faker.date.soon() : faker.date.recent();

    const meeting = {
      name:     faker.company.companyName() + " Acquisition",
      owner_id: userId,
      date
    };

    meetings.push( meeting );
  }

  return Meeting.insertMany( meetings );
}

/**
 * Add test user and some related meetings for local dev
 * @returns {Promise} - database hydrated
 */
async function hydrateDB() {
  try {
    await db.connect();
    await clean();

    const user = await createTestUser();

    await populateFakeUsers( 30 );
    await populateFakeMeetings( 10, user._id );

    const users = await User.find({});
    assert( users.length === 31, "Error ocurred in user creation." );

    const meetings = await Meeting.find({});
    assert( meetings.length === 10, "Error ocurred in meeting creation." );

  } catch ( err ) {
    console.log( err );
  } finally {
    await db.disconnect();
  }
}

hydrateDB();
