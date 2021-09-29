const db = require( "../db" );
const ObjectID = require( "mongoose" ).Types.ObjectId;
const { genPassword } = require( "./password" );
const user = require( "../models/user" );
const meeting = require( "../models/meeting" );
const { clean } = require( "../../test/utils/db" );

const testPassword = "pass";

const { hash, salt } = genPassword( testPassword );

async function hydrateDB() {
  await db.connect();

  await clean();

  const promises = [];

  promises.push(
    user.create({
      username: "Johnny Test",
      email: "JTest@socex.com",
      hash,
      salt,
    })
  );

  promises.push(
    user.create({
      username: "zbarnz",
      email: "zbarnz@socnet.org",
      hash,
      salt,
    })
  );

  promises.push(
    meeting.create({
      name: "Simple Hash Ring Algorithm",
      owner_id: new ObjectID(),
      date: "Monday",
    })
  );

  promises.push(
    meeting.create({
      name: "Discussion of de-obuscating firewalls",
      owner_id: new ObjectID(),
      date: "01/23/22",
    })
  );

  await Promise.all( promises );

  console.log( await user.find({}) );

  await db.disconnect();
}

hydrateDB();
