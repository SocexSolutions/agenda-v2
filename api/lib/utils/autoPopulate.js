const db = require( "../db" );
const ObjectID = require( "mongoose" ).Types.ObjectId;

async function Populate() {
  await db.connect();
  insert();
  console.log( db.user );
}

function insert() {
  db.user.insertOne({
    username: "Johnny Test",
    email: "JTest@socex.com",
    password: "1234"
  });

  db.user.insertOne({
    username: "zbarnz",
    email: "zbarnz@socnet.org",
    password: "1234"
  });

  db.meeting.insertOne({
    name: "How to cook a big meaty sausage",
    owner_id: new ObjectID(),
    date: "Munday"
  });

  db.meeting.insertOne({
    name: "Discussion of de-obuscating firewalls and amicus curiae brief",
    owner_id: new ObjectID(),
    date: "01/23/22"
  });
}

Populate();