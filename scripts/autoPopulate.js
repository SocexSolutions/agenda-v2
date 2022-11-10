const db              = require('../api/lib/db');
const { genPassword } = require('../api/lib/util/password');
const User            = require('../api/lib/models/user');
const Meeting         = require('../api/lib/models/meeting');
const Topic           = require('../api/lib/models/topic');
const Participant     = require('../api/lib/models/participant');
const Takeaway        = require('../api/lib/models/Takeaway');
const { clean }       = require('../api/test/utils/db');
const faker           = require('faker');

const TEST_PASS  = 'test';
const TEST_USER  = 'test';
const TEST_EMAIL = 'test@test.com';

/**
 * Get rand int
 *
 * @param max - max number 
 *
 * @returns {Number}
 */
function rand_int( max ) {
  // add one so that we don't end up with anything empty
  return Math.floor( Math.random() * max ) + 1;
}

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
async function populate_fake_users( count ) {
  const users = [];

  for ( let i = 0; i < count; i++ ) {
    const { hash, salt } = genPassword( faker.internet.password() );

    const user = {
      username: faker.internet.userName(),
      email:    faker.internet.email(),
      hash,
      salt
    };

    users.push( user );
  }

  console.log( '\ninserting users:', users.length );

  return User.insertMany( users );
}

/**
 * Create meetings for testing with provided ownerid
 * @param {Number} count - number of meetings to create
 * @param {String} userId - userId of meeting owner
 * @returns {Promise} - meetings created
 */
async function populate_fake_meetings( count, userId ) {
  const meetings = [];

  for ( let i = 0; i < count; i++ ) {
    const date = Math.random() > .2 ? faker.date.soon() : faker.date.recent();

    const meeting = {
      name:     faker.company.companyName() + ' Acquisition',
      owner_id: userId,
      date
    };

    meetings.push( meeting );
  }

  console.log( '\ninserting meetings:', meetings.length );

  return Meeting.insertMany( meetings );
}

/**
 * Create topics for testing with provided meeting and owner ID
 * @param {Object[]} meetings - existing meetings to add topics for
 * @param {User[]} users - existing users
 * @param {String} userId - userId of meeting owner
 * @returns {Promise} - topics created
 */
async function populate_fake_topics( meetings, users, user_id ) {
  const topics = [];

  for ( const meeting of meetings ) {
    Array.from({ length: rand_int( 7 ) }).forEach( () => {
      const likes = Array.from({ length: rand_int( 10 ) }).forEach( () => {
        return users[ Math.floor( Math.random() * users.length ) ].email;
      });

      topics.push({
        name: faker.lorem.words( rand_int( 7 ) ),
        description: faker.lorem.paragraphs( rand_int( 3 ) ),
        meeting_id: meeting._id,
        owner_id: user_id,
        likes
      });
    });
  }

  console.log( '\ninserting topics:', topics.length );

  const inserted_topics = await Topic.insertMany( topics );

  const takeaways = [];

  for ( const topic of inserted_topics ) {
    Array.from({ length: rand_int( 8 ) }).forEach( () => {
      takeaways.push({
        owner_id: user_id,
        topic_id: topic._id,
        name: faker.random.words( rand_int( 5 ) ),
        description: faker.lorem.paragraphs( rand_int( 3 ) ),
        meeting_id: topic.meeting_id
      });
    });
  }

  console.log( `\ninserting takeaways:`, takeaways.length );

  return Takeaway.insertMany( takeaways );
}

/**
 * Create participants for testing with provided meeting id
 * @param {Object[]} meetings - meetings to add participants to
 * @returns {Promise} - participants created
 */
async function populate_fake_participants( meetings, users ) {
  const participants = [];

  for ( const meeting of meetings ) {
    Array.from({ length: rand_int( 8 ) }).forEach( () => {
      participants.push({
        meeting_id: meeting._id,
        email: users[ Math.floor( Math.random() * users.length ) ].email
      });
    });
  }

  console.log( '\ninserting participants:', participants.length );

  return Participant.insertMany( participants );
}

/**
 * Add test user and some related meetings for local dev
 * @returns {Promise} - database hydrated
 */
async function hydrateDB() {
  try {
    console.log('\nPopulating database...');

    await db.connect();
    await clean();

    const user = await createTestUser();

    const users = await populate_fake_users( 500 );
    const meetings = await populate_fake_meetings( 15, user._id );

    await Promise.all([
      populate_fake_topics( meetings, users, user._id ),
      populate_fake_participants( meetings, users )
    ]);

  } catch ( err ) {
    console.log( err );
  } finally {
    await db.disconnect();
  }
}

hydrateDB();
