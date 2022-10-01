const Topic     = require('../models/topic');
const Takeaway  = require('../models/takeaway');
const authUtils = require('../util/authorization');
const ObjectId  = require('mongoose').Types.ObjectId;

module.exports = {
  create: async( req, res ) => {
    const new_topic = req.body;

    await authUtils.checkParticipant( new_topic.meeting_id, req.credentials );

    const topic = await Topic.create({
      ...new_topic,
      owner_id: req.credentials.sub
    });

    return res.status( 201 ).send( topic );
  },

  update: async( req, res ) => {
    const updates = req.body;
    const { _id } = req.params;

    const sub_id = req.credentials.sub;

    await authUtils.checkOwner( _id, 'topics', req.credentials );

    const topic_updated = await Topic.findOneAndUpdate(
      { _id },
      { ...updates, owner_id: sub_id },
      { new: true }
    );

    res.status( 200 ).send( topic_updated );
  },

  delete: async( req, res ) => {
    const { _id } = req.params;

    await authUtils.checkOwner( _id, 'topics', req.credentials );

    await Topic.deleteOne({ _id });

    return res.status( 204 ).send();
  },

  like: async( req, res ) => {
    const { _id } = req.params;
    const { email } = req.body;

    const topic = await Topic.findOne({ _id });

    await authUtils.checkParticipant( topic.meeting_id, req.credentials );

    if ( !topic.likes.includes( email ) ) {
      topic.likes.push( email );
    } else {
      topic.likes = topic.likes.filter( ( email ) => {
        return email !== email;
      });
    }

    const updated = await Topic.findOneAndUpdate(
      { _id },
      { likes: topic.likes },
      { new: true }
    );

    return res.status( 200 ).send( updated );
  },

  close: async( req, res ) => {
    const { _id } = req.params;

    const topic = await Topic.findOne({ _id });

    await authUtils.checkParticipant( topic.meeting_id, req.credentials );

    const updated = await Topic.findOneAndUpdate(
      { _id },
      { status: 'closed' },
      { new: true }
    );

    return res.status( 200 ).send( updated );
  },

  switch: async( req, res ) => {
    const { _id } = req.params;

    const topic = await Topic.findOne({ _id });

    await authUtils.checkParticipant( topic.meeting_id, req.credentials );

    // Making two queries isn't ideal but this does avoid the potential for
    // multiple topics to be live at once; a state that would be difficult to
    // recover from.
    await Topic.updateMany(
      { meeting_id: topic.meeting_id, status: 'live' },
      { status: 'open' }
    );

    const updated = await Topic.findOneAndUpdate(
      { _id },
      { status: 'live' },
      { new: true }
    );

    return res.status( 200 ).send( updated );
  },

  getTakeaways: async( req, res ) => {
    const { _id } = req.params;

    const topic = await Topic.findOne({ _id });

    await authUtils.checkParticipant( topic.meeting_id, req.credentials );

    const takeaways = await Takeaway.find({ topic_id: _id });

    res.status( 200 ).send( takeaways );
  }
};
